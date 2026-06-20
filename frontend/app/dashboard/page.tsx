"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip
} from "recharts";

export default function Dashboard() {
    const [data, setData] = useState<any[]>([]);
    const [time, setTime] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);

            const res = await axios.get(
                "https://hilti-greenguard.onrender.com/workloads"
            );

            const workloads = res.data.workloads || [];

            setData(workloads);

            setTime(
                new Date().toLocaleTimeString()
            );

        } catch {
            toast.error("Backend connection failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        const interval = setInterval(
            fetchData,
            60000
        );

        return () => clearInterval(interval);
    }, []);

    const avgRisk =
        data.length > 0
            ? (
                data.reduce(
                    (a, b) =>
                        a +
                        (b.analysis?.overall || 0),
                    0
                ) / data.length
            ).toFixed(1)
            : "0";

    const mostRisky =
        [...data].sort(
            (a, b) =>
                (b.analysis?.overall || 0) -
                (a.analysis?.overall || 0)
        )[0];

    const mostExpensive =
        [...data].sort(
            (a, b) =>
                (b.analysis?.cost || 0) -
                (a.analysis?.cost || 0)
        )[0];

    const mostEfficient =
        [...data].sort(
            (a, b) =>
                (a.analysis?.overall || 0) -
                (b.analysis?.overall || 0)
        )[0];

    const chartData =
        data.map((w) => ({
            name: w.name,
            cost: w.analysis?.cost,
            carbon: w.analysis?.carbon,
            security: w.analysis?.security,
        }));

    return (
        <div className="text-white">

            <Toaster position="top-right" />

            {/* HEADER */}

            <div className="mb-8">

                <h1 className="text-4xl font-bold">
                    🌍 Hilti GreenGuard
                </h1>

                <p className="text-gray-400 mt-2">
                    Continuous Security +
                    Carbon Monitoring
                </p>

                <p className="text-sm text-cyan-400 mt-2">
                    {loading
                        ? "🔄 Scanning Cloud..."
                        : `Last Scan • ${time}`}
                </p>

            </div>

            {/* KPI */}

            <div className="grid md:grid-cols-4 gap-4 mb-8">

                <div className="bg-[#111c33] p-5 rounded-xl">
                    <p className="text-gray-400">
                        Avg Risk
                    </p>

                    <p className="text-4xl text-red-400 font-bold">
                        {avgRisk}
                    </p>
                </div>

                <div className="bg-[#111c33] p-5 rounded-xl">
                    <p className="text-gray-400">
                        Workloads
                    </p>

                    <p className="text-4xl text-green-400 font-bold">
                        {data.length}
                    </p>
                </div>

                <div className="bg-[#111c33] p-5 rounded-xl">
                    <p className="text-gray-400">
                        Carbon Alerts
                    </p>

                    <p className="text-4xl text-yellow-400 font-bold">
                        {
                            data.filter(
                                (w) =>
                                    w.analysis?.carbon >
                                    30
                            ).length
                        }
                    </p>
                </div>

                <div className="bg-[#111c33] p-5 rounded-xl">
                    <p className="text-gray-400">
                        Status
                    </p>

                    <p className="text-4xl text-cyan-400 font-bold">
                        LIVE
                    </p>
                </div>

            </div>

            {/* INSIGHTS */}

            <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl p-6 mb-8">

                <h2 className="font-bold text-xl mb-4">
                    🧠 Smart Insights Engine
                </h2>

                <div className="space-y-2">

                    <p>
                        🔥 Highest Risk:
                        {" "}
                        {mostRisky?.name || "-"}
                    </p>

                    <p>
                        💰 Highest Cost:
                        {" "}
                        {mostExpensive?.name || "-"}
                    </p>

                    <p>
                        🌿 Most Efficient:
                        {" "}
                        {mostEfficient?.name || "-"}
                    </p>

                </div>

            </div>

            {/* CHART */}

            <div className="bg-[#111c33] rounded-xl p-5 mb-8">

                <h2 className="mb-4 text-xl font-bold">
                    📈 Cloud Analytics
                </h2>

                <ResponsiveContainer
                    width="100%"
                    height={280}
                >

                    <BarChart data={chartData}>

                        <XAxis dataKey="name" />

                        <YAxis />

                        <Tooltip />

                        <Bar
                            dataKey="security"
                            fill="#ef4444"
                        />

                        <Bar
                            dataKey="carbon"
                            fill="#22c55e"
                        />

                        <Bar
                            dataKey="cost"
                            fill="#eab308"
                        />

                    </BarChart>

                </ResponsiveContainer>

            </div>

            {/* WORKLOADS */}

            <div className="space-y-4">

                {data.map((w) => (

                    <div
                        key={w.id}
                        className="bg-[#111c33] rounded-xl p-5"
                    >

                        <div className="flex justify-between">

                            <h2 className="font-bold">
                                {w.name}
                            </h2>

                            <span className="text-red-400">
                                Risk:
                                {" "}
                                {w.analysis?.overall}
                            </span>

                        </div>

                        <p className="mt-2 text-gray-300">
                            🌍 {w.region}
                        </p>

                        <p className="mt-1 text-gray-400">
                            {w.recommendation}
                        </p>

                    </div>

                ))}

            </div>

        </div>
    );
}