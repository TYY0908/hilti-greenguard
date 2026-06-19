"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Alerts() {
    const [alerts, setAlerts] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get("http://127.0.0.1:8000/workloads");

            const risky = (res.data.workloads || []).filter(
                (w: any) => w.analysis.overall > 40
            );

            setAlerts(risky);
        };

        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">🚨 Alerts Center</h1>

            <div className="space-y-4">
                {alerts.map((a) => (
                    <div
                        key={a.id}
                        className="bg-red-500/10 border border-red-500 p-4 rounded-xl"
                    >
                        <h2 className="font-bold">{a.name}</h2>
                        <p>Risk Score: {a.analysis.overall}</p>
                        <p className="text-sm text-gray-300">{a.recommendation}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}