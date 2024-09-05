import { Dispatch, SetStateAction, useState } from "react";

import Option from "./Option";

export default function Page(props: {
    tradeType: string;
    useHLBand: boolean;
    spanHLBand: number;
    useEMA: boolean;
    spanEMAShort: number;
    spanEMALong: number;
    setTradeType: Dispatch<SetStateAction<string>>;
    setUseHLBand: Dispatch<SetStateAction<boolean>>;
    setSpanHLBand: Dispatch<SetStateAction<number>>;
    setUseEMA: Dispatch<SetStateAction<boolean>>;
    setSpanEMAShort: Dispatch<SetStateAction<number>>;
    setSpanEMALong: Dispatch<SetStateAction<number>>;
}) {
    return (
        <>
            {/* TradeType Option */}
            <Option
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

            {/* HLBand Option */}
            <Option
                id="useHLBand"
                name={"HLBandを使用しますか？"}
                type={"radio_yn"}
                var={props.useHLBand}
                setVar={props.setUseHLBand}
                switchele={[
                    {
                        id: "spanHLBand",
                        name: "HLBandの期間",
                        type: "number",
                        var: props.spanHLBand,
                        setVar: props.setSpanHLBand,
                    },
                ]}
            />

            {/* EMA Option */}
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
            />
        </>
    );
}
