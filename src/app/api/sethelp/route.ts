import { NextRequest } from "next/server";
import { setHelpText } from "@/app/lib/db";

export async function POST(request: NextRequest) {
    const body = await request.json();

    const result = await setHelpText(body.signal, body.text ? body.text : "");

    return new Response();
}
