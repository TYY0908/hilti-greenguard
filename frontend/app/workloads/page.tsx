"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Workloads() {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get("https://hilti-greenguard.onrender.com/workloads");
            setData(res.data.workloads || []);
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">🖥 Workloads</h1>

            <div className="space-y-4">

                {data.map((w) => (
                    <div key={w.id} className="bg-[#1e293b] p-4 rounded">
                        <h2 className="font-bold">{w.name}</h2>

                        <p>CPU: {w.cpu}%</p>
                        <p>Region: {w.region}</p>
                        <p>Risk: {w.analysis.overall}</p>
                    </div>
                ))}

            </div>
        </div>
    );
}