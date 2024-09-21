import ReactECharts from "echarts-for-react";
import { TopLevelFormatterParams } from "echarts/types/dist/shared";

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
            formatter: (params: TopLevelFormatterParams) => {
                if(!Array.isArray(params)){
                    const circle = "<span style='display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:" + params.color + ";'></span>";
                    let number = -1, emashort = "", emalong = "";
                    if(Array.isArray(params.value)){
                        if(typeof(params.value[2]) == "number") number = params.value[2];
                        if(typeof(params.value[1]) == "number") emashort = heatmapShort[params.value[1]];
                        if(typeof(params.value[0]) == "number") emalong = heatmapLong[params.value[0]];
                    }
                    return circle + " " + number + "<br>EMA Short: " + emashort + "<br>EMA Long: " + emalong;
                }
                return "";
            },
        },
        grid: {
            height: "50%",
            top: "10%",
        },
        xAxis: {
            type: "category",
            name: "EMA long",
            data: heatmapLong,
            splitArea: {
                show: true,
            },
        },
        yAxis: {
            type: "category",
            name: "EMA short",
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
            inRange: {
                color: ["#FF0000", "#FFFF00", "#32CD32"],
            },
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
            <ReactECharts option={options} style={{height: "90vh"}}/>
        </>
    );
}
