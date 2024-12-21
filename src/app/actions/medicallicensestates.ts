import connect from "@/lib/db";
import MedicalLicenseState from "../models/MedicalLicenseState";
import PracticeType from "../models/PracticeType";

export async function getMedicalLicenseStates() {
  connect();
  const medicalLicenseStates = await MedicalLicenseState.find({}).exec();
  const transformedMedicalLicenseStates = medicalLicenseStates.map(state => state.state);
  return transformedMedicalLicenseStates;
}

export async function getPracticeTypes() {
  connect();
  const practiceTypes = await PracticeType.find({}).exec();
  const transformedPracticeTypes = practiceTypes.map(type => type.type);
  return transformedPracticeTypes;
}
