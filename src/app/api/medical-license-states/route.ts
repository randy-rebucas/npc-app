import { getMedicalLicenseStates } from "@/app/actions/medicalLicenseStates";
import { NextResponse } from "next/server";

export async function GET() {
    const medicalLicenseStates = await getMedicalLicenseStates();
    return NextResponse.json(medicalLicenseStates);
}

