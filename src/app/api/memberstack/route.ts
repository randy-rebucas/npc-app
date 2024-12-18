import Member from "@/app/models/Member";

export async function POST(request: Request) {
  const body = await request.json();
  const member = new Member(body);
  const savedMember = await member.save();

  return Response.json(savedMember);
}
