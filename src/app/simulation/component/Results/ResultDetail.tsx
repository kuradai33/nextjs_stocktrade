import { ipAddress } from "@/app/lib/defines";
import { dateGetterName } from "echarts/types/src/util/time.js";
import { Dispatch, SetStateAction } from "react";

type Props = {
    stockSymbol: string;
    details: { startDate: string; endDate: string; outcome: "Gain" | "Loss"; amount: string }[];
    chartEMAShortSpan: number;
    chartEMALongSpan: number;
    chartDatas: {
        date: string;
        open: number;
        close: number;
        high: number;
        low: number;
        hband?: number;
        lband?: number;
        emashort?: number;
        emalong?: number;
    }[];
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

    const submitChart = async (start: string, end: string) => {
        try {
            const startIndex = chartDatas.findIndex(({date}) => date === start);
            const endIndex = chartDatas.findIndex(({date}) => date === end);
            const startIndexProcessed = Math.max(startIndex - 5, 0);
            const endIndexProcessed = Math.min(endIndex + 5, chartDatas.length - 1);
            const chartDatasProcessed = chartDatas.slice(startIndexProcessed, endIndexProcessed + 1);
            console.log(chartDatasProcessed.map(({date, open, close, high, low}) => ({date: date, open: open, close: close, high: high, low: low})));
            setChartShowDatas({
                chartData: chartDatasProcessed.map(({open, close, high, low}) => ({open: open, close: close, high: high, low: low})),
                chartDate: chartDatasProcessed.map(({date}) => date),
                chartEMAShort: chartDatasProcessed.map(({emashort}) => emashort ? emashort : -1),
                chartEMALong: chartDatasProcessed.map(({emalong}) => emalong ? emalong : -1),
            });
            setChartVisible(true);
        } catch (err) {
            alert("メッセージの送信が失敗しました");
        }
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
                            {details.map((detail, index) => (
                                <tr
                                    key={index}
                                    onClick={() => submitChart(detail.startDate, detail.endDate)}
                                    className="cursor-pointer hover:bg-gray-200"
                                >
                                    <td className="border-b py-2 px-4">
                                        {detail.startDate} ~ {detail.endDate}
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
