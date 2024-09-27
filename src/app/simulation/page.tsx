"use client";

import { useState, useRef } from "react";

import Form from "./component/Form";
import Tabs from "./component/Tabs";
import Setting from "./component/Setting";
import Result from "./component/Results/Result";
import { SignalType } from "../lib/defines";

export default function Page() {
    const [activeTab, setActiveTab] = useState<SignalType>("swingplay");
    const [stockSymbol, setStockSymbol] = useState<string>("7203");
    const [stockName, setStockName] = useState("トヨタ自動車");
    const [modeHeatmap, setModeHeatmap] = useState(false);

    const [helpMessage, setHelpMessage] = useState("");

    const [resultVisible, setResultVisible] = useState(true);
    const [result, setResult] = useState<{
        totalProfit: string;
        totalGain: string;
        totalLoss: string;
        cntGain: string;
        cntLoss: string;
        details: { startDate: string; endDate: string; outcome: "Gain" | "Loss"; amount: string }[];
    }>({ totalProfit: "", totalGain: "", totalLoss: "", cntGain: "", cntLoss: "", details: [] });

    const [chartDatas, setChartDatas] = useState<{
        date: string;
        open: number;
        close: number;
        high: number;
        low: number;
        hband?: number;
        lband?: number;
        emashort?: number;
        emalong?: number;
    }[]>([]);

    const [resultHeatmap, setResultHeatmap] = useState<{dataHeatmap: number[][], shortHeatmap: string[], longHeatmap: string[]}>({dataHeatmap: [], shortHeatmap: [], longHeatmap: []});

    const resultRef = useRef<HTMLDivElement>(null);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Form */}
            <Form />

            <div className="p-8">
                {/* Title */}
                <h1 className="text-4xl font-bold text-center mb-8">株トレードシミュレーター</h1>

                {/* Tabs */}
                <Tabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    setHelpMessage={setHelpMessage}
                />

                {/* Setting */}
                <Setting
                    activeTab={activeTab}
                    stockSymbol={stockSymbol}
                    setStockSymbol={setStockSymbol}
                    stockName={stockName}
                    setStockName={setStockName}
                    modeHeatmap={modeHeatmap}
                    setModeHeatmap={setModeHeatmap}
                    helpMessage={helpMessage}
                    setHelpMessage={setHelpMessage}
                    resultRef={resultRef}
                    setResult={setResult}
                    setChartDatas={setChartDatas}
                    setResultHeatmap={setResultHeatmap}
                    setResultVisible={setResultVisible}
                />
            </div>

            {/* Simulation Result */}
            {resultVisible && (
                <Result
                    resultRef={resultRef}
                    result={{
                        activeTab: activeTab,
                        stockSymbol: stockSymbol,
                        stockName: stockName,
                        modeHeatmap: modeHeatmap,
                        resultData: result,
                        chartDatas: chartDatas,
                        resultHeatmap: resultHeatmap,
                    }}
                />
            )}
        </div>
    );
}
