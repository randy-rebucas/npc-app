import { getServerSession } from "next-auth";
import Breadcrumbs from "./breadcrumbs";
import { SignOut } from "./signout";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getUserByEmail } from "@/app/actions/user";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
}

export default async function Header({ breadcrumbs }: { breadcrumbs: Breadcrumb[] }) {
  // Get session
  const session = await getServerSession(authOptions);
  // Add user fetch using server action
  const user = session?.user?.email ? await getUserByEmail(session.user.email) : null;

  return (
    <header className="w-full top-0 z-50 bg-white/90 dark:bg-gray-900/90 border-b border-gray-100 dark:border-gray-800 shadow-sm backdrop-blur-md">
      <nav className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Breadcrumbs breadcrumbs={breadcrumbs} />

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.profile?.profilePhotoPath} alt={user?.username} />
                <AvatarFallback className="rounded-lg">{user?.username?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.username}</span>
                <span className="truncate text-xs text-gray-700 dark:text-gray-300">{user?.email}</span>
              </div>
            </div>
            <SignOut />
          </div>
        </div>
      </nav>
    </header>
  );
}