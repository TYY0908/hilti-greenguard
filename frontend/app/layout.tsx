"use client";

import "./globals.css";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  // fetch alerts every minute
  useEffect(() => {
    let previousRiskCount = 0;

    const fetchAlerts = async () => {
      const res = await fetch("https://hilti-greenguard.onrender.com/workloads");
      const data = await res.json();

      const risky = (data.workloads || []).filter(
        (w: any) => w.analysis.overall > 40
      );

      // ONLY trigger when NEW alerts appear
      if (risky.length > previousRiskCount) {
        setNotification(`⚠ ${risky[0].name} is under risk`);
        setTimeout(() => setNotification(null), 3000);
      }

      previousRiskCount = risky.length;
      setAlerts(risky);
    };

    fetchAlerts();

    const interval = setInterval(fetchAlerts, 60000); // stable 1 min

    return () => clearInterval(interval);
  }, []);

  return (
    <html lang="en">
      <body className="bg-[#0b1220] text-white flex min-h-screen">

        {/* 🍎 MAC STYLE NOTIFICATION */}
        {notification && (
          <div className="fixed top-4 right-4 bg-[#1e293b] border border-gray-700 px-4 py-3 rounded-xl shadow-lg animate-pulse">
            {notification}
          </div>
        )}

        {/* SIDEBAR */}
        <div
          className={`bg-[#0f172a] border-r border-gray-800 transition-all duration-300 ${open ? "w-64" : "w-20"
            }`}
        >
          <div className="p-4 flex items-center justify-between">
            {open && <h1 className="font-bold text-lg">🌍 GreenGuard</h1>}

            <button
              onClick={() => setOpen(!open)}
              className="text-xs bg-gray-800 px-2 py-1 rounded"
            >
              {open ? "←" : "→"}
            </button>
          </div>

          <nav className="mt-6 space-y-2 text-sm">

            <Link className="block px-4 py-2 hover:bg-gray-800" href="/dashboard">
              📊 {open && "Dashboard"}
            </Link>

            <Link className="block px-4 py-2 hover:bg-gray-800 relative" href="/alerts">
              🚨 {open && "Alerts"}

              {/* 🔴 ALERT BADGE */}
              {alerts.length > 0 && (
                <span className="absolute right-2 top-2 bg-red-500 text-xs px-2 py-0.5 rounded-full">
                  {alerts.length}
                </span>
              )}
            </Link>

            <Link className="block px-4 py-2 hover:bg-gray-800" href="/workloads">
              🖥 {open && "Workloads"}
            </Link>

            <Link className="block px-4 py-2 hover:bg-gray-800" href="/analytics">
              📈 {open && "Analytics"}
            </Link>

            <Link className="block px-4 py-2 hover:bg-gray-800" href="/reports">
              📄 {open && "Reports"}
            </Link>

          </nav>
        </div>

        {/* MAIN */}
        <main className="flex-1 p-6">
          {children}
        </main>

      </body>
    </html>
  );
}