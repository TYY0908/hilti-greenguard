"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function Home() {
    const [data, setData] = useState<any[]>([]);
    const [time, setTime] = useState("");
    const [scanning, setScanning] = useState(true);

    const fetchData = async () => {
        try {
            setScanning(true);

            const res = await axios.get("https://hilti-greenguard.onrender.com/workloads");

            const workloads = res.data.workloads || [];
            setData(workloads);
            setTime(new Date().toLocaleTimeString());

            // ALERT SYSTEM
            workloads.forEach((w: any) => {
                if (w.analysis.overall > 70) {
                    toast.error(`CRITICAL: ${w.name}`);
                } else if (w.analysis.overall > 40) {
                    toast(`WARNING: ${w.name}`, {
                        icon: "⚠️",
                    });
                }
            });

        } catch (err) {
            toast.error("Backend connection failed");
        } finally {
            setScanning(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    // INSIGHTS ENGINE
    const worst = data.reduce((a, b) =>
        (a.analysis?.overall || 0) > (b.analysis?.overall || 0) ? a : b, data[0] || {}
    );

    const highestCost = data.reduce((a, b) =>
        (a.analysis?.cost || 0) > (b.analysis?.cost || 0) ? a : b, data[0] || {}
    );

    const totalRisk = data.reduce((s, w) => s + (w.analysis?.overall || 0), 0);
    const avgRisk = data.length ? (totalRisk / data.length).toFixed(1) : 0;

    const chartData = data.map(w => ({
        name: w.name,
        cost: w.analysis.cost,
        carbon: w.analysis.carbon,
        security: w.analysis.security
    }));

    return (
        <div className="flex min-h-screen bg-[#0f172a] text-white">

            <Toaster />

            {/* SIDEBAR */}
            <div className="w-64 bg-[#111827] p-4 hidden md:block">
                <h2 className="text-lg font-bold mb-6">🌍 GreenGuard</h2>

                <div className="space-y-3 text-sm text-gray-300">
                    <p>📊 Dashboard</p>
                    <p>🚨 Alerts</p>
                    <p>🌱 Carbon Monitor</p>
                    <p>🔐 Security</p>
                    <p>⚙ Optimization</p>
                </div>

                <div className="mt-10 text-xs text-gray-500">
                    Status: LIVE SYSTEM
                </div>
            </div>

            {/* MAIN */}
            <div className="flex-1 p-6">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">
                        🚀 Hilti GreenGuard Platform
                    </h1>

                    <div className="text-sm text-gray-400">
                        {scanning ? "🔄 Scanning cloud..." : "✅ Idle"} | {time}
                    </div>
                </div>

                {/* KPI */}
                <div className="grid grid-cols-3 gap-4 mb-6">

                    <div className="bg-[#1e293b] p-4 rounded">
                        <p className="text-gray-400">Avg Risk</p>
                        <p className="text-red-400 text-xl font-bold">{avgRisk}</p>
                    </div>

                    <div className="bg-[#1e293b] p-4 rounded">
                        <p className="text-gray-400">Workloads</p>
                        <p className="text-green-400 text-xl font-bold">{data.length}</p>
                    </div>

                    <div className="bg-[#1e293b] p-4 rounded">
                        <p className="text-gray-400">Highest Risk</p>
                        <p className="text-yellow-400 text-sm font-bold">
                            {worst.name || "N/A"}
                        </p>
                    </div>

                </div>

                {/* INSIGHTS */}
                <div className="bg-[#1e293b] p-4 rounded mb-6">
                    <h2 className="font-bold mb-2">🧠 Smart Insights</h2>
                    <p>🔥 Worst workload: {worst.name || "-"}</p>
                    <p>💰 Highest cost: {highestCost.name || "-"}</p>
                </div>

                {/* CHART */}
                <div className="bg-[#1e293b] p-4 rounded mb-6">
                    <h2 className="font-bold mb-4">📊 Cloud Analytics</h2>

                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="cost" fill="#facc15" />
                            <Bar dataKey="carbon" fill="#22c55e" />
                            <Bar dataKey="security" fill="#ef4444" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* WORKLOADS */}
                <div className="space-y-4">

                    {data.map((w) => (
                        <div key={w.id} className="bg-[#1e293b] p-4 rounded">
                            <div className="flex justify-between">
                                <h3 className="font-bold">{w.name}</h3>
                                <span className="text-xs text-gray-400">
                                    Score {w.analysis.overall}
                                </span>
                            </div>

                            <p className="text-sm text-gray-300 mt-2">
                                💡 {w.recommendation}
                            </p>
                        </div>
                    ))}

                </div>

            </div>
        </div>
    );
}