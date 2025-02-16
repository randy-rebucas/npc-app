import { MemberstackAdminService } from "@/utils/memberstack-admin";
import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User, {
  UserOnBoardingStatus,
  UserRole,
  UserSubmissionStatus,
} from "@/app/models/User";
import UserProfile from "@/app/models/UserProfile";

interface MemberstackCustomFields {
  "first-name": string;
  "last-name": string;
  phone?: string;
  "active-license-states"?: string;
  "active-dea-states"?: string;
  "practice-types"?: string;
  npi?: string;
  "base-rate"?: string;
  "state-fee"?: string;
  "multi-np-fee"?: string;
  "controlled-substances-needed"?: string;
  background?: string;
  "board-certification"?: string;
  "additional-certification"?: string;
  "linkedin-url"?: string;
  "id-document-url"?: string;
}

interface MemberstackMember {
  id: string;
  auth: { email: string };
  customFields: MemberstackCustomFields;
  profileImage?: string;
  stripeCustomerId?: string;
  metaData: Map<string, string>;
}

const splitString = (str: string) => {
  return str.split(",").map((item) => item.trim());
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const response = await MemberstackAdminService.getMemberById(id);
    const data = response.data as MemberstackMember;

    await connect();

    const existingUser = await User.findOne({ email: data.auth.email });

    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: "User already exists",
      });
    }

    const newUser = await User.create({
      email: data.auth.email,
      username: data.auth.email?.split("@")[0],
      role: UserRole.PHYSICIAN,
      // For social login, we don't store password
      provider: "memberstack",
      onBoardingStatus: UserOnBoardingStatus.INCOMPLETE,
    });
    const medicalLicenses = Array.isArray(
      splitString(data.customFields["active-license-states"] || "")
    )
      ? splitString(data.customFields["active-license-states"] || "").map(
          (state: string) => ({
            state: state,
            licenseNumber: "",
            expirationDate: null,
          })
        )
      : [];

    const deaLicenses = Array.isArray(
      splitString(data.customFields["active-dea-states"] || "")
    )
      ? splitString(data.customFields["active-dea-states"] || "").map(
          (state: string) => ({
            state: state,
            licenseNumber: "",
            expirationDate: null,
          })
        )
      : [];

    const practiceTypes = Array.isArray(splitString(data.customFields["practice-types"] || ""))
      ? splitString(data.customFields["practice-types"] || "")
      : "";

    const additionalCertifications = Array.isArray(
      splitString(data.customFields["additional-certification"] || "")
    )
      ? splitString(data.customFields["additional-certification"] || "")
          .map((certification: string) => ({
            certification: certification,
            issueDate: null,
            expirationDate: null,
            certificateUrl: null,
            certificateNumber: null,
          }))
      : [];

    const userProfile = new UserProfile({
      firstName: data.customFields["first-name"],
      lastName: data.customFields["last-name"],
      phone: data.customFields["phone"],
      medicalLicenseStates: medicalLicenses,
      deaLicenseStates: deaLicenses,
      practiceTypes: practiceTypes,
      npiNumber: data.customFields["npi"],
      monthlyCollaborationRate: data.customFields["base-rate"],
      additionalStateFee: data.customFields["state-fee"],
      additionalNPFee: data.customFields["multi-np-fee"],
      controlledSubstancesMonthlyFee: 0,
      description: data.customFields["background"],
      boardCertification: data.customFields["board-certification"],
      additionalCertifications: additionalCertifications,
      linkedinProfile: data.customFields["linkedin-url"],
      profilePhotoPath: data.profileImage,
      governmentIdPath: data.customFields["id-document-url"],
      user: newUser._id,
    });

    await userProfile.save();
    const user = await User.findOneAndUpdate(
      { _id: newUser._id },
      {
        $set: {
          onBoardingStatus: UserOnBoardingStatus.COMPLETED,
          submissionStatus: UserSubmissionStatus.PENDING,
          stripeAccountId: data.stripeCustomerId,
          memberStackId: id,
        },
      }
    );

    return NextResponse.json({ success: true, user, userProfile });

  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Failed to migrate member",
    });
  }
}
