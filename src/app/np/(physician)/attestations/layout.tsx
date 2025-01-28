"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function AttestationsLayout({
  children,
  modal
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const { data: session } = useSession();

  useEffect(() => {
    const getUserSubmissionStatus = async (id: string) => {
      const response = await fetch(`/api/user/${id}/submission-status`);
      const data = await response.json();
      if (data.submissionStatus !== 'APPROVED') {
        redirect("/not-authorized");
      }
    }
    if (session) {
      getUserSubmissionStatus(session.user.id);
    }
  }, [session]);

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      {children}
      {modal}
    </div>
  );
}