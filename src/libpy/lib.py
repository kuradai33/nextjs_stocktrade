import os
import sys
import datetime as dt
import pandas as pd
import yfinance as yf
from prisma import Prisma

# symbolの銘柄コードのデータをstart~endの範囲で取得
def get_dataframe(symbol: str, start: dt.date, end: dt.date, debug = False):
    symbolname = symbol.replace(".", "") # ファイル名に変換
    if not(os.path.exists("./stockdatas")): # .csv保存用フォルダがなかったら作成
        os.mkdir("./stockdatas")
    # .csvが存在する
    #   .csvのデータ行がない
    #     → 新たにデータを取得
    #   指定された範囲のデータがすでに存在する
    #     → .csvが全データを取得
    #   存在しないデータがある ※全データが範囲外だったらエラー？
    #     前のデータがない
    #       → 取得して.csvのデータと結合
    #     後のデータがない
    #       → 取得して.csvのデータと結合
    #     → .csvと新たなデータからデータを取得
    # .csvが存在しない
    #   → 新たにデータを取得
    if os.path.exists("./stockdatas/" + symbolname + ".csv"): # .csvが存在
        dfcsv = pd.read_csv("./stockdatas/" + symbolname + ".csv")
        dfcsv["Date"] = pd.to_datetime(dfcsv["Date"]) # "Date"列を時系列に
        dfcsv.set_index("Date", inplace = True) # 日付をindexに設定(inplace=Trueで保存)
        if len(dfcsv) == 0: # .csvは存在するがデータがない
            df = yf.download(symbol, start = start, end = end + dt.timedelta(1)) # その場で必要分をダウンロード
            df.reset_index(inplace = True) # Dateに変更を加えるためindexをリセット(inplace=Trueで変更を保存)
            df["Date"] = pd.to_datetime(df["Date"]) # Dateを日付に変更
            df.set_index("Date", inplace = True) # indexを日付戻す
            df.to_csv("./stockdatas/" + symbolname + ".csv") # .csvに書き込み
            if(debug): print("got new data", file = sys.stderr)
            return df
        csvStartDate = datetime_to_date(dfcsv.index[0]) # 日付の最古と最新を取得
        csvEndDate = datetime_to_date(dfcsv.index[-1])
        if csvStartDate <= start and end <= csvEndDate: # すでにデータが存在する
            if(debug): print("used existed data", file = sys.stderr)
        else: # 存在しないデータがある
            if start < csvStartDate: # 前のデータが存在しない
                predf = yf.download(symbol, start = start, end = csvStartDate)
                if len(predf) > 0: # 新たなデータが取得された
                    predf.reset_index(inplace = True) # 日付を時系列データにしてindexに
                    predf["Date"] = pd.to_datetime(predf["Date"])
                    predf.set_index("Date", inplace = True)
                    dfcsv = pd.concat([predf, dfcsv]) # 結合
                    if(debug): print("got predata", file = sys.stderr)
            if csvEndDate < end: # 後のデータが存在しない
                postdf = yf.download(symbol, start = csvEndDate + dt.timedelta(1), end = end + dt.timedelta(1))
                if len(postdf) > 0: # 新たなデータが取得された
                    postdf.reset_index(inplace = True) # 日付を時系列データにしてindexに
                    postdf["Date"] = pd.to_datetime(postdf["Date"])
                    postdf.set_index("Date", inplace = True)
                    if datetime_to_date(postdf.index[0]) != datetime_to_date(dfcsv.index[-1]): # データに被りがない
                        dfcsv = pd.concat([dfcsv, postdf]) # 結合
                        if(debug): print("got postdata", file = sys.stderr)
            dfcsv.to_csv("./stockdatas/" + symbolname + ".csv") # .csvに書き込み
            if(debug): print("used existed data and new data", file = sys.stderr)
        redf = dfcsv[start.strftime(DATE_FORMAT) : end.strftime(DATE_FORMAT)] # 指定された範囲のデータだけ取り出す
        return redf
    else: # .csvが存在しない
        df = yf.download(symbol, start = start, end = end + dt.timedelta(1)) # その場で必要分をダウンロード
        df.reset_index(inplace = True) # 日付を時系列データにしてindexに
        df["Date"] = pd.to_datetime(df["Date"])
        df.set_index("Date", inplace = True)
        df.to_csv("./stockdatas/" + symbolname + ".csv") # .csvに書き込み
        if(debug): print("got new data", file = sys.stderr)
        return df