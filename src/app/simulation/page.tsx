"use client";

import { useState, useRef } from "react";

import Form from "./component/Form";
import Tabs from "./component/Tabs";
import Setting from "./component/Setting";
import Result from "./component/Results/Result";
import { SignalType } from "../lib/defines";

export default function Page() {
    const [activeTab, setActiveTab] = useState<SignalType>("smashday");
    const [stockSymbol, setStockSymbol] = useState<string>("7203");
    const [stockName, setStockName] = useState("トヨタ自動車");

    const [helpMessage, setHelpMessage] = useState("");

    const [resultVisible, setResultVisible] = useState(false);
    const [totalProfit, setTotalProfit] = useState("");
    const [totalGain, setTotalGain] = useState("");
    const [totalLoss, setTotalLoss] = useState("");
    const [cntGain, setCntGain] = useState("");
    const [cntLoss, setCntLoss] = useState("");
    const [details, setDetails] = useState<
        { startDate: string; endDate: string; outcome: "Gain" | "Loss"; amount: string }[]
    >([]);

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
                    helpMessage={helpMessage}
                    setHelpMessage={setHelpMessage}
                    resultRef={resultRef}
                    sets={{
                        setTotalProfit: setTotalProfit,
                        setTotalGain: setTotalGain,
                        setTotalLoss: setTotalLoss,
                        setCntGain: setCntGain,
                        setCntLoss: setCntLoss,
                        setDetails: setDetails,
                        setResultVisible: setResultVisible,
                    }}
                />
            </div>

            {/* Simulation Result */}
            {resultVisible && (
                <Result
                    resultRef={resultRef}
                    results={{
                        activeTab: activeTab,
                        stockSymbol: stockSymbol,
                        stockName: stockName,
                        totalProfit: totalProfit,
                        totalGain: totalGain,
                        totalLoss: totalLoss,
                        cntGain: cntGain,
                        cntLoss: cntLoss,
                        details: details,
                    }}
                />
            )}
        </div>
    );
}
