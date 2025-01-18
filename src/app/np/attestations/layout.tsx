export default function AttestationsLayout({
  children,
  modal
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 min-h-screen w-full">
      {children}
      {modal}
    </div>
  );
}