
export default function FindMatchLayout({
    children,
    modal,
}: {
    children: React.ReactNode
    modal: React.ReactNode
}) {

    return (
        <>
            {children}
            {modal}
        </>
    );
}