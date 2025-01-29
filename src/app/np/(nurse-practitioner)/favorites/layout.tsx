export default function FavoritesLayout({
    children,
    modal
}: {
    children: React.ReactNode,
    modal: React.ReactNode
}) {
    return (
        <>
            {children}
            {modal}
        </>
    );
}