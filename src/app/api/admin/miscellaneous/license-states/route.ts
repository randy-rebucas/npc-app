import { NextResponse } from "next/server";
import connect from "@/lib/db";
import MedicalLicenseState from "@/app/models/MedicalLicenseState";

export async function POST(request: Request) {
  const data = await request.json();
  try {
    await connect();
    const licenseState = await MedicalLicenseState.create(data);
    return NextResponse.json(licenseState);
  } catch (error) {
    console.error("Error in license state:", error);
    return NextResponse.json(
      { error: "License state not found" },
      { status: 404 }
    );
  }
}