"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";

export default function Analytics() {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get("http://127.0.0.1:8000/workloads");
            setData(res.data.workloads || []);
        };

        fetchData();
    }, []);

    const riskData = data.map((w) => ({
        name: w.name,
        risk: w.analysis.overall,
    }));

    const costData = data.map((w) => ({
        name: w.name,
        cost: w.analysis.cost,
    }));

    const COLORS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6"];

    return (
        <div className="space-y-8">

            <h1 className="text-2xl font-bold">📊 Analytics Overview</h1>

            {/* RISK CHART */}
            <div className="bg-[#111c33] p-4 rounded-xl">
                <h2 className="mb-4">Risk by Workload</h2>

                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={riskData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="risk" fill="#ef4444" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* COST CHART */}
            <div className="bg-[#111c33] p-4 rounded-xl">
                <h2 className="mb-4">Cost Distribution</h2>

                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={costData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="cost" fill="#3b82f6" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
}