import connect from "@/lib/db";
import MedicalLicenseState from "../models/MedicalLicenseState";

export async function getMedicalLicenseStates() {
  connect();
  const medicalLicenseStates = await MedicalLicenseState.find({}).exec();
  const transformedMedicalLicenseStates = medicalLicenseStates.map(state => state.state);
  return transformedMedicalLicenseStates;
}

