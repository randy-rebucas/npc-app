import Config from "@/app/models/Config";
import { NextResponse } from "next/server";

export async function GET() {
  const config = await Config.findOne({})
  return NextResponse.json(config)
}

export async function POST(req: Request) {
  const config = await Config.create(await req.json())
  return NextResponse.json(config)
}