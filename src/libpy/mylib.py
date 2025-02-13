import asyncio
import os
import sys
import datetime as dt
import pandas as pd
import pandas._libs.tslibs.timestamps as pdtime
import yfinance as yf
from prisma import Prisma

DATE_FORMAT = "%Y-%m-%d"

def getDateformat():
    return DATE_FORMAT

def incStrDate(strDate: str):
    def str_to_date(stri):
        strDatetime = dt.datetime.strptime(str(stri), DATE_FORMAT)
        return dt.date(strDatetime.year, strDatetime.month, strDatetime.day)
    return (str_to_date(strDate) + dt.timedelta(days = 1)).strftime(DATE_FORMAT)

# symbolの銘柄コードのデータをstart~endの範囲で取得
async def updateDB(symbol: str, start: str, end: str):
    '''
    symbol: 4文字のコード
    '''
    print(symbol, "を取得しました")
    symbolcode = symbol + ".T" # 検索用コードに変換

    prisma = Prisma()
    await prisma.connect()
    symbolData = await prisma.stocks.find_unique(
        where={"code": symbol},
    )
    if symbolData == None:
        print("無効なシンボルです")
        return
    
    symbol_id = symbolData.id
    
    oldestData = await prisma.stockprices.find_first(
        where={
            "stock_id": symbol_id,
        },
        order={
            "date": "asc",
        }
    )
    latestData = await prisma.stockprices.find_first(
        where={
            "stock_id": symbol_id,
        },
        order={
            "date": "desc",
        }
    )

    if(oldestData == None or latestData == None):
        return
    oldestDate = oldestData.date
    latestDate = latestData.date

    registerData = []

    def addData(startdate: str, enddate: str):
        print("[", startdate, ",", enddate, ")のデータを取得しました")
        df: pd.DataFrame = yf.download(symbolcode, start = startdate, end = enddate)
        # print(df)
        def convertData(dict: tuple[pdtime.Timestamp, dict[str, float]]):
            (date, value) = dict
            strdate = str(date)[0: 10]

            convertedDict = {}
            convertedDict["stock_id"] = symbol_id
            convertedDict["date"] = strdate
            convertedDict["date_num"] = (date.year - 2000) * 366 + (date.month - 1) * 31 + date.day - 1
            convertedDict["open"] = value["Open"]
            convertedDict["close"] = value["Close"]
            convertedDict["high"] = value["High"]
            convertedDict["low"] = value["Low"]
            convertedDict["volume"] = value["Volume"]
            return convertedDict
        newDatas = list(map(lambda x: convertData(x), df.to_dict(orient="index").items())) # type: ignore
        
        if newDatas == []:
            return
        elif newDatas[-1]["date"] < startdate:
            return
        else:
            registerData.extend(newDatas)
        
    if start < oldestDate:
        addData(start, oldestDate)
    if latestDate < end:
        addData(incStrDate(latestDate), incStrDate(end))

    # print("以下のデータをデータベースに追加しました")
    # print(registerData)
    try:
        await prisma.stockprices.create_many(
            data=registerData
        )
        print("Success: 追加されました")
    except:
        print("Error: 重複したデータが追加されました")

    return

# 指定された銘柄の指定された範囲の株価データを取得しデータベースに追加する
async def addStockPricesDB(symbolCode: str, symbolId: int, startDate: str, endDate: str, checkStockSplit: bool) -> bool:
    # YahooFinanceからデータを取得
    df: pd.DataFrame = yf.download(
        symbolCode + ".T",
        start = startDate,
        end = endDate,
        actions=True
    )

    if checkStockSplit:
        # 株式分割が起こった
        for v in df["Stock Splits"]:
            if v > 0:
                return True

    # DataFrameをオブジェクトの配列に変換
    def convertData(dict: tuple[pdtime.Timestamp, dict[str, float]]):
        (date, value) = dict
        # 日付を取得(時刻が含まれるため文字列変換して前を取り出す)
        strdate = str(date)[0: 10]

        convertedDict = {}
        convertedDict["stock_id"] = symbolId
        convertedDict["date"] = strdate
        convertedDict["date_num"] = (date.year - 2000) * 366 + (date.month - 1) * 31 + date.day - 1
        convertedDict["open"] = value["Open"]
        convertedDict["close"] = value["Close"]
        convertedDict["high"] = value["High"]
        convertedDict["low"] = value["Low"]
        convertedDict["volume"] = value["Volume"]
        return convertedDict
    
    newDatas = list(map(lambda x: convertData(x), df.to_dict(orient="index").items())) # type: ignore
    # データベースに登録
    print("[", startDate, ",", endDate, ")のデータを追加します")
    try:
        await prisma.stockprices.create_many(
            data=newDatas  # type: ignore
        )
        print("Success: データを追加しました")
    except:
        print("Error: 重複したデータが追加されました")
    return False

async def updateStockPricesDB(symbolCode: str, symbolId: int, startDate: str, endDate: str):
    # prismaに接続
    await prisma.connect()
    
    # データベース内の最古と最新のデータを取得
    oldestData = await prisma.stockprices.find_first(
        where={ "stock_id": symbolId },
        order={ "date": "asc" },
    )
    latestData = await prisma.stockprices.find_first(
        where={ "stock_id": symbolId },
        order={ "date": "desc" },
    )

    if oldestData == None or latestData == None: # データが存在しない
        await addStockPricesDB(symbolCode, symbolId, startDate, incStrDate(endDate), False)
        return
    else:
        latestDate = latestData.date
        oldestDate = oldestData.date
        if latestDate < endDate: # 新しい側のデータを追加する
            stockSplit = await addStockPricesDB(symbolCode, symbolId, incStrDate(latestDate), incStrDate(endDate), True)
            if stockSplit: # 株式分割が起こった
                print("株式分割が発生しています。データを一度削除します")
                # データベース内のデータを削除
                await prisma.stockprices.delete_many(
                    where={ "stock_id": symbolId },
                )
                # データベースにデータを追加
                await addStockPricesDB(symbolCode, symbolId, min(startDate, oldestDate), incStrDate(endDate), False)
                return
        if startDate < oldestDate: # 古い側のデータを追加する
            await addStockPricesDB(symbolCode, symbolId, startDate, oldestDate, False)

    # prismaの接続を切断
    await prisma.disconnect()