"use client";

import { useState, useRef } from "react";

import Form from "@/app/simulation/component/Form";
import Tabs from "@/app/simulation/component/Tabs";
import Setting from "@/app/simulation/component/Setting";
import Result from "@/app/simulation/component/Result";
import { SignalType, Settings, SimulationResult, StockPriceData } from "@/app/lib/defines";

export default function Page() {
    // 現在選ばれているタブ
    const [activeTab, setActiveTab] = useState<SignalType>("swingplay");

    const [helpMessage, setHelpMessage] = useState("");

    const [resultVisible, setResultVisible] = useState(true);
    const [result, setResult] = useState<SimulationResult>(new SimulationResult());

    const [chartDatas, setChartDatas] = useState<StockPriceData>(new StockPriceData());

    const [resultHeatmap, setResultHeatmap] = useState<{
        dataHeatmap: number[][];
        shortHeatmap: string[];
        longHeatmap: string[];
    }>({ dataHeatmap: [], shortHeatmap: [], longHeatmap: [] });

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
