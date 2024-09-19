import { NextRequest } from "next/server";
import { SimulateSwingplay, roundByDigit } from "@/app/lib/db";
import { SignalType } from "@/app/lib/defines";

type Body = {
    mode: SignalType;
    symbol: string;
    start: string;
    end: string;
    tradeType: "buy" | "sell" | "both";
    closingPeriod: number;
    EMAShortStartSwingplay: number;
    EMAShortEndSwingplay: number;
    EMALongStartSwingplay: number;
    EMALongEndSwingplay: number;
};

export async function POST(request: NextRequest) {
    const body: Body = await request.json();

    const {
        mode,
        symbol,
        start,
        end,
        tradeType,
        closingPeriod,
        EMAShortStartSwingplay,
        EMAShortEndSwingplay,
        EMALongStartSwingplay,
        EMALongEndSwingplay,
    } = body;

    let results: number[][] = [], shorts: string[] = [], longs: string[] = [];
    for (let i = EMAShortStartSwingplay; i <= EMAShortEndSwingplay; i++) {
        shorts.push(String(i));
    }
    for (let i = EMALongStartSwingplay; i <= EMALongEndSwingplay; i++) {
        longs.push(String(i));
    }
    for (let i = EMAShortStartSwingplay; i <= EMAShortEndSwingplay; i++) {
        for (let j = EMALongStartSwingplay; j <= EMALongEndSwingplay; j++) {
            const resultProfit = (await SimulateSwingplay({
                symbol: symbol,
                start: start,
                end: end,
                tradeType: tradeType,
                closingPeriod: closingPeriod,
                EMA: { short: i, long: j },
            })).sumAll;
            results.push([i - EMAShortStartSwingplay, j - EMALongStartSwingplay, roundByDigit(resultProfit, 2)]);
        }
    }

    // 二次元number配列のみを返す
    return new Response(JSON.stringify({shorts: shorts, longs: longs, datas: results}));
}
