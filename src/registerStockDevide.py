import asyncio
import csv
import datetime
from prisma import Prisma

# 株式分割の日付を/src/datas/stock_devide.csvを元にデータベースに追加

async def main() -> None:
    prisma = Prisma()
    await prisma.connect()

    header = True
    with open('./src/datas/stock_devide.csv', encoding='shift_jis') as f:
        data = csv.reader(f)
        for line in data:
            if header:
                header = False
                continue

            # 権利落日と比率をデータベースの形式に加工
            processed_date = datetime.datetime.strptime(line[1], "%Y/%m/%d").strftime("%Y-%m-%d")
            rate = float(line[4].split(":")[1])
            # print(processed_date, line[2], rate)

            try:
                # データベースから銘柄IDを取得
                symbol_data = (await prisma.stocks.find_unique(
                    where={"code": line[2]},
                ))
                if symbol_data == None: # 銘柄コードが存在しない
                    continue
                symbol_id = symbol_data.id

                # データベースに追加
                user = await prisma.datesstockdevide.create(
                    data={
                        "stock_id": symbol_id,
                        "applied_date": processed_date,
                        "rate": rate
                    }
                )
            except:
                print("銘柄コード", line[2], "は存在しません")
            

    await prisma.disconnect()

asyncio.run(main())