import members from "../../db";

export async function GET(request: Request, context: { params: { id: string } }) {
  const { id } = context.params;
  const member = members.find((member) => member.id === id);
  return Response.json(member);
}

export async function PUT(request: Request, context: { params: { id: string } }) {
  const { id } = context.params;
  const { email, firstName, lastName } = await request.json();
  const member = members.find((member) => member.id === id);
  if (member) {
    member.email = email;
    member.firstName = firstName;
    member.lastName = lastName;
  }
  return Response.json(member);
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
  const { id } = context.params;
  const member = members.find((member) => member.id === id);
  const memberIndex = members.findIndex((member) => member.id === id);
  if (memberIndex > -1) {
    members.splice(memberIndex, 1);
  }
  return Response.json(member);
}
