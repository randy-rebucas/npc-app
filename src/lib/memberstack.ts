import { MemberStack } from "@memberstack/nextjs";

export const memberstack = new MemberStack(process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY as string);