import { RefObject, SetStateAction, useState } from "react";

import ResultDetail from "./ResultDetail";
import ResultChart from "./ResultChart";
import ResultHeatmap from "./ResultHeatmap";
import { SignalType } from "@/app/lib/defines";

type Props = {
    resultRef: RefObject<HTMLDivElement>;
    result: {
        activeTab: SignalType;
        stockSymbol: string;
        stockName: string;
        modeHeatmap: boolean;
        resultData: {
            totalProfit: string;
            totalGain: string;
            totalLoss: string;
            cntGain: string;
            cntLoss: string;
            details: {
                startDate: string;
                endDate: string;
                outcome: "Gain" | "Loss";
                amount: string;
            }[];
        };
        resultHeatmap: {
            dataHeatmap: number[][];
            shortHeatmap: string[];
            longHeatmap: string[];
        };
    };
};

export default function Page(props: Props) {
    const { activeTab, stockSymbol, stockName, modeHeatmap, resultData, resultHeatmap } = props.result;
    const { totalProfit, totalGain, totalLoss, cntGain, cntLoss, details } = resultData;
    const { dataHeatmap, shortHeatmap, longHeatmap } = resultHeatmap;

    const [chartVisible, setChartVisible] = useState(false);
    const [chartDatas, setChartDatas] = useState({chartData: [{ date: "", open: 0, close: 0, high: 0, low: 0, emashort: 0, emalong: 0 }], chartDate: [""], chartEMAShort: [0], chartEMALong: [0]});
    const {chartData, chartDate, chartEMAShort, chartEMALong} = chartDatas;

    const [chartEMAShortSpan, setChartEMAShortSpan] = useState(13);
    const [chartEMALongSpan, setChartEMALongSpan] = useState(26);

    return (
        <div className="p-3">
            <div ref={props.resultRef} className="flex flex-col bg-white p-6">
                {/* Stock Symbol and Name */}
                <h2 className="text-2xl font-bold mb-4">
                    {stockSymbol} - {stockName} ({activeTab})
                </h2>

                {modeHeatmap ? (
                    <ResultHeatmap
                        heatmapShort={shortHeatmap}
                        heatmapLong={longHeatmap}
                        heatmapData={dataHeatmap}
                    />
                ) : (
                    <>
                        {/* Summary */}
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold">合計: ¥{totalProfit}</h3>
                            <div className="flex flex-row">
                                <h4 className="basis-1/3 text-base font-semibold text-green-500">
                                    利益: ¥{totalGain}
                                </h4>
                                <h4 className="basis-1/3 text-base font-semibold text-red-500">
                                    損失: ¥{totalLoss}
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
                            <ResultDetail
                                stockSymbol={stockSymbol}
                                details={details}
                                setChartDatas={setChartDatas}
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
                    </>
                )}
            </div>
        </div>
    );
}
