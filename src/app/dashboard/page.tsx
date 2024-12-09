import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <LogoutButton />
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Welcome, {session.user?.name || 'User'}!</h2>
            <p className="text-gray-600">Email: {session.user?.email}</p>
          </div>
          
          {/* Add your dashboard content here */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Quick Stats</h3>
              <p className="text-gray-600">Your dashboard content goes here</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Recent Activity</h3>
              <p className="text-gray-600">Your activity content goes here</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 