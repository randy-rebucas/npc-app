import { UserOnBoardingStatus, UserSubmissionStatus } from "@/app/models/User";
import { EmailService } from "@/lib/email";
import { updateUser, getUser } from "@/app/actions/user";
import Template from "@/app/models/Template";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userId = body.userId;

    const userData = await getUser(userId);

    const data = {
      username: userData.username,
      primaryEmail: body.profile.email,
      primaryPhone: body.profile.phone,
      name: userData.name,
      avatar: body.profilePhotoPath,
      customData: {
        role: body.userType,
        onboardingStatus: UserOnBoardingStatus.COMPLETED,
        submissionStatus: UserSubmissionStatus.APPROVED,
        canCreateListings: false,
        profilePhotoPath: body.profilePhotoPath,
        governmentIdPath: body.governmentIdPath,
        npiNumber: body.npiNumber,
        medicalLicenseStates: body.licenseAndCertification.medicalLicenseStates,
        deaLicenseStates: body.licenseAndCertification.deaLicenseStates,
        practiceTypes: body.practiceTypes,
        rateMatrix: body.rateMatrix,
        backgroundCertification: body.backgroundCertification,
        description: body.description,
        boardCertification: body.boardCertification,
        additionalCertifications: body.additionalCertifications || [],
        linkedinProfile: body.linkedinProfile,
      },
      profile: {
        familyName: body.profile.lastName,
        givenName: body.profile.firstName,
      },
    };
    console.log(data);
    await updateUser(userId, data);

    // return Response.json({ message: "Onboarding completed successfully" });
    // Get the default template for onboarding complete
    let template = await Template.findOne({ isDefault: true, type: "email", code: "onboarding-complete" });
    if (!template) {
      template = await Template.findOne({ type: "email", code: "onboarding-complete" });
    }

    const emailService = new EmailService();
    await emailService.sendEmail({
      to: [{ email: userData.primaryEmail || "" }],  
      subject: template?.name || "Onboarding Complete",
      htmlContent: template?.content || "<p>Your onboarding is complete. You can now start collaborating with other NPs.</p>",
      sender: {
        name: process.env.NEXT_PUBLIC_APP_NAME || "npcollaborator",
        email: process.env.NEXT_PUBLIC_APP_EMAIL || "noreply@npcollaborator.com",
      },
    });
    return Response.json({ message: "Onboarding completed successfully" });
    // return Response.json(body);
  } catch (error) {
    console.error("Error in onboarding:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
