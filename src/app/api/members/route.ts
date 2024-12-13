import Member from "@/app/models/Member";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Fetching members...");
    const response = await fetch("https://api.memberstack.io/v1/members", {
      headers: {
        Authorization: `Bearer ${process.env.MEMBERSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log(data);
    // Create and save the member in one step using create()
    const member = new Member(data);
    await member.save();
    
    console.log('Created member:', member);
    return NextResponse.json(member);
  } catch (error) {
    console.error('Error creating member:', error);
    return NextResponse.json(
      { error: 'Failed to create member' },
      { status: 500 }
    );
  }
}
