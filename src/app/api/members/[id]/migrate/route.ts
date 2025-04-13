import { MemberstackAdminService } from "@/utils/memberstack-admin";
import { NextResponse } from "next/server";
import { UserOnBoardingStatus, UserSubmissionStatus } from "@/app/models/User";
import { createUser } from "@/app/actions/user";
import { IUser } from "@/app/models/User";

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
  verified: boolean;
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
    const memberData = response.data as MemberstackMember;

    const medicalLicenses = Array.isArray(
      splitString(memberData.customFields["active-license-states"] || "")
    )
      ? splitString(memberData.customFields["active-license-states"] || "").map(
          (state: string) => ({
            state: state,
            licenseNumber: "",
            expirationDate: null,
          })
        )
      : [];

    const deaLicenses = Array.isArray(
      splitString(memberData.customFields["active-dea-states"] || "")
    )
      ? splitString(memberData.customFields["active-dea-states"] || "").map(
          (state: string) => ({
            state: state,
            licenseNumber: "",
            expirationDate: null,
          })
        )
      : [];

    const practiceTypes = Array.isArray(
      splitString(memberData.customFields["practice-types"] || "")
    )
      ? splitString(memberData.customFields["practice-types"] || "").map((type: string) => 
          type.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
        )
      : [];

    const additionalCertifications = Array.isArray(
      splitString(memberData.customFields["additional-certification"] || "")
    )
      ? splitString(
          memberData.customFields["additional-certification"] || ""
        ).map((certification: string) => ({
          certification: certification,
          issueDate: null,
          expirationDate: null,
          certificateUrl: "",
          certificateNumber: "",
        }))
      : [];
    const data = {
      username: memberData.auth.email.split("@")[0],
      primaryEmail: memberData.auth.email,
      name:
        memberData.customFields["first-name"] +
        " " +
        memberData.customFields["last-name"],
      avatar: memberData.profileImage,
      customData: {
        role: "physician",
        npiNumber: memberData.customFields["npi"],
        rateMatrix: {
          monthlyCollaborationRate: 0,
          additionalStateFee: 0,
          additionalNPFee: 0,
          controlledSubstancesMonthlyFee: 0,
          controlledSubstancesPerPrescriptionFee: 0,
        },
        practiceTypes: practiceTypes,
        governmentIdPath: memberData.customFields["id-document-url"],
        onboardingStatus: UserOnBoardingStatus.COMPLETED,
        submissionStatus: memberData.verified ? UserSubmissionStatus.APPROVED : UserSubmissionStatus.PENDING,
        canCreateListings: false,
        profilePhotoPath: memberData.profileImage,
        licenseAndCertification: {
          medicalLicenseStates: medicalLicenses,
          deaLicenseStates: deaLicenses,
        },
        backgroundCertification: {
          description: memberData.customFields["background"],
          boardCertification: memberData.customFields["board-certification"],
          additionalCertifications: additionalCertifications,
          linkedinProfile: memberData.customFields["linkedin-url"],
        },
        stripeAccountId: memberData.stripeCustomerId,
      },
      profile: {
        familyName: memberData.customFields["last-name"],
        givenName: memberData.customFields["first-name"],
      },
    };

    const user = await createUser(data as Partial<IUser>);

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Failed to migrate member",
    });
  }
}
