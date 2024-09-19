import { SetStateAction, useState } from "react";
import ReactECharts from "echarts-for-react";

export default function Page(props: {
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
    chartVisible: boolean;
}) {
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
            data: props.chartDate,
            axisLine: { lineStyle: { color: "#8392A5" } },
        },
        yAxis: {
            scale: true,
            position: "right",
            axisLine: { lineStyle: { color: "#8392A5" } },
            splitLine: { show: true },
        },
        grid: {
            buttom: 80,
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
                data: props.chartData,
                itemStyle: {
                    color0: "#FD1050",
                    color: "#0CF49B",
                    borderColor0: "#FD1050",
                    borderColor: "#0CF49B",
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
        <div className="w-2/3 pr-4">
            <div className="flex flex-row">
                <h3 className="text-xl font-semibold">チャート</h3>
                <div className="flex flex-col px-2">
                    <h6>短期EMA</h6>
                    <input
                        type="number"
                        id="chartEMAShort"
                        value={chartEMAShortSpan}
                        onChange={(e) => setChartEMAShortSpan(Number(e.target.value))}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="flex flex-col px-2">
                    <h6>長期EMA</h6>
                    <input
                        type="number"
                        id="chartEMALong"
                        value={chartEMALongSpan}
                        onChange={(e) => setChartEMALongSpan(Number(e.target.value))}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
            </div>
            <div className="h-screen overflow-x-scroll">
                <ReactECharts option={options} style={{height: "90vh"}}/>
            </div>
        </div>
    );
}
