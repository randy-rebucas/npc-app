import { NextResponse } from "next/server";

export async function GET() {
    console.log('Fetching members...');
    // const response = await fetch('https://flex-api.sharetribe.com/v1/api/members');
    // console.log(response);
    const response = await fetch('https://api.memberstack.io/v1/members', {
        headers: {
            'Authorization': `Bearer ${process.env.MEMBERSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
        },
    });
    console.log(response);
    // const data = await response.json();
    // return NextResponse.json(data);
    return NextResponse.json({ message: 'Members fetched successfully' });
}