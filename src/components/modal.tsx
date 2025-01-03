'use client';

import { useRouter } from "next/navigation";

export default function Modal({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    return (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => router.back()}>
            <div className="bg-white max-w-3xl mx-4 rounded-lg w-full" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
} 