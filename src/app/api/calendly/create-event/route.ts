import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions); 
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { email, name } = await req.json();

    const response = await fetch("https://api.calendly.com/scheduling_links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CALENDLY_API_KEY}`,
      },
      body: JSON.stringify({
        max_event_count: 1,
        owner: `${process.env.CALENDLY_OWNER_URL}/${session?.user?.id}`,
        owner_type: "users",
        event_type: `${process.env.CALENDLY_EVENT_TYPE_URL}/${session?.user?.id}`,
        invitee_email: email,
        invitee_name: name,
      }),
    });

    const data = await response.json();
    console.log(data);  
    // Check if the response was successful and has the expected data
    if (!response.ok) {
      console.error('Calendly API error:', data);
      return NextResponse.json(
        { success: false, message: "Failed to create Calendly event" },
        { status: response.status }
      );
    }

    if (!data.resource?.booking_url) {
      console.error('Invalid Calendly API response:', data);
      return NextResponse.json(
        { success: false, message: "Invalid response from Calendly" },
        { status: 500 }
      );
    }

    return NextResponse.json({ schedulingUrl: data.resource.booking_url });
  } catch (error) {
    console.error("Calendly API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
