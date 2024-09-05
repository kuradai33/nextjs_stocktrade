import { RefObject, SetStateAction, useState } from "react";
import ReactECharts from "echarts-for-react";

import ResultDetail from "./ResultDetail";
import ResultChart from "./ResultChart";
import { SignalType } from "@/app/lib/defines";

export default function Page(props: {
    resultRef: RefObject<HTMLDivElement>;
    results: {
        activeTab: SignalType;
        stockSymbol: string;
        stockName: string;
        totalProfit: string;
        totalGain: string;
        totalLoss: string;
        cntGain: string;
        cntLoss: string;
        details: { startDate: string; endDate: string; outcome: "Gain" | "Loss"; amount: string }[];
    };
}) {
    const results = props.results;

    const [chartVisible, setChartVisible] = useState(false);
    const [chartData, setChartData] = useState([
        { date: "", open: 0, close: 0, high: 0, low: 0, emashort: 0, emalong: 0 },
    ]);
    const [chartDate, setChartDate] = useState<string[]>([]);
    const [chartEMAShort, setChartEMAShort] = useState<number[]>([]);
    const [chartEMALong, setChartEMALong] = useState<number[]>([]);
    const [chartEMAShortSpan, setChartEMAShortSpan] = useState(13);
    const [chartEMALongSpan, setChartEMALongSpan] = useState(26);

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

    return (
        <>
            <div className="p-3">
                <div ref={props.resultRef} className="flex flex-col bg-white p-6">
                    {/* Stock Symbol and Name */}
                    <h2 className="text-2xl font-bold mb-4">
                        {results.stockSymbol} - {results.stockName} ({results.activeTab})
                    </h2>

                    {/* Summary */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold">合計: ¥{results.totalProfit}</h3>
                        <div className="flex flex-row">
                            <h4 className="basis-1/3 text-base font-semibold text-green-500">
                                利益: ¥{results.totalGain}
                            </h4>
                            <h4 className="basis-1/3 text-base font-semibold text-red-500">
                                損失: ¥{results.totalLoss}
                            </h4>
                        </div>
                        <div className="flex flex-row">
                            <h4 className="basis-1/3 text-base font-semibold text-green-500">
                                利益回数: {results.cntGain} 回
                            </h4>
                            <h4 className="basis-1/3 text-base font-semibold text-red-500">
                                損失回数: {results.cntLoss} 回
                            </h4>
                        </div>
                    </div>

                    <div className="flex flex-1">
                        {/* Detailed Results */}
                        <ResultDetail
                            stockSymbol={results.stockSymbol}
                            details={results.details}
                            setChartData={setChartData}
                            setChartDate={setChartDate}
                            setChartEMAShort={setChartEMAShort}
                            setChartEMALong={setChartEMALong}
                            chartEMAShortSpan={chartEMAShortSpan}
                            chartEMALongSpan={chartEMALongSpan}
                            setChartEMAShortSpan={setChartEMAShortSpan}
                            setChartEMALongSpan={setChartEMALongSpan}
                            setChartVisible={setChartVisible}
                        />

                        {/* Stock Chart */}
                        {chartVisible && (
                            <ResultChart
                                chartData={chartData}
                                chartDate={chartDate}
                                chartVisible={chartVisible}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
