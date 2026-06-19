"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

export default function Reports() {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get("https://hilti-greenguard.onrender.com/workloads");
            setData(res.data.workloads || []);
        };

        fetchData();
    }, []);

    const exportPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text("Hilti GreenGuard Cloud Report", 10, 10);

        let y = 20;

        data.forEach((w) => {
            doc.setFontSize(12);
            doc.text(
                `${w.name} | Risk: ${w.analysis.overall} | Cost: ${w.analysis.cost}`,
                10,
                y
            );
            y += 10;
        });

        doc.save("green-guard-report.pdf");
    };

    return (
        <div className="space-y-6">

            <h1 className="text-2xl font-bold">📄 Reports</h1>

            <button
                onClick={exportPDF}
                className="bg-green-600 px-4 py-2 rounded"
            >
                Download PDF Report
            </button>

            <div className="bg-[#111c33] p-4 rounded-xl mt-6">
                <p className="text-gray-400">
                    This report summarizes cloud risk, carbon footprint and cost efficiency.
                </p>
            </div>

        </div>
    );
}