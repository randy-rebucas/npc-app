import { NextResponse } from "next/server";
import connect from "@/lib/db";
import CalendarAccessToken from "@/app/models/CalendatAccessToken";
import mongoose from "mongoose";
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;

    try {
        await connect();
        const accessToken = await CalendarAccessToken.findOne({ user: new mongoose.Types.ObjectId(id) });
        return NextResponse.json({ access_token: accessToken?.access_token });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;

    try {   
        await connect();
        await CalendarAccessToken.deleteOne({ user: id });
        return NextResponse.json({ message: "Calendar disconnected successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
