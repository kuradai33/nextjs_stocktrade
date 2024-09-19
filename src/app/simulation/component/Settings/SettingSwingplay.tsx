import { Dispatch, SetStateAction } from "react";

import Option from "../Option";
import ToggleButton from "../ToggleButton";
import { preParseFinder } from "echarts/types/src/util/model.js";
import SettingSwingplayNormal from "./SettingSwingplayNormal";
import SettingSwingplayHeatmap from "./SettingSwingplayHeatmap";

export default function Page(props: {
    tradeType: string;
    closingPeriod: number;
    spanEMAShortSwingplay: number;
    spanEMALongSwingplay: number;
    useEMA: boolean;
    spanEMAShort: number;
    spanEMALong: number;
    modeHeatmap: boolean;
    setTradeType: Dispatch<SetStateAction<string>>;
    setClosingPeriod: Dispatch<SetStateAction<number>>;
    setSpanEMAShortSwingplay: Dispatch<SetStateAction<number>>;
    setSpanEMALongSwingplay: Dispatch<SetStateAction<number>>;
    setUseEMA: Dispatch<SetStateAction<boolean>>;
    setSpanEMAShort: Dispatch<SetStateAction<number>>;
    setSpanEMALong: Dispatch<SetStateAction<number>>;
    setModeHeatmap: Dispatch<SetStateAction<boolean>>;
    spanEMAShortStartSwingplay: number;
    setSpanEMAShortStartSwingplay: Dispatch<SetStateAction<number>>;
    spanEMAShortEndSwingplay: number;
    setSpanEMAShortEndSwingplay: Dispatch<SetStateAction<number>>;
    spanEMALongStartSwingplay: number;
    setSpanEMALongStartSwingplay: Dispatch<SetStateAction<number>>;
    spanEMALongEndSwingplay: number;
    setSpanEMALongEndSwingplay: Dispatch<SetStateAction<number>>;
}) {
    const {
        tradeType,
        setTradeType,
        closingPeriod,
        setClosingPeriod,
        spanEMAShortSwingplay,
        setSpanEMAShortSwingplay,
        spanEMALongSwingplay,
        setSpanEMALongSwingplay,
        useEMA,
        setUseEMA,
        spanEMAShort,
        setSpanEMAShort,
        spanEMALong,
        setSpanEMALong,
        modeHeatmap,
        setModeHeatmap,
        spanEMAShortStartSwingplay,
        setSpanEMAShortStartSwingplay,
        spanEMAShortEndSwingplay,
        setSpanEMAShortEndSwingplay,
        spanEMALongStartSwingplay,
        setSpanEMALongStartSwingplay,
        spanEMALongEndSwingplay,
        setSpanEMALongEndSwingplay,
    } = props;

    return (
        <>
            {/* TradeType Option */}
            <ToggleButton text="ヒートマップモード" vari={modeHeatmap} setVar={setModeHeatmap} />

            {modeHeatmap ? (
                <SettingSwingplayHeatmap
                    tradeType={tradeType}
                    setTradeType={setTradeType}
                    closingPeriod={closingPeriod}
                    setClosingPeriod={setClosingPeriod}
                    spanEMAShortStartSwingplay={spanEMAShortStartSwingplay}
                    setSpanEMAShortStartSwingplay={setSpanEMAShortStartSwingplay}
                    spanEMAShortEndSwingplay={spanEMAShortEndSwingplay}
                    setSpanEMAShortEndSwingplay={setSpanEMAShortEndSwingplay}
                    spanEMALongStartSwingplay={spanEMALongStartSwingplay}
                    setSpanEMALongStartSwingplay={setSpanEMALongStartSwingplay}
                    spanEMALongEndSwingplay={spanEMALongEndSwingplay}
                    setSpanEMALongEndSwingplay={setSpanEMALongEndSwingplay}
                />
            ) : (
                <SettingSwingplayNormal
                    tradeType={tradeType}
                    setTradeType={setTradeType}
                    closingPeriod={closingPeriod}
                    setClosingPeriod={setClosingPeriod}
                    spanEMAShortSwingplay={spanEMAShortSwingplay}
                    setSpanEMAShortSwingplay={setSpanEMAShortSwingplay}
                    spanEMALongSwingplay={spanEMALongSwingplay}
                    setSpanEMALongSwingplay={setSpanEMALongSwingplay}
                    useEMA={useEMA}
                    setUseEMA={setUseEMA}
                    spanEMAShort={spanEMAShort}
                    setSpanEMAShort={setSpanEMAShort}
                    spanEMALong={spanEMALong}
                    setSpanEMALong={setSpanEMALong}
                />
            )}

            {/* <Option
                id={"tradeType"}
                name={"取引タイプ"}
                type={"pulldown"}
                var={props.tradeType}
                setVar={props.setTradeType}
                select={[
                    { id: "buy", name: "買い" },
                    { id: "sell", name: "売り" },
                    { id: "both", name: "両方" },
                ]}
            />

            <Option
                id={"clogingPeriod"}
                name={"手仕舞い期間"}
                type={"number"}
                var={props.closingPeriod}
                setVar={props.setClosingPeriod}
            />

            <Option
                id="spanHLBand"
                name="EMAの短期期間"
                type="number"
                var={props.spanEMAShortSwingplay}
                setVar={props.setSpanEMAShortSwingplay}
            />
            <Option
                id="spanHLBand"
                name="EMAの長期期間"
                type="number"
                var={props.spanEMALongSwingplay}
                setVar={props.setSpanEMALongSwingplay}
            />

            <Option
                id="useEMA"
                name={"EMAを使用しますか？"}
                type={"radio_yn"}
                var={props.useEMA}
                setVar={props.setUseEMA}
                switchele={[
                    {
                        id: "spanHLBand",
                        name: "EMAの短期期間",
                        type: "number",
                        var: props.spanEMAShort,
                        setVar: props.setSpanEMAShort,
                    },
                    {
                        id: "spanHLBand",
                        name: "EMAの長期期間",
                        type: "number",
                        var: props.spanEMALong,
                        setVar: props.setSpanEMALong,
                    },
                ]}
            /> */}
        </>
    );
}
