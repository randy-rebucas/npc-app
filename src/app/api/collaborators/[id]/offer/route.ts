import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import {
  CollaborationRequest,
  CollaborationRequestStatus,
} from "@/app/models/Collaboration";
import Offer, {
  BonusStructureType,
  CompensationType,
  NonCompeteClauseType,
  PositionType,
} from "@/app/models/Offer";
import { OfferStatus } from "@/app/models/Offer";
import User from "@/app/models/User";
import Notification from "@/app/models/Notification";
import { sendEmail } from "@/lib/email";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const collaborationRequest = await CollaborationRequest.findById(
      id
    ).populate("npUser");

    if (!collaborationRequest) {
      return NextResponse.json(
        { error: "Collaboration request not found" },
        { status: 404 }
      );
    }

    // Offer the collaboration
    collaborationRequest.status = CollaborationRequestStatus.OFFERED;
    collaborationRequest.responseMessage = "Offer sent";
    collaborationRequest.respondedAt = new Date();
    const savedCollaborationRequest = await collaborationRequest.save();

    // Create the offer
    const offer = new Offer({
      nursePractitionerUser: collaborationRequest.npUser._id.toString(),
      physicianUser: session.user.id,

      // Compensation details
      baseSalary: 100000,
      compensationType: CompensationType.SALARY,
      bonusStructure: {
        type: BonusStructureType.PERCENTAGE,
        percentage: 10,
      },
      benefits: {
        healthInsurance: true,
        dentalInsurance: true,
        visionInsurance: true,
        retirementPlan: true,
      },

      // Position details
      position: {
        title: "Nurse Practitioner",
        type: PositionType.FULL_TIME,
        schedule: {
          hoursPerWeek: 40,
          shiftsPerWeek: 2,
          callRequirements: "1 call per week",
        },
        location: {
          facility: "Hospital",
          address: "123 Main St",
          city: "Anytown",
          state: "CA",
          zip: "12345",
        },
      },

      // Contract terms
      contractLength: 12,
      probationaryPeriod: 3,
      nonCompeteClause: {
        type: NonCompeteClauseType.NON_COMPETE,
        duration: 1,
        geographicScope: "State",
      },

      // Start and end dates
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000), // 1 year from now

      // Offer status
      status: OfferStatus.PENDING,
      offerDate: new Date(),
      expirationDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      responseDate: null,

      // Additional details
      duties: ["Duty 1", "Duty 2", "Duty 3"],
      requirements: ["Requirement 1", "Requirement 2", "Requirement 3"],
      additionalNotes: "Additional notes",
      collaborationId: savedCollaborationRequest._id,
    });
    const savedOffer = await offer.save();

    if (savedOffer) {
      const npUser = await User.findById(savedCollaborationRequest.npUser);
      // Create a notification for the NP
      await Notification.create({
        user: npUser.id,
        title: "Offer Sent",
        message: "Your offer has been sent",
        link: `/collaborators/${id}/offer/accept`,
      });

      // Send email to NP
      await sendEmail({
        to: npUser.email,
        subject: "Offer Sent",
        body: "Your offer has been sent",
      });

      return NextResponse.json({
        success: true,
        offer: savedOffer,
        collaborationRequest: savedCollaborationRequest
      });
    }

    return NextResponse.json(
      { error: "Failed to create offer" },
      { status: 500 }
    );

  } catch (error) {
    console.error("Error offering collaboration:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
