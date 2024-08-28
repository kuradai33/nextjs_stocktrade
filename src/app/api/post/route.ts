import { NextRequest } from "next/server"
import { SimulateSmashday } from "@/app/lib/db"

export async function POST(request: NextRequest) {
    const body = await request.json();

    const result = SimulateSmashday({symbol: body.symbol, start: body.start, end: body.end, tradeType: body.tradeType, HLBand: body.HLBand, EMA: {short: body.EMAShort, long: body.EMALong}});

    return new Response(JSON.stringify({total: (await result).sumAll, totalGain: (await result).sumGain, totalLoss: (await result).sumLoss, cntGain: (await result).cntGain, cntLoss: (await result).cntLoss, details: (await result).details}));
}