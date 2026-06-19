"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
    const [data, setData] = useState<any[]>([]);

    const mostRisky = [...data].sort((a, b) => b.analysis.overall - a.analysis.overall)[0];
    const mostExpensive = [...data].sort((a, b) => b.analysis.cost - a.analysis.cost)[0];
    const mostEfficient = [...data].sort((a, b) => a.analysis.overall - b.analysis.overall)[0];

    <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-4 rounded-xl mb-6">

        <h2 className="font-bold mb-2">🧠 Smart Insights Engine</h2>

        <p>🔥 Most Risky: {mostRisky?.name}</p>
        <p>💰 Most Expensive: {mostExpensive?.name}</p>
        <p>🌿 Most Efficient: {mostEfficient?.name}</p>

    </div>

    const highestRisk = data.reduce((max, w) =>
        w.analysis.overall > (max?.analysis?.overall || 0) ? w : max, null
    );

    const highestCost = data.reduce((max, w) =>
        w.analysis.cost > (max?.analysis?.cost || 0) ? w : max, null
    );

    <div className="grid grid-cols-2 gap-4 mb-6">

        <div className="bg-[#111c33] p-4 rounded-xl">
            <p className="text-gray-400">🔥 Highest Risk</p>
            <p className="font-bold">{highestRisk?.name}</p>
        </div>

        <div className="bg-[#111c33] p-4 rounded-xl">
            <p className="text-gray-400">💰 Highest Cost</p>
            <p className="font-bold">{highestCost?.name}</p>
        </div>

    </div>

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get("https://hilti-greenguard.onrender.com/workloads");
            setData(res.data.workloads || []);
        };

        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    const avgRisk =
        data.length > 0
            ? (data.reduce((a, b) => a + b.analysis.overall, 0) / data.length).toFixed(1)
            : 0;

    return (
        <div>

            <h1 className="text-2xl font-bold mb-6">
                📊 Cloud Monitoring Dashboard
            </h1>

            {/* KPI GRID */}
            <div className="grid grid-cols-3 gap-4 mb-8">

                <div className="bg-[#111c33] p-5 rounded-xl border border-gray-800">
                    <p className="text-gray-400 text-sm">Avg Risk Score</p>
                    <p className="text-3xl font-bold text-red-400">{avgRisk}</p>
                </div>

                <div className="bg-[#111c33] p-5 rounded-xl border border-gray-800">
                    <p className="text-gray-400 text-sm">Active Workloads</p>
                    <p className="text-3xl font-bold text-green-400">{data.length}</p>
                </div>

                <div className="bg-[#111c33] p-5 rounded-xl border border-gray-800">
                    <p className="text-gray-400 text-sm">System Status</p>
                    <p className="text-3xl font-bold text-blue-400">LIVE</p>
                </div>

            </div>

            {/* WORKLOAD PREVIEW */}
            <div className="space-y-4">

                {data.map((w) => (
                    <div
                        key={w.id}
                        className="bg-[#111c33] border border-gray-800 p-4 rounded-xl"
                    >
                        <div className="flex justify-between">
                            <h2 className="font-semibold">{w.name}</h2>
                            <span className="text-xs text-gray-400">
                                Risk {w.analysis.overall}
                            </span>
                        </div>

                        <p className="text-sm text-gray-400 mt-2">
                            Region: {w.region} | CPU: {w.cpu}%
                        </p>
                    </div>
                ))}

            </div>

        </div>
    );
}