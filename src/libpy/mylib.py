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
        elif start != newDatas[0] or end != newDatas[-1]:
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
    except:
        print("Error: 重複したデータが追加されました")

    return