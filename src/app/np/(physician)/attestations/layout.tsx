
export default function AttestationsLayout({
  children,
  modal
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {

  return (
    <div className="min-h-screen w-full bg-background">
      {children}
      {modal}
    </div>
  );
}