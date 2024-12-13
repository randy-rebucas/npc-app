import { NextResponse } from "next/server";

export async function GET() {
    const response = await fetch('https://flex-api.sharetribe.com/v1/api/members');
    const data = await response.json();
    return NextResponse.json(data);
}