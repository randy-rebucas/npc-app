import UserProfile from "@/app/models/UserProfile";
import User from "@/app/models/User";
import connect from "@/lib/db";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  try {
    await connect();
    const body = await request.json();
    const userId = body.userId;

    const userProfile = new UserProfile({
      firstName: body.firstName,
      lastName: body.lastName,
      medicalLicenseStates: body.medicalLicenseStates || [],
      deaLicenseStates: body.deaLicenseStates || [],
      practiceTypes: body.practiceTypes || [],
      monthlyCollaborationRate: body.monthlyCollaborationRate,
      additionalStateFee: body.additionalStateFee,
      additionalNPFee: body.additionalNPFee,
      controlledSubstancesMonthlyFee: body.controlledSubstancesMonthlyFee,
      controlledSubstancesPerPrescriptionFee: body.controlledSubstancesPerPrescriptionFee,
      description: body.description,
      boardCertification: body.boardCertification,
      additionalCertifications: body.additionalCertifications || [],
      linkedinProfile: body.linkedinProfile,
      profilePhotoPath: body.profilePhotoPath,
      governmentIdPath: body.governmentIdPath,
      user: userId,
    });

    const userProfileResponse = await userProfile.save();

    await User.findByIdAndUpdate(userId, { onboardingStatus: "completed" });

    return Response.json({ userProfileResponse });
  } catch (error) {
    console.error("Error in onboarding:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
