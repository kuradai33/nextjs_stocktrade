# import csv

# datas = []

# with open('./src/datas/7203T.csv') as f:
#     data = csv.reader(f)
#     for line in data:
#         if line[0] == 'Date':
#             continue
#         devided_date = line[0].split("-")
#         datas.append([1, line[0], (int(devided_date[0]) - 2000) * 366 + (int(devided_date[1]) - 1) * 31 + int(devided_date[2]) - 1, float(line[1]), float(line[4]), float(line[2]), float(line[3]), int(float(line[6]))])

# with open('./src/datas/7203.csv', 'w') as f:
#     writer = csv.writer(f)
#     writer.writerows(datas)

import csv
import asyncio
from prisma import Prisma

async def main() -> None:
    prisma = Prisma()
    await prisma.connect()

    symbol_id = await prisma.stocks.find_unique(where={ "code": "7203" })

    header = True
    with open('./src/datas/rawCSV/7203T.csv') as f:
        data = csv.reader(f)
        for line in data:
            if header:
                header = False
                continue

            devided_date = line[0].split("-")

            user = await prisma.stockprices.create(
                data={
                    "stock_id": symbol_id.id, # type: ignore
                    "date": line[0],
                    "date_num": (int(devided_date[0]) - 2000) * 366 + (int(devided_date[1]) - 1) * 31 + int(devided_date[2]) - 1,
                    "open": float(line[1]),
                    "high": float(line[2]),
                    "low": float(line[3]),
                    "close": float(line[4]),
                    "volume": int(float(line[6]))
                },
            )

    await prisma.disconnect()

asyncio.run(main())