import { MemberstackAdminService } from "@/utils/memberstack-admin";
import MemberDetail from "@/components/member/MemberDetail";

export default async function DetailPage({
    params,
}: {
    params: { id: string };
}) {
    const { data: member } = await MemberstackAdminService.getMemberById(params.id);

    if (!member) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="text-destructive text-center mt-4">
                    <h2 className="text-3xl font-bold">Oops!</h2>
                    <p className="text-lg">We couldn&apos;t find the member you&apos;re looking for.</p>
                </div>
            </div>
        );
    }

    return <MemberDetail member={member} returnPath="/admin/dashboard/members/webhook" />;
}