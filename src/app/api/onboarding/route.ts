import UserProfile from "@/app/models/UserProfile";
import User from "@/app/models/User";
import connect from "@/lib/db";
import bcrypt from "bcrypt";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  try {
    await connect();
    const body = await request.json();

    // Generate random password (12 characters)
    const generatePassword = () => {
      const chars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
      return Array.from(crypto.getRandomValues(new Uint32Array(12)))
        .map((x) => chars[x % chars.length])
        .join("");
    };
    const plainPassword = generatePassword();

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    const user = new User({
      username: body.email.split("@")[0],
      email: body.email,
      password: hashedPassword,
      onboardingStatus: "completed",
    });

    const userResponse = await user.save();

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
      user: userResponse._id.toString(),
    });

    const userProfileResponse = await userProfile.save();

    return Response.json({ userProfileResponse });
  } catch (error) {
    console.error("Error in onboarding:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
