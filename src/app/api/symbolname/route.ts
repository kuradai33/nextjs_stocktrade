import { NextRequest } from "next/server";
import { getSymbolName } from "@/app/lib/db";

export async function POST(request: NextRequest) {
    const body = await request.json();

    let stockName = await getSymbolName(body.symbol);

    if(!stockName) stockName = "未知のシンボル";

    return new Response(JSON.stringify({stockName: stockName}));
}