import { NextRequest } from "next/server";
import { getStockData, addIndicator, roundByDigit } from "@/app/lib/db";

export async function POST(request: NextRequest) {
    const body = await request.json();

    const rawStockData = addIndicator(
        await getStockData({ symbol: body.symbol, start: body.start, end: body.end, extradate: 5 }),
        {
            HLBand: null, EMA: { short: body.emashort, long: body.emalong },
            RSIBB: null
        }
    );

    const stockData = rawStockData.map((item) => {
        return [
            roundByDigit(item.open, 2),
            roundByDigit(item.close, 2),
            roundByDigit(item.low, 2),
            roundByDigit(item.high, 2),
        ];
    });
    const stockDate = rawStockData.map((item) => {
        return item.date;
    });
    const stockEMAShort = rawStockData.map((item) => {
        return item.emashort;
    });
    const stockEMALong = rawStockData.map((item) => {
        return item.emalong;
    });

    return new Response(
        JSON.stringify({
            stockData: stockData,
            stockDate: stockDate,
            stockEMAShort: stockEMAShort,
            stockEMALong: stockEMALong,
        })
    );
}
