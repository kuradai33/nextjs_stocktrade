import { ChangeEvent, Dispatch, FormEvent, RefObject, SetStateAction, useState } from "react";

import SettingSmashday from "./SettingSmashday";
import SettingInsideday from "./SettingInsideday";
import SettingSwingplay from "./SettingSwingplay";
import { settingSets } from "../../lib/interfaces";
import { SignalType } from "../../lib/defines";
import Help from "./Help";

export default function Page(props: {
    activeTab: SignalType;
    helpMessage: string;
    setHelpMessage: Dispatch<SetStateAction<string>>;
    resultRef: RefObject<HTMLDivElement>;
    sets: settingSets;
}) {
    const [stockSymbol, setStockSymbol] = useState("7203");
    const [startDate, setStartDate] = useState("2019-01-01");
    const [endDate, setEndDate] = useState("2024-01-01");
    const [tradeType, setTradeType] = useState("buy");
    const [useHLBand, setUseHLBand] = useState(false);
    const [spanHLBand, setSpanHLBand] = useState(20);
    const [useEMA, setUseEMA] = useState(false);
    const [spanEMAShort, setSpanEMAShort] = useState(13);
    const [spanEMALong, setSpanEMALong] = useState(26);

    const [stockName, setStockName] = useState("トヨタ自動車");

    const submitSymbolName = async (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        try {
            setStockSymbol(e.target.value);
            const response = await fetch("http://192.168.0.105:3000/api/symbolname", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    symbol: e.target.value,
                }),
            });
            const stockName = (await response.json()).stockName;
            setStockName(stockName);
        } catch (err) {
            alert("メッセージの送信が失敗しました");
        }
    };

    const submitSimulation = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch("http://192.168.0.105:3000/api/post", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mode: props.activeTab,
                    symbol: stockSymbol,
                    start: startDate,
                    end: endDate,
                    tradeType: tradeType,
                    HLBand: useHLBand ? spanHLBand : null,
                    EMAShort: useEMA ? spanEMAShort : null,
                    EMALong: useEMA ? spanEMALong : null,
                }),
            });
            const jsonData = await response.json();
            props.sets.setTotalProfit(jsonData.total.toFixed(1));
            props.sets.setTotalGain(jsonData.totalGain.toFixed(1));
            props.sets.setTotalLoss(jsonData.totalLoss.toFixed(1));
            props.sets.setCntGain(jsonData.cntGain);
            props.sets.setCntLoss(jsonData.cntLoss);
            props.sets.setDetails(jsonData.details);
            props.sets.setResultVisible(true);
            props.resultRef.current?.scrollIntoView({ behavior: "smooth" });
        } catch (err) {
            alert("メッセージの送信が失敗しました");
        }
    };

    return (
        <>
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mb-8">
                <form onSubmit={submitSimulation}>
                    <div className="mb-4 relative">
                        {/* Help */}
                        <Help activeTab={props.activeTab} helpMessage={props.helpMessage} setHelpMessage={props.setHelpMessage}/>

                        {/* Option */}
                        <label htmlFor="stockSymbol" className="block text-gray-700 font-medium">
                            銘柄
                        </label>
                        <div className="flex">
                            <input
                                type="text"
                                id="stockSymbol"
                                value={stockSymbol}
                                onChange={submitSymbolName}
                                className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="銘柄シンボルを入力"
                                required
                            />
                            <label
                                htmlFor="stockSymbol"
                                className="w-1/2 px-4 py-2 block text-gray-700 font-medium"
                            >
                                - {stockName}
                            </label>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="startDate" className="block text-gray-700 font-medium mb-2">
                            開始日
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="endDate" className="block text-gray-700 font-medium mb-2">
                            終了日
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>

                    {props.activeTab === "smashday" && (
                        <SettingSmashday
                            setTradeType={setTradeType}
                            setUseHLBand={setUseHLBand}
                            setSpanHLBand={setSpanHLBand}
                            setUseEMA={setUseEMA}
                            setSpanEMAShort={setSpanEMAShort}
                            setSpanEMALong={setSpanEMALong}
                        />
                    )}
                    {props.activeTab === "insideday" && <SettingInsideday />}
                    {props.activeTab === "swingplay" && <SettingSwingplay />}

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        シミュレーション開始
                    </button>
                </form>
            </div>
        </>
    );
}
