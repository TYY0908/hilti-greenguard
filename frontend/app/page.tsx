"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        router.push("/dashboard");
    }, []);

    return (
        <div className="flex items-center justify-center h-screen text-white bg-[#0f172a]">
            Redirecting to Dashboard...
        </div>
    );
}