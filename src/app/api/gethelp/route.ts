import { NextRequest } from "next/server";

import { HelpMessages } from "@/app/lib/data";

export async function POST(request: NextRequest) {
    const body = await request.json();

    // キャッシュからヘルプメッセージを取得
    const result = await HelpMessages.getHelpmessage(body.signal);

    return new Response(JSON.stringify({ text: result }));
}