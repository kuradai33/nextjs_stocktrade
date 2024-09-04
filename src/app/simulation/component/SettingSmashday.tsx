import { Dispatch, SetStateAction, useState } from "react";

import Option from "./Option";

export default function Page(props: {
    setTradeType: Dispatch<SetStateAction<string>>;
    setUseHLBand: Dispatch<SetStateAction<boolean>>;
    setSpanHLBand: Dispatch<SetStateAction<number>>;
    setUseEMA: Dispatch<SetStateAction<boolean>>;
    setSpanEMAShort: Dispatch<SetStateAction<number>>;
    setSpanEMALong: Dispatch<SetStateAction<number>>;
}) {
    const [tradeType, setTradeType] = useState("buy");
    const [useHLBand, setUseHLBand] = useState(false);
    const [spanHLBand, setSpanHLBand] = useState(20);
    const [useEMA, setUseEMA] = useState(false);
    const [spanEMAShort, setSpanEMAShort] = useState(13);
    const [spanEMALong, setSpanEMALong] = useState(26);

    return (
        <>
            {/* TradeType Option */}
            <Option
                id={"tradeType"}
                name={"取引タイプ"}
                type={"pulldown"}
                var={tradeType}
                setVar={setTradeType}
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
                var={useHLBand}
                setVar={setUseHLBand}
                switchele={[
                    {
                        id: "spanHLBand",
                        name: "HLBandの期間",
                        type: "number",
                        var: spanHLBand,
                        setVar: setSpanHLBand,
                    },
                ]}
            />

            {/* EMA Option */}
            <Option
                id="useEMA"
                name={"EMAを使用しますか？"}
                type={"radio_yn"}
                var={useEMA}
                setVar={setUseEMA}
                switchele={[
                    {
                        id: "spanHLBand",
                        name: "EMAの短期期間",
                        type: "number",
                        var: spanEMAShort,
                        setVar: setSpanEMAShort,
                    },
                    {
                        id: "spanHLBand",
                        name: "EMAの長期期間",
                        type: "number",
                        var: spanEMALong,
                        setVar: setSpanEMALong,
                    },
                ]}
            />
        </>
    );
}
