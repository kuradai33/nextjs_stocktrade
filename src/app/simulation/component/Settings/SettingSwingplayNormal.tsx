import { Dispatch, SetStateAction } from "react";

import Option from "../Option";

type Props = {
    tradeType: string;
    setTradeType: Dispatch<SetStateAction<string>>;
    closingPeriod: number;
    setClosingPeriod: Dispatch<SetStateAction<number>>;
    spanEMAShortSwingplay: number;
    setSpanEMAShortSwingplay: Dispatch<SetStateAction<number>>;
    spanEMALongSwingplay: number;
    setSpanEMALongSwingplay: Dispatch<SetStateAction<number>>;
    useEMA: boolean;
    setUseEMA: Dispatch<SetStateAction<boolean>>;
    spanEMAShort: number;
    setSpanEMAShort: Dispatch<SetStateAction<number>>;
    spanEMALong: number;
    setSpanEMALong: Dispatch<SetStateAction<number>>;
};

export default function Page(props: Props) {
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
    } = props;

    return (
        <>
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

            <Option
                id={"clogingPeriod"}
                name={"手仕舞い期間"}
                type={"number"}
                var={closingPeriod}
                setVar={setClosingPeriod}
            />

            <Option
                id="spanHLBand"
                name="EMAの短期期間"
                type="number"
                var={spanEMAShortSwingplay}
                setVar={setSpanEMAShortSwingplay}
            />
            <Option
                id="spanHLBand"
                name="EMAの長期期間"
                type="number"
                var={spanEMALongSwingplay}
                setVar={setSpanEMALongSwingplay}
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
