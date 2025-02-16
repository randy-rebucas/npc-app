import UserProfile from "@/app/models/UserProfile";
import User, { UserOnBoardingStatus } from "@/app/models/User";
import connect from "@/lib/db";
import { EmailService } from "@/lib/email";
import Template from "@/app/models/Template";

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
      phone: body.phone,
      medicalLicenseStates: body.medicalLicenseStates || [],
      deaLicenseStates: body.deaLicenseStates || [],
      practiceTypes: body.practiceTypes || [],
      npiNumber: body.npiNumber,
      monthlyCollaborationRate: body.monthlyCollaborationRate,
      additionalStateFee: body.additionalStateFee,
      additionalNPFee: body.additionalNPFee,
      controlledSubstancesMonthlyFee: body.controlledSubstancesMonthlyFee,
      description: body.description,
      boardCertification: body.boardCertification,
      additionalCertifications: body.additionalCertifications || [],
      linkedinProfile: body.linkedinProfile,
      profilePhotoPath: body.profilePhotoPath,
      governmentIdPath: body.governmentIdPath,
      user: userId,
    });

    await userProfile.save();
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { onBoardingStatus: UserOnBoardingStatus.COMPLETED } }
    );

    // Get the default template for onboarding complete
    let template = await Template.findOne({ isDefault: true, type: "email", code: "onboarding-complete" });
    if (!template) {
      template = await Template.findOne({ type: "email", code: "onboarding-complete" });
    }

    const emailService = new EmailService();
    await emailService.sendEmail({
      to: { email: user.email! },
      subject: template?.name || "Onboarding Complete",
      htmlContent: template?.content || "<p>Your onboarding is complete. You can now start collaborating with other NPs.</p>",
      sender: {
        name: process.env.NEXT_PUBLIC_APP_NAME || "npcollaborator",
        email: process.env.NEXT_PUBLIC_APP_EMAIL || "noreply@npcollaborator.com",
      },
      replyTo: {
        name: process.env.NEXT_PUBLIC_APP_NAME || "npcollaborator",
        email: process.env.NEXT_PUBLIC_APP_EMAIL || "noreply@npcollaborator.com",
      },
    });

    return Response.json({ user });
  } catch (error) {
    console.error("Error in onboarding:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
