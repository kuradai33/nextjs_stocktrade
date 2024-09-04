import { NextRequest } from "next/server";
import { getHelpText } from "@/app/lib/db";

export async function POST(request: NextRequest) {
    const body = await request.json();

    const result = await getHelpText(body.signal);

    return new Response(JSON.stringify({ text: result }));
}
