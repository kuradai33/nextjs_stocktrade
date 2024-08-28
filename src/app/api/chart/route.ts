import { NextRequest } from "next/server"
import { getStockData } from "@/app/lib/db"

export async function POST(request: NextRequest) {
    const body = await request.json();

    console.log(body.symbol + body.start + body.end);

    const stockData = await getStockData({symbol: body.symbol, start: body.start, end: body.end});

    console.log(stockData);

    return new Response(JSON.stringify({stockData: (await stockData)}));
}