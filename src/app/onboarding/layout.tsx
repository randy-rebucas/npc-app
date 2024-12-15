export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <h1>Onboarding Steps</h1>
            {children}
        </div>
    );
}