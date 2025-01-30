import { dateGetterName } from "echarts/types/src/util/time.js";
import { Dispatch, SetStateAction } from "react";

import { DateStr, SignalDetailByDate, StockPriceChartData } from "@/app/lib/defines";

type Props = {
    stockSymbol: string;
    details: SignalDetailByDate[];
    chartEMAShortSpan: number;
    chartEMALongSpan: number;
    chartDatas: StockPriceChartData;
    setChartShowDatas: Dispatch<
        SetStateAction<{
            chartData: {
                open: number;
                close: number;
                high: number;
                low: number;
            }[];
            chartDate: string[];
            chartEMAShort: number[];
            chartEMALong: number[];
        }>
    >;
    setChartEMAShortSpan: Dispatch<SetStateAction<number>>;
    setChartEMALongSpan: Dispatch<SetStateAction<number>>;
    setChartVisible: Dispatch<SetStateAction<boolean>>;
};

export default function Page(props: Props) {
    const {
        stockSymbol,
        details,
        chartEMAShortSpan,
        chartEMALongSpan,
        chartDatas,
        setChartShowDatas,
        setChartVisible,
    } = props;

    const submitChart = async (startDate: DateStr, endDate: DateStr) => {
        const chartData = chartDatas.createStockPriceChartData(startDate, endDate);
        setChartShowDatas(chartData);
        setChartVisible(true);
    };

    return (
        <>
            <div className="w-1/3 pl-4">
                <div className="overflow-x-auto h-screen overflow-y-scroll">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="border-b py-2 px-4">期間</th>
                                <th className="border-b py-2 px-4">ルール</th>
                                <th className="border-b py-2 px-4">損益</th>
                            </tr>
                        </thead>
                        <tbody>
                            {details.map((detail, index) => {
                                const startDate = detail.startDate;
                                const endDate = detail.endDate;
                                return (
                                <tr
                                    key={index}
                                    onClick={() => submitChart(detail.startDate, detail.endDate)}
                                    className="cursor-pointer hover:bg-gray-200"
                                >
                                    <td className="border-b py-2 px-4">
                                        {startDate.getDateStr()} ~ {endDate.getDateStr()}
                                    </td>
                                    <td
                                        className={`border-b py-2 px-4 ${
                                            detail.amount[0] !== "▲"
                                                ? "text-green-500"
                                                : "text-red-500"
                                        }`}
                                    >
                                        {detail.outcome}
                                    </td>
                                    <td
                                        className={`border-b py-2 px-4 ${
                                            detail.amount[0] !== "▲"
                                                ? "text-green-500"
                                                : "text-red-500"
                                        }`}
                                    >
                                        {detail.amount}
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
