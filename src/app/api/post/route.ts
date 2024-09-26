import { NextRequest } from "next/server";
import { simulateSmashday, simulateSwingplay } from "@/app/lib/db";

export async function POST(request: NextRequest) {
    const body = await request.json();

    let result: {
        sumAll: number;
        sumGain: number;
        sumLoss: number;
        cntGain: number;
        cntLoss: number;
        details: {
            startDate: string;
            endDate: string;
            tradeType: "Buy" | "Sell" | "";
            outcome: string;
            amount: string;
        }[];
    } = {
        sumAll: 0,
        sumGain: 0,
        sumLoss: 0,
        cntGain: 0,
        cntLoss: 0,
        details: [{ startDate: "", endDate: "", tradeType: "", outcome: "", amount: "" }],
    };
    if (body.mode == "smashday")
        result = await simulateSmashday({
            symbol: body.symbol,
            start: body.start,
            end: body.end,
            tradeType: body.tradeType,
            HLBand: body.HLBand,
            EMA: { short: body.EMAShort, long: body.EMALong },
        });
    else if (body.mode == "swingplay")
        result = await simulateSwingplay({
            symbol: body.symbol,
            start: body.start,
            end: body.end,
            tradeType: body.tradeType,
            EMA: { short: body.EMAShortswingplay, long: body.EMALongswingplay },
            closingPeriod: body.closingPeriod,
            exEMA:
                body.EMAShort && body.EMALong
                    ? { short: body.EMAShort, long: body.EMALong }
                    : undefined,
        });

    return new Response(
        JSON.stringify({
            total: result.sumAll,
            totalGain: result.sumGain,
            totalLoss: result.sumLoss,
            cntGain: result.cntGain,
            cntLoss: result.cntLoss,
            details: result.details,
        })
    );
}
