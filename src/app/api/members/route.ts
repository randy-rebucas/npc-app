import members from "../db";

export async function GET() {
  return Response.json(members);
}

export async function POST(request: Request) {
  const { email, firstName, lastName } = await request.json();
  const newMember = {
    id: String(members.length + 1),
    email,
    firstName,
    lastName,
  };
  members.push(newMember);
  return Response.json(newMember);
}
