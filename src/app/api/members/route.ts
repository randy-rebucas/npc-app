import { NextResponse } from 'next/server'
import { MemberstackAdminService } from '@/utils/memberstack-admin'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = parseInt(searchParams.get('perPage') || '10')

    const members = await MemberstackAdminService.listMembers(page, perPage)
    return NextResponse.json(members)
  } catch (error) {
    console.error("Error in members:", error);
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { memberId, updateData } = body

    const updated = await MemberstackAdminService.updateMember(memberId, updateData)
    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error in members:", error);
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 })
  }
}
