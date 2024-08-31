import React from "react";
import ReactECharts from "echarts-for-react";

export default function Page(
    rawData: {
        date: string;
        open: number;
        close: number;
        high: number;
        low: number;
        emashort: number;
        emalong: number;
    }[],
    param: { emashort: number; emalong: number }
) {
    const dates = rawData.map(function (item) {
        return item.date;
    });

    const data = rawData.map(function (item) {
        return [item.open, item.close, item.low, item.high];
    });

    const options = {
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
            data: dates,
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
                data: data,
                itemStyle: {
                    color: "#FD1050",
                    color0: "#0CF49B",
                    borderColor: "#FD1050",
                    borderColor0: "#0CF49B",
                },
            },
            // {
            //     name: "MA5",
            //     type: "line",
            //     data: calculateMA(5, data),
            //     smooth: true,
            //     showSymbol: false,
            //     lineStyle: {
            //         width: 1,
            //     },
            // },
            // {
            //     name: "MA10",
            //     type: "line",
            //     data: calculateMA(10, data),
            //     smooth: true,
            //     showSymbol: false,
            //     lineStyle: {
            //         width: 1,
            //     },
            // },
            // {
            //     name: "MA20",
            //     type: "line",
            //     data: calculateMA(20, data),
            //     smooth: true,
            //     showSymbol: false,
            //     lineStyle: {
            //         width: 1,
            //     },
            // },
            // {
            //     name: "MA30",
            //     type: "line",
            //     data: calculateMA(30, data),
            //     smooth: true,
            //     showSymbol: false,
            //     lineStyle: {
            //         width: 1,
            //     },
            // },
        ],
    };

    return <ReactECharts option={options} />;
}
