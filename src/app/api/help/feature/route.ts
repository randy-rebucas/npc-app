import RequestedFeature from "@/app/models/RequesedtFeature";
import { logtoConfig } from "@/app/logto";
import { getLogtoContext } from "@logto/next/server-actions";
import { NextResponse } from "next/server";
import connect from "@/lib/db";

export async function POST(req: Request) {
  try {
    await connect();

    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await req.json();

    const requestedFeature = new RequestedFeature({
      email: claims?.email,
      ...data,
    });
    await requestedFeature.save();

    return NextResponse.json({ message: "Feature requested successfully" });
  } catch (error) {
    console.error("Error in request feature:", error);
    return NextResponse.json(
      { error: "Failed to request feature" },
      { status: 500 }
    );
  }
}
