import RequestedFeature from "@/app/models/RequesedtFeature";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import connect from "@/lib/db";

export async function POST(req: Request) {
  try {
    await connect();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await req.json();

    const requestedFeature = new RequestedFeature({
      email: session?.user?.email,
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
