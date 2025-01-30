import { RefObject, SetStateAction, useState } from "react";

import ResultDetail from "./Results/ResultDetail";
import ResultChart from "./Results/ResultChart";
import ResultHeatmap from "./Results/ResultHeatmap";
import { SignalType, SimulationResult, StockPriceChartData } from "@/app/lib/defines";

type Props = {
    resultRef: RefObject<HTMLDivElement>;
    result: {
        activeTab: SignalType;
        stockSymbol: string;
        stockName: string;
        modeHeatmap: boolean;
        resultData: SimulationResult;
        chartDatas: StockPriceChartData;
        resultHeatmap: {
            dataHeatmap: number[][];
            shortHeatmap: string[];
            longHeatmap: string[];
        };
    };
};

export default function Page(props: Props) {
    const {
        activeTab,
        stockSymbol,
        stockName,
        modeHeatmap,
        resultData,
        chartDatas,
        resultHeatmap,
    } = props.result;
    const { dataHeatmap, shortHeatmap, longHeatmap } = resultHeatmap;

    const [chartVisible, setChartVisible] = useState(false);
    const [chartShowDatas, setChartShowDatas] = useState({
        chartData: [{ open: 0, close: 0, high: 0, low: 0 }],
        chartDate: [""],
        chartEMAShort: [0],
        chartEMALong: [0],
    });

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
                            <h3 className="text-xl font-semibold">合計: ¥{resultData.getTotalProfit()}</h3>
                            <div className="flex flex-row">
                                <h4 className="basis-1/3 text-base font-semibold text-green-500">
                                    利益: ¥{resultData.getTotalGain()}
                                </h4>
                                <h4 className="basis-1/3 text-base font-semibold text-red-500">
                                    損失: ¥{resultData.getTotalLoss()}
                                </h4>
                            </div>
                            <div className="flex flex-row">
                                <h4 className="basis-1/3 text-base font-semibold text-green-500">
                                    利益回数: {resultData.getCntGain()} 回
                                </h4>
                                <h4 className="basis-1/3 text-base font-semibold text-red-500">
                                    損失回数: {resultData.getCntLoss()} 回
                                </h4>
                            </div>
                        </div>
                        <div className="flex flex-1">
                            {/* Detailed Results */}
                            <ResultDetail
                                stockSymbol={stockSymbol}
                                details={resultData.getDetailsByDate()}
                                chartDatas={chartDatas}
                                setChartShowDatas={setChartShowDatas}
                                chartEMAShortSpan={chartEMAShortSpan}
                                chartEMALongSpan={chartEMALongSpan}
                                setChartEMAShortSpan={setChartEMAShortSpan}
                                setChartEMALongSpan={setChartEMALongSpan}
                                setChartVisible={setChartVisible}
                            />

                            {/* Stock Chart */}
                            {chartVisible && <ResultChart chartShowDatas={chartShowDatas} />}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
