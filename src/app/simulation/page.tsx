"use client";

import { FormEvent, useState, useRef } from "react";
import { Chart } from "react-google-charts";
import MyChart from "./chart"

export default function Page() {
    const [activeTab, setActiveTab] = useState("smashday");
    const [stockSymbol, setStockSymbol] = useState("7203");
    const [startDate, setStartDate] = useState("2019-01-01");
    const [endDate, setEndDate] = useState("2024-01-01");
    const [tradeType, setTradeType] = useState("buy");
    const [useHLBand, setUseHLBand] = useState(false);
    const [spanHLBand, setSpanHLBand] = useState(20);
    const [useEMA, setUseEMA] = useState(false);
    const [spanEMAShort, setSpanEMAShort] = useState(13);
    const [spanEMALong, setSpanEMALong] = useState(26);

    const [resultVisible, setResultVisible] = useState(true);
    const [chartVisible, setChartVisible] = useState(true);
    const [stockName, setStockName] = useState("");
    const [totalProfit, setTotalProfit] = useState("");
    const [totalGain, setTotalGain] = useState("");
    const [totalLoss, setTotalLoss] = useState("");
    const [cntGain, setCntGain] = useState("");
    const [cntLoss, setCntLoss] = useState("");
    const [details, setDetails] = useState([
        { startDate: "2019-01-01", endDate: "2024-01-01", outcome: "Gain", amount: "100" },
    ]);

    const [chartEMAShort, setChartEMAShort] = useState(13);
    const [chartEMALong, setChartEMALong] = useState(26);
    const [datas, setDatas] = useState([{date: "2024-01-01", open: 0, close: 0, high: 0, low: 0, volume: 0}]);

    const resultRef = useRef<HTMLDivElement>(null);

    const submitSimulation = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/api/post", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mode: activeTab,
                    symbol: stockSymbol,
                    start: startDate,
                    end: endDate,
                    tradeType: tradeType,
                    HLBand: useHLBand ? spanHLBand : null,
                    EMAShort: useEMA ? spanEMAShort : null,
                    EMALong: useEMA ? spanEMALong : null,
                }),
            });
            const jsonData = await response.json();
            setTotalProfit((jsonData.total).toFixed(2));
            setTotalGain((jsonData.totalGain).toFixed(2));
            setTotalLoss((jsonData.totalLoss).toFixed(2));
            setCntGain((jsonData.cntGain));
            setCntLoss((jsonData.cntLoss));
            setDetails(jsonData.details);
            setResultVisible(true);
            resultRef.current?.scrollIntoView({ behavior: "smooth" });
        } catch (err) {
            alert("メッセージの送信が失敗しました");
        }
    };

    const submitChart = async (start: string, end: string) => {
        try {
            const response = await fetch("http://localhost:3000/api/chart", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    symbol: stockSymbol,
                    start: start,
                    end: end,
                }),
            });
            const stockData = (await response.json()).stockData;
            setDatas(stockData);
            setChartVisible(true);
        } catch (err) {
            alert("メッセージの送信が失敗しました");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="p-8">
                <h1 className="text-4xl font-bold text-center mb-8">シミュレーター</h1>

                {/* Tabs */}
                <div className="flex justify-center mb-6">
                    <div className="inline-flex border-b border-gray-300">
                        <button
                            className={`py-2 px-4 text-lg font-semibold ${
                                activeTab === "smashday"
                                    ? "text-blue-500 border-b-2 border-blue-500"
                                    : "text-gray-600"
                            }`}
                            onClick={() => setActiveTab("smashday")}
                        >
                            smashday
                        </button>
                        <button
                            className={`py-2 px-4 text-lg font-semibold ${
                                activeTab === "insideday"
                                    ? "text-blue-500 border-b-2 border-blue-500"
                                    : "text-gray-600"
                            }`}
                            onClick={() => setActiveTab("insideday")}
                        >
                            insideday
                        </button>
                    </div>
                </div>

                {/* Form */}
                <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mb-8">
                    <form onSubmit={submitSimulation}>
                        <div className="mb-4">
                            <label
                                htmlFor="stockSymbol"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                銘柄
                            </label>
                            <input
                                type="text"
                                id="stockSymbol"
                                value={stockSymbol}
                                onChange={(e) => setStockSymbol(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="銘柄シンボルを入力"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="startDate"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                開始日
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="endDate"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                終了日
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="tradeType"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                取引タイプ
                            </label>
                            <select
                                id="tradeType"
                                value={tradeType}
                                onChange={(e) => setTradeType(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="buy">買い</option>
                                <option value="sell">売り</option>
                                <option value="both">両方</option>
                            </select>
                        </div>

                        {/* HLBand Option */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                                HLBandを使用しますか？
                            </label>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="hlband-yes"
                                    name="useHLBand"
                                    value="yes"
                                    checked={useHLBand}
                                    onChange={() => setUseHLBand(true)}
                                    className="mr-2"
                                />
                                <label htmlFor="hlband-yes" className="mr-4">
                                    はい
                                </label>
                                <input
                                    type="radio"
                                    id="hlband-no"
                                    name="useHLBand"
                                    value="no"
                                    checked={!useHLBand}
                                    onChange={() => setUseHLBand(false)}
                                    className="mr-2"
                                />
                                <label htmlFor="hlband-no">いいえ</label>
                            </div>

                            {useHLBand && (
                                <div className="mt-2">
                                    <label
                                        htmlFor="spanHLBand"
                                        className="block text-gray-700 font-medium mb-2"
                                    >
                                        HLBandの期間
                                    </label>
                                    <input
                                        type="number"
                                        id="spanHLBand"
                                        value={spanHLBand}
                                        onChange={(e) => setSpanHLBand(Number(e.target.value))}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        {/* EMA Option */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                                EMAを使用しますか？
                            </label>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="ema-yes"
                                    name="useEMA"
                                    value="yes"
                                    checked={useEMA}
                                    onChange={() => setUseEMA(true)}
                                    className="mr-2"
                                />
                                <label htmlFor="ema-yes" className="mr-4">
                                    はい
                                </label>
                                <input
                                    type="radio"
                                    id="ema-no"
                                    name="useEMA"
                                    value="no"
                                    checked={!useEMA}
                                    onChange={() => setUseEMA(false)}
                                    className="mr-2"
                                />
                                <label htmlFor="ema-no">いいえ</label>
                            </div>

                            {useEMA && (
                                <div className="mt-2">
                                    <label
                                        htmlFor="spanEMAShort"
                                        className="block text-gray-700 font-medium mb-2"
                                    >
                                        EMAの短期期間
                                    </label>
                                    <input
                                        type="number"
                                        id="spanEMAShort"
                                        value={spanEMAShort}
                                        onChange={(e) => setSpanEMAShort(Number(e.target.value))}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />

                                    <label
                                        htmlFor="spanEMALong"
                                        className="block text-gray-700 font-medium mb-2 mt-4"
                                    >
                                        EMAの長期期間
                                    </label>
                                    <input
                                        type="number"
                                        id="spanEMALong"
                                        value={spanEMALong}
                                        onChange={(e) => setSpanEMALong(Number(e.target.value))}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            シミュレーション開始
                        </button>
                    </form>
                </div>
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
                                <h4 className="basis-1/3 text-base font-semibold text-green-500">合計利益: ¥{totalGain}</h4>
                                <h4 className="basis-1/3 text-base font-semibold text-red-500">合計損失: ¥{totalLoss}</h4>
                            </div>
                            <div className="flex flex-row">
                                <h4 className="basis-1/3 text-base font-semibold text-green-500">利益回数: {cntGain} 回</h4>
                                <h4 className="basis-1/3 text-base font-semibold text-red-500">損失回数: {cntLoss} 回</h4>
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
                                                <tr key={index} onClick={() => submitChart(detail.startDate,detail.endDate)}
                                                className="cursor-pointer hover:bg-gray-200">
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
                                                    value={chartEMAShort}
                                                    onChange={(e) => setChartEMAShort(Number(e.target.value))}
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                />
                                            </div>
                                            <div className="flex flex-col px-2">
                                                <h6>長期EMA</h6>
                                                <input
                                                    type="number"
                                                    id="chartEMALong"
                                                    value={chartEMALong}
                                                    onChange={(e) => setChartEMALong(Number(e.target.value))}
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                />
                                            </div>
                                        </div>
                                        <div className="h-[90vh] overflow-x-scroll">
                                            <MyChart height={parent.innerHeight} width={parent.innerWidth} rawdata={datas} emashort={chartEMAShort} emalong={chartEMALong}/>
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
