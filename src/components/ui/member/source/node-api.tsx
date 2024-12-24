import { MemberstackAdminService } from '@/utils/memberstack-admin'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import CustomPagination from "@/components/ui/member/pagination";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

interface Member {
    id: string
    profileImage?: string
    auth: {
        email: string
        status: string
    }
}


export default async function NodeApi({ currentPage, ITEMS_PER_PAGE }: { currentPage: number, ITEMS_PER_PAGE: number }) {
    const { data: members, totalCount: count } = await MemberstackAdminService.listMembers(currentPage, ITEMS_PER_PAGE)
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {members.map((member: Member) => (
                        <TableRow key={member.id}>
                            <TableCell className="flex items-center gap-2">
                                <Avatar>
                                    <AvatarImage src={member.profileImage} />
                                    <AvatarFallback>
                                        {member.auth.email.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell>{member.auth.email}</TableCell>
                            <TableCell>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${member.auth.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {member.auth.status}
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className='mt-5 flex w-full justify-center'>
                <CustomPagination totalPages={totalPages} currentPage={currentPage} />
            </div>
        </div>
    )
}