import { NextRequest } from "next/server";

import { DateStr, StockPriceData } from "@/app/lib/defines";
import { convertDateStrToString } from "@/app/lib/util";
import { simulateSmashday, simulateSwingplay } from "@/app/lib/db";

export async function POST(request: NextRequest) {
    const body = await request.json();

    let resultAll: {
        result: {
            sumAll: number;
            sumGain: number;
            sumLoss: number;
            cntGain: number;
            cntLoss: number;
            details: {
                startDate: DateStr;
                endDate: DateStr;
                tradeType: "Buy" | "Sell" | "";
                outcome: string;
                amount: string;
            }[];
        };
        data: StockPriceData;
    } = {
        result: {
            sumAll: 0,
            sumGain: 0,
            sumLoss: 0,
            cntGain: 0,
            cntLoss: 0,
            details: [],
        },
        data: new StockPriceData(),
    };

    if (body.mode == "smashday")
        resultAll = await simulateSmashday({
            symbol: body.symbol,
            start: body.start,
            end: body.end,
            tradeType: body.tradeType,
            HLBand: body.HLBand,
            EMA: { short: body.EMAShort, long: body.EMALong },
        });
    else if (body.mode == "swingplay")
        resultAll = await simulateSwingplay({
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
    const { result, data } = resultAll;

    return new Response(
        JSON.stringify(
            convertDateStrToString({
                total: result.sumAll,
                totalGain: result.sumGain,
                totalLoss: result.sumLoss,
                cntGain: result.cntGain,
                cntLoss: result.cntLoss,
                details: result.details,
                data: data.convertJsonFormat(),
            })
        )
    );
}
