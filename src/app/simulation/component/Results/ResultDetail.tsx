import { ipAddress } from "@/app/lib/defines";
import { Dispatch, SetStateAction } from "react";

type Props = {
    stockSymbol: string;
    details: { startDate: string; endDate: string; outcome: "Gain" | "Loss"; amount: string }[];
    chartEMAShortSpan: number;
    chartEMALongSpan: number;
    setChartDatas: Dispatch<
        SetStateAction<{
            chartData: {
                date: string;
                open: number;
                close: number;
                high: number;
                low: number;
                emashort: number;
                emalong: number;
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
        setChartDatas,
        setChartVisible,
    } = props;
    const submitChart = async (start: string, end: string) => {
        try {
            const response = await fetch("http://" + ipAddress + "/api/chart", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    symbol: props.stockSymbol,
                    start: start,
                    end: end,
                    emashort: props.chartEMAShortSpan,
                    emalong: props.chartEMALongSpan,
                }),
            });
            const jsonData = await response.json();
            setChartDatas({
                chartData: jsonData.stockData,
                chartDate: jsonData.stockDate,
                chartEMAShort: jsonData.stockEMAShort,
                chartEMALong: jsonData.stockEMALong,
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
                            {props.details.map((detail, index) => (
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
