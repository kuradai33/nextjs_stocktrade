import ReactECharts from "echarts-for-react";

export default function Page(props: {
    heatmapShort: string[];
    heatmapLong: string[];
    heatmapData: number[][];
}) {
    const { heatmapShort, heatmapLong, heatmapData } = props;
    type EChartsOption = echarts.EChartsOption;

    let options: EChartsOption;

    const datas = heatmapData
    .map(function (item) {
        return [item[1], item[0], item[2] || '-'];
    });

    const profits = datas.map((e) => e[2]);
    const mindata = profits.reduce(
        (a, b) => (typeof a == "number" && typeof b == "number" ? Math.min(a, b) : a),
        Number.MAX_SAFE_INTEGER
    );
    const maxdata = profits.reduce(
        (a, b) => (typeof a == "number" && typeof b == "number" ? Math.max(a, b) : a),
        -1
    );

    options = {
        tooltip: {
            position: "top",
        },
        grid: {
            height: "50%",
            top: "10%",
        },
        xAxis: {
            type: "category",
            data: heatmapLong,
            splitArea: {
                show: true,
            },
        },
        yAxis: {
            type: "category",
            data: heatmapShort,
            splitArea: {
                show: true,
            },
        },
        visualMap: {
            min: typeof(mindata) == "number" ? mindata : 0,
            max: typeof(maxdata) == "number" ? maxdata : 0,
            calculable: true,
            orient: "horizontal",
            left: "center",
            bottom: "15%",
        },
        series: [
            {
                name: "Result",
                type: "heatmap",
                data: datas,
                label: {
                    show: true,
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: "rgba(0, 0, 0, 0.5)",
                    },
                },
            },
        ],
    };
    return (
        <>
            <ReactECharts option={options} />
        </>
    );
}
