export default function HelpLayout({ children, modal }: { children: React.ReactNode, modal: React.ReactNode }) {
    return (
        <>
            {children}
            {modal}
        </>
    );
}