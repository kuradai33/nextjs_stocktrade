import { NextRequest } from "next/server";
import { addMessageInForm } from "@/app/lib/db";

export async function POST(request: NextRequest) {
    const body = await request.json();

    addMessageInForm(body.message);

    return new Response();
}