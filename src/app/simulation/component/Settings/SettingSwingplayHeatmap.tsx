import { Dispatch, SetStateAction } from "react";

import Option from "../Option";

type Props = {
    tradeType: string;
    setTradeType: Dispatch<SetStateAction<string>>;
    closingPeriod: number;
    setClosingPeriod: Dispatch<SetStateAction<number>>;
    spanEMAShortStartSwingplay: number;
    setSpanEMAShortStartSwingplay: Dispatch<SetStateAction<number>>;
    spanEMAShortEndSwingplay: number;
    setSpanEMAShortEndSwingplay: Dispatch<SetStateAction<number>>;
    spanEMALongStartSwingplay: number;
    setSpanEMALongStartSwingplay: Dispatch<SetStateAction<number>>;
    spanEMALongEndSwingplay: number;
    setSpanEMALongEndSwingplay: Dispatch<SetStateAction<number>>;
};

export default function Page(props: Props) {
    const {
        tradeType,
        setTradeType,
        closingPeriod,
        setClosingPeriod,
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
            <Option
                id="tradeType"
                name="取引タイプ"
                type="pulldown"
                var={tradeType}
                setVar={setTradeType}
                select={[
                    { id: "buy", name: "買い" },
                    { id: "sell", name: "売り" },
                    { id: "both", name: "両方" },
                ]}
            />

            <Option
                id="clogingPeriod"
                name="手仕舞い期間"
                type="number"
                var={closingPeriod}
                setVar={setClosingPeriod}
            />

            <Option
                id="baseEmaShortStart"
                name="EMAの短期期間 開始"
                type="number"
                var={spanEMAShortStartSwingplay}
                setVar={setSpanEMAShortStartSwingplay}
            />
            <Option
                id="baseEmaShortEnd"
                name="EMAの短期期間 終了"
                type="number"
                var={spanEMAShortEndSwingplay}
                setVar={setSpanEMAShortEndSwingplay}
            />
            <Option
                id="baseEmaLongStart"
                name="EMAの長期期間 開始"
                type="number"
                var={spanEMALongStartSwingplay}
                setVar={setSpanEMALongStartSwingplay}
            />
            <Option
                id="baseEmaLongEnd"
                name="EMAの長期期間 終了"
                type="number"
                var={spanEMALongEndSwingplay}
                setVar={setSpanEMALongEndSwingplay}
            />
        </>
    );
}
