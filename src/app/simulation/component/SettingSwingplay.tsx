import { Dispatch, SetStateAction } from "react";

import Option from "./Option";

export default function Page(props: {
    tradeType: string;
    closingPeriod: number;
    spanEMAShortSwingplay: number;
    spanEMALongSwingplay: number;
    useEMA: boolean;
    spanEMAShort: number;
    spanEMALong: number;
    setTradeType: Dispatch<SetStateAction<string>>;
    setClosingPeriod: Dispatch<SetStateAction<number>>;
    setSpanEMAShortSwingplay: Dispatch<SetStateAction<number>>;
    setSpanEMALongSwingplay: Dispatch<SetStateAction<number>>;
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

            <Option
                id={"clogingPeriod"}
                name={"手仕舞い期間"}
                type={"number"}
                var={props.closingPeriod}
                setVar={props.setClosingPeriod}
            />

            <Option id="spanHLBand"
                        name="EMAの短期期間"
                        type="number"
                        var={props.spanEMAShortSwingplay}
                        setVar={props.setSpanEMAShortSwingplay}
                    />
            <Option id="spanHLBand"
                        name="EMAの長期期間"
                        type="number"
                        var={props.spanEMALongSwingplay}
                        setVar={props.setSpanEMALongSwingplay}
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
