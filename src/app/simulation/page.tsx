"use client";

import { FormEvent, useState, useRef, ChangeEvent, SetStateAction } from "react";
import ReactECharts from "echarts-for-react";

import Form from "./component/Form";
import Tabs from "./component/Tabs";
import Setting from "./component/Setting";
import { SignalType } from "../lib/defines";

export default function Page() {
    const [activeTab, setActiveTab] = useState<SignalType>("smashday");
    const [stockSymbol, setStockSymbol] = useState<string>("7203");

    const [helpMessage, setHelpMessage] = useState("");

    const [resultVisible, setResultVisible] = useState(false);
    const [chartVisible, setChartVisible] = useState(false);
    const [stockName, setStockName] = useState("トヨタ自動車");
    const [totalProfit, setTotalProfit] = useState("");
    const [totalGain, setTotalGain] = useState("");
    const [totalLoss, setTotalLoss] = useState("");
    const [cntGain, setCntGain] = useState("");
    const [cntLoss, setCntLoss] = useState("");
    const [details, setDetails] = useState([
        { startDate: "2019-01-01", endDate: "2024-01-01", outcome: "Gain", amount: "100" },
    ]);

    const [chartData, setChartData] = useState([
        { date: "", open: 0, close: 0, high: 0, low: 0, emashort: 0, emalong: 0 },
    ]);
    const [chartDate, setChartDate] = useState([""]);
    const [chartEMAShort, setChartEMAShort] = useState([0]);
    const [chartEMALong, setChartEMALong] = useState([0]);
    const [chartEMAShortSpan, setChartEMAShortSpan] = useState(13);
    const [chartEMALongSpan, setChartEMALongSpan] = useState(26);

    const resultRef = useRef<HTMLDivElement>(null);

    let options = {
        legend: {
            data: ["日付", "MA5", "MA10", "MA20", "MA30"],
            inactiveColor: "#777",
        },
        tooltip: {
            trigger: "axis",
            axisPointer: {
                animation: false,
                type: "cross",
                lineStyle: {
                    color: "#376df4",
                    width: 2,
                    opacity: 1,
                },
            },
        },
        xAxis: {
            type: "category",
            data: chartDate,
            axisLine: { lineStyle: { color: "#8392A5" } },
        },
        yAxis: {
            scale: true,
            axisLine: { lineStyle: { color: "#8392A5" } },
            splitLine: { show: false },
        },
        grid: {
            bottom: 80,
        },
        dataZoom: [
            {
                textStyle: {
                    color: "#8392A5",
                },
                dataBackground: {
                    areaStyle: {
                        color: "#8392A5",
                    },
                    lineStyle: {
                        opacity: 0.8,
                        color: "#8392A5",
                    },
                },
                brushSelect: true,
            },
            {
                type: "inside",
            },
        ],
        series: [
            {
                type: "candlestick",
                name: "Day",
                data: chartData,
                itemStyle: {
                    color: "#FD1050",
                    color0: "#0CF49B",
                    borderColor: "#FD1050",
                    borderColor0: "#0CF49B",
                },
            },
            // {
            //     name: "EMA Short",
            //     type: "line",
            //     data: chartEMAShort,
            //     smooth: true,
            //     showSymbol: false,
            //     lineStyle: {
            //         width: 1,
            //     },
            // },
            // {
            //     name: "EMA Long",
            //     type: "line",
            //     data: chartEMALong,
            //     smooth: true,
            //     showSymbol: false,
            //     lineStyle: {
            //         width: 1,
            //     },
            // },
        ],
    };

    const submitChart = async (start: string, end: string) => {
        try {
            const response = await fetch("http://192.168.0.105:3000/api/chart", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    symbol: stockSymbol,
                    start: start,
                    end: end,
                    emashort: chartEMAShortSpan,
                    emalong: chartEMALongSpan,
                }),
            });
            const jsonData = await response.json();
            setChartData(jsonData.stockData);
            setChartDate(jsonData.stockDate);
            setChartEMAShort(jsonData.stockEMAShort);
            setChartEMALong(jsonData.stockEMALong);
            setChartVisible(true);
        } catch (err) {
            alert("メッセージの送信が失敗しました");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Form */}
            <Form />

            <div className="p-8">
                {/* Title */}
                <h1 className="text-4xl font-bold text-center mb-8">シミュレーター</h1>

                {/* Tabs */}
                <Tabs activeTab={activeTab} setActiveTab={setActiveTab} setHelpMessage={setHelpMessage}/>

                {/* Setting */}
                <Setting
                    activeTab={activeTab}
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
                <div className="p-3">
                    <div ref={resultRef} className="flex flex-col bg-white p-6">
                        {/* Stock Symbol and Name */}
                        <h2 className="text-2xl font-bold mb-4">
                            {stockSymbol} - {stockName}
                        </h2>

                        {/* Summary */}
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold">合計: ¥{totalProfit}</h3>
                            <div className="flex flex-row">
                                <h4 className="basis-1/3 text-base font-semibold text-green-500">
                                    合計利益: ¥{totalGain}
                                </h4>
                                <h4 className="basis-1/3 text-base font-semibold text-red-500">
                                    合計損失: ¥{totalLoss}
                                </h4>
                            </div>
                            <div className="flex flex-row">
                                <h4 className="basis-1/3 text-base font-semibold text-green-500">
                                    利益回数: {cntGain} 回
                                </h4>
                                <h4 className="basis-1/3 text-base font-semibold text-red-500">
                                    損失回数: {cntLoss} 回
                                </h4>
                            </div>
                        </div>

                        <div className="flex flex-1">
                            {/* Detailed Results */}
                            <div className="w-1/3 pl-4">
                                <div className="overflow-x-auto h-screen overflow-y-scroll">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr>
                                                <th className="border-b py-2 px-4">期間</th>
                                                <th className="border-b py-2 px-4">損得</th>
                                                <th className="border-b py-2 px-4">量</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {details.map((detail, index) => (
                                                <tr
                                                    key={index}
                                                    onClick={() =>
                                                        submitChart(
                                                            detail.startDate,
                                                            detail.endDate
                                                        )
                                                    }
                                                    className="cursor-pointer hover:bg-gray-200"
                                                >
                                                    <td className="border-b py-2 px-4">
                                                        {detail.startDate} ~ {detail.endDate}
                                                    </td>
                                                    <td
                                                        className={`border-b py-2 px-4 ${
                                                            detail.outcome === "Gain"
                                                                ? "text-green-500"
                                                                : "text-red-500"
                                                        }`}
                                                    >
                                                        {detail.outcome}
                                                    </td>
                                                    <td
                                                        className={`border-b py-2 px-4 ${
                                                            detail.outcome === "Gain"
                                                                ? "text-green-500"
                                                                : "text-red-500"
                                                        }`}
                                                    >
                                                        {detail.amount}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Stock Chart */}
                            <div className="w-2/3 pr-4">
                                {chartVisible && (
                                    <div>
                                        <div className="flex flex-row">
                                            <h3 className="text-xl font-semibold">チャート</h3>
                                            <div className="flex flex-col px-2">
                                                <h6>短期EMA</h6>
                                                <input
                                                    type="number"
                                                    id="chartEMAShort"
                                                    value={chartEMAShortSpan}
                                                    onChange={(e) =>
                                                        setChartEMAShortSpan(Number(e.target.value))
                                                    }
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                />
                                            </div>
                                            <div className="flex flex-col px-2">
                                                <h6>長期EMA</h6>
                                                <input
                                                    type="number"
                                                    id="chartEMALong"
                                                    value={chartEMALongSpan}
                                                    onChange={(e) =>
                                                        setChartEMALongSpan(Number(e.target.value))
                                                    }
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                />
                                            </div>
                                        </div>
                                        <div className="h-screen overflow-x-scroll">
                                            <ReactECharts option={options} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
