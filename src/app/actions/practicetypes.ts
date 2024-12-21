import connect from "@/lib/db";
import PracticeType from "../models/PracticeType";

export async function getPracticeTypes() {
  connect();
  const practiceTypes = await PracticeType.find({}).exec();
  const transformedPracticeTypes = practiceTypes.map((type) => type.type);
  return transformedPracticeTypes;
}
