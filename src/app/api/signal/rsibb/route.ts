import { NextRequest } from "next/server";
import { signalRSIBBAllSymbol } from "@/app/lib/db";

export async function POST(request: NextRequest) {
    const body = await request.json();

    const {date: date, result: results} = await signalRSIBBAllSymbol({date: body.date});
    const buysignals = results.filter((result) => result.signal == "buy" || result.signal == "buy+").map((result) => ({code: result.code, name: result.name, close: result.close, plus: result.signal == "buy+", date: result.date}));
    const sellsignals = results.filter((result) => result.signal == "sell" || result.signal == "sell+").map((result) => ({code: result.code, name: result.name, close: result.close, plus: result.signal == "sell+", date: result.date}));

    return new Response(JSON.stringify({date: date, buysignals: buysignals, sellsignals: sellsignals}));
}
