import asyncio
import time
import datetime as dt
import schedule
from prisma import Prisma

from libpy import mylib

# 株価データベースを更新する

async def updateDetaBase():
    prisma = Prisma()
    await prisma.connect()

    todayDatetime = dt.datetime.now()
    today = dt.date(todayDatetime.year, todayDatetime.month, todayDatetime.day)

    symbolDatas = await prisma.stocks.find_many()
    cnt = 0
    cntAllSymbol = len(symbolDatas)
    for data in symbolDatas:
        cnt += 1
        print(cnt, "/", cntAllSymbol)
        code = data.code
        await mylib.updateDB(code, "2024-01-01", (today + dt.timedelta(days=1)).strftime(mylib.getDateformat()))
        time.sleep(5) # 待機
        
asyncio.run(updateDetaBase())

# if False: # Debug
#     schedule.every().day.at("18:27").do(updateDetaBase)
# else:
#     schedule.every().day.at("18:00").do(updateDetaBase)