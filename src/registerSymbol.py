import requests
import pandas as pd
import csv
import asyncio
from prisma import Prisma

# 最新データを取得してデータベースに銘柄名と銘柄コードを新たに追加する

# excelデータとしてデータを取得
url = "https://www.jpx.co.jp/markets/statistics-equities/misc/tvdivq0000001vg2-att/data_j.xls"
r = requests.get(url)
with open('data_j.xls', 'wb') as output:
    output.write(r.content)
stocklist = pd.read_excel("./data_j.xls")
stocklist.loc[stocklist["市場・商品区分"]=="市場第一部（内国株）",
              ["コード","銘柄名","33業種コード","33業種区分","規模コード","規模区分"]
             ]

# ETF等を除く
codes = stocklist[(stocklist['市場・商品区分'] == 'プライム（内国株式）') | (stocklist['市場・商品区分'] == 'スタンダード（内国株式）') | (stocklist['市場・商品区分'] == 'グロース（内国株式）')]
len(codes)

# excelファイルをcsv化して保存
filename = 'jpx_code2025_1.csv'
codes.to_csv('./src/datas/rawCSV/' + filename)

# データベースに登録
async def main() -> None:
    prisma = Prisma()
    await prisma.connect()

    header = True
    with open('./src/datas/rawCSV/' + filename) as f:
        data = csv.reader(f)
        for line in data:
            if header:
                header = False
                continue
            try:
                user = await prisma.stocks.create(
                    data={
                        "code": line[2],
                        "name": line[3]
                    }
                )
            except:
                pass
            

    await prisma.disconnect()

asyncio.run(main())