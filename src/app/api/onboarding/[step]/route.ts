import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { step: string } }) {
    const step = params.step;
    console.log(step);
    const data = await req.json();
    console.log(data);
    return NextResponse.json({ message: 'Data received' });
}