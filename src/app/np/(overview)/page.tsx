import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'NP',
};

export default async function Dashboard() {

    return (
        <div className="flex items-center justify-between space-y-2">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">
                    Welcome to your dashboard!
                </p>
            </div>
        </div>
    );
}