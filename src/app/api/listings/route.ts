import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import Listing from "@/app/models/Listing";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import Notification from "@/app/models/Notification";
import { EmailService } from "@/lib/email";

export async function GET() {
  try {
    await connect();
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const listings = await Listing.find({ user: session.user.id }).populate(
      "user"
    );

    const formattedListings = listings.map((listing) => ({
      ...listing.toObject(),
      id: listing._id,
      createdAt: listing.createdAt.toISOString(),
      updatedAt: listing.updatedAt.toISOString(),
    }));
    return NextResponse.json(formattedListings);
  } catch (error) {
    console.error("Error in listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connect();

    const body = await request.json();

    const listing = await Listing.create({ ...body, user: session.user.id });

    await Notification.create({
      user: session.user.id,
      title: "New Listing Created",
      message: "A new listing has been created",
      link: `/np/listings/${listing._id}`,
    });

    const emailService = new EmailService();
    await emailService.sendEmail({
      to: { email: session.user.email },
      subject: "New Listing Created",
      htmlContent: "<p>A new listing has been created</p>",
      textContent: "A new listing has been created",
      sender: {
        name: "npcollaborator",
        email: "noreply@npcollaborator.com",
      },
      replyTo: {
        name: "npcollaborator",
        email: "noreply@npcollaborator.com",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Listing created successfully",
    });
  } catch (error) {
    console.error("Error in listings:", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}
