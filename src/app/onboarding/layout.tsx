export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-full max-w-3xl px-4 py-8 mx-auto">
                <div className="p-8 space-y-6 bg-card rounded-lg shadow-sm border">
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Welcome to {process.env.NEXT_PUBLIC_APP_NAME} Onboarding
                        </h1>
                        <p className="text-muted-foreground">
                            Complete these steps to get started
                        </p>
                    </div>
                    <div className="mx-auto">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}