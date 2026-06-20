"use client";

import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const nav = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Workloads", path: "/workloads", icon: "🖥️" },
    { name: "Alerts", path: "/alerts", icon: "🚨" },
    { name: "Analytics", path: "/analytics", icon: "📈" },
    { name: "Reports", path: "/reports", icon: "📄" },
  ];

  return (
    <html lang="en">
      <body className="flex min-h-screen bg-[#0b1220] text-white">

        {/* SIDEBAR */}
        <div className="w-64 bg-[#0f172a] border-r border-gray-800 p-4">
          <h1 className="text-xl font-bold mb-6">
            🌍 GreenGuard
          </h1>

          <nav className="space-y-2">
            {nav.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-3 py-2 rounded hover:bg-gray-800 ${pathname === item.path ? "bg-gray-800" : ""
                  }`}
              >
                {item.icon} {item.name}
              </Link>
            ))}
          </nav>

          <div className="mt-10 text-xs text-gray-500">
            LIVE CLOUD MONITORING
          </div>
        </div>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6">
          {children}
        </main>

      </body>
    </html>
  );
}