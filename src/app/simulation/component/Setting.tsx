import { ChangeEvent, Dispatch, FormEvent, RefObject, SetStateAction, useState } from "react";

import SettingSmashday from "@/app/simulation/component/Settings/SettingSmashday";
import SettingInsideday from "@/app/simulation/component/Settings/SettingInsideday";
import SettingSwingplay from "@/app/simulation/component/Settings/SettingSwingplay";
import Help from "@/app/simulation/component/Help";

import {
    SignalType,
    Settings,
    TradeType,
    ipAddress,
    SimulationResult,
    StockPriceData,
} from "@/app/lib/defines";
import { convertSpecificStringToDateStr } from "@/app/lib/util";

type Props = {
    setSettings: Dispatch<SetStateAction<Settings>>;
    activeTab: SignalType;
    setResultVisible: Dispatch<SetStateAction<boolean>>;
    setResult: Dispatch<SetStateAction<SimulationResult>>;
    setChartDatas: Dispatch<SetStateAction<StockPriceData>>;
    setResultHeatmap: Dispatch<
        SetStateAction<{
            dataHeatmap: number[][];
            shortHeatmap: string[];
            longHeatmap: string[];
        }>
    >;
    helpMessage: string;
    setHelpMessage: Dispatch<SetStateAction<string>>;
    resultRef: RefObject<HTMLDivElement>;
};

export default function Page(props: Props) {
    const {
        setSettings,
        activeTab,
        helpMessage,
        setHelpMessage,
        setResultVisible,
        setResult,
        setChartDatas,
        setResultHeatmap,
        resultRef,
    } = props;

    // 全てのシグナルに共通する入力
    const [symbolCode, setSymbolCode] = useState<string>("7203");
    const [symbolName, setSymbolName] = useState("トヨタ自動車");
    const [modeHeatmap, setModeHeatmap] = useState(false);

    // common
    const [startDate, setStartDate] = useState("2019-01-01");
    const [endDate, setEndDate] = useState("2024-01-01");
    const [tradeType, setTradeType] = useState("buy");
    const [useHLBand, setUseHLBand] = useState(false);
    const [spanHLBand, setSpanHLBand] = useState(20);
    const [useEMA, setUseEMA] = useState(false);
    const [spanEMAShort, setSpanEMAShort] = useState(13);
    const [spanEMALong, setSpanEMALong] = useState(26);

    // swingplay
    const [spanEMAShortSwingplay, setSpanEMAShortSwingplay] = useState(8);
    const [spanEMALongSwingplay, setSpanEMALongSwingplay] = useState(21);
    const [closingPeriod, setClosingPeriod] = useState(10);

    // swingplay heatmap
    const [spanEMAShortStartSwingplay, setSpanEMAShortStartSwingplay] = useState(6);
    const [spanEMAShortEndSwingplay, setSpanEMAShortEndSwingplay] = useState(12);
    const [spanEMALongStartSwingplay, setSpanEMALongStartSwingplay] = useState(15);
    const [spanEMALongEndSwingplay, setSpanEMALongEndSwingplay] = useState(25);

    const submitSymbolName = async (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        try {
            setSymbolCode(e.target.value);
            const response = await fetch("http://" + ipAddress + "/api/symbolname", {
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
            setSymbolName(stockName);
        } catch (err) {
            alert("メッセージの送信が失敗しました");
        }
    };

    const submitSimulation = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const stringToTradeType = function (s: string): TradeType {
            if (s == "both") return "both";
            else if (s == "buy") return "buy";
            else if (s == "sell") return "sell";
            else return "";
        };

        if (activeTab == "smashday") {
            setSettings({
                type: "smashday",
                setting: {
                    symbolCode: symbolCode,
                    symbolName: symbolName,
                    startDate: startDate,
                    endDate: endDate,
                    tradeType: stringToTradeType(tradeType),
                    hlBand: { use: useHLBand, period: spanHLBand },
                    ema: {
                        use: useEMA,
                        periodShort: spanEMAShort,
                        periodLong: spanEMALong,
                    },
                },
            });
        } else if (activeTab == "insideday") {
            setSettings({
                type: "insideday",
                setting: {
                    symbolCode: symbolCode,
                    symbolName: symbolName,
                    startDate: startDate,
                    endDate: endDate,
                },
            });
        } else if (activeTab == "swingplay") {
            setSettings({
                type: "swingplay",
                setting: {
                    symbolCode: symbolCode,
                    symbolName: symbolName,
                    startDate: startDate,
                    endDate: endDate,
                    tradeType: stringToTradeType(tradeType),
                    mode: modeHeatmap
                        ? {
                              type: "Heatmap",
                              setting: {
                                  firstPeriodEMAShort: spanEMAShortStartSwingplay,
                                  lastPeriodEMAShort: spanEMAShortEndSwingplay,
                                  firstPeriodEMALong: spanEMALongStartSwingplay,
                                  lastPeriodEMALong: spanEMALongEndSwingplay,
                              },
                          }
                        : {
                              type: "Normal",
                              setting: {
                                  periodEMAShort: spanEMAShortSwingplay,
                                  periodEMALong: spanEMALongSwingplay,
                              },
                          },
                    ema: {
                        use: useEMA,
                        periodShort: spanEMAShort,
                        periodLong: spanEMALong,
                    },
                },
            });
        }

        try {
            const response = await fetch("http://" + ipAddress + "/api/post", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mode: activeTab,
                    symbol: symbolCode,
                    start: startDate,
                    end: endDate,
                    tradeType: tradeType,
                    HLBand: useHLBand ? spanHLBand : null,
                    EMAShort: useEMA ? spanEMAShort : null,
                    EMALong: useEMA ? spanEMALong : null,
                    EMAShortswingplay: activeTab == "swingplay" ? spanEMAShortSwingplay : null,
                    EMALongswingplay: activeTab == "swingplay" ? spanEMALongSwingplay : null,
                    closingPeriod: closingPeriod,
                }),
            });
            const jsonData = await response.json();
            try{
                const simulationResult = new SimulationResult(
                    jsonData.total,
                    jsonData.totalGain,
                    jsonData.totalLoss,
                    jsonData.cntGain,
                    jsonData.cntLoss,
                    convertSpecificStringToDateStr(jsonData.details),
                );
                setResult(simulationResult);
            }
            catch(e){
                console.log(`Error: ${e}`);
            }
            setChartDatas(new StockPriceData(jsonData.data));
            setResultVisible(true);
            resultRef.current?.scrollIntoView({ behavior: "smooth" });
        } catch (err) {
            alert("メッセージの送信が失敗しました");
        }
    };

    const submitSimulationHeatmap = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch("http://" + ipAddress + "/api/heatmap", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mode: activeTab,
                    symbol: symbolCode,
                    start: startDate,
                    end: endDate,
                    tradeType: tradeType,
                    closingPeriod: closingPeriod,
                    EMAShortStartSwingplay: spanEMAShortStartSwingplay,
                    EMAShortEndSwingplay: spanEMAShortEndSwingplay,
                    EMALongStartSwingplay: spanEMALongStartSwingplay,
                    EMALongEndSwingplay: spanEMALongEndSwingplay,
                }),
            });
            const jsonData = await response.json();
            setResultHeatmap({
                dataHeatmap: jsonData.datas,
                shortHeatmap: jsonData.shorts,
                longHeatmap: jsonData.longs,
            });
            setResultVisible(true);
            resultRef.current?.scrollIntoView({ behavior: "smooth" });
        } catch (err) {
            alert("メッセージの送信が失敗しました");
        }
    };

    return (
        <>
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mb-8">
                <form onSubmit={modeHeatmap ? submitSimulationHeatmap : submitSimulation}>
                    <div className="mb-4 relative">
                        {/* Help */}
                        <Help
                            activeTab={activeTab}
                            helpMessage={helpMessage}
                            setHelpMessage={setHelpMessage}
                        />

                        {/* Option */}
                        <label htmlFor="stockSymbol" className="block text-gray-700 font-medium">
                            銘柄
                        </label>
                        <div className="flex">
                            <input
                                type="text"
                                id="stockSymbol"
                                value={symbolCode}
                                onChange={submitSymbolName}
                                className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="銘柄シンボルを入力"
                                required
                            />
                            <label
                                htmlFor="stockSymbol"
                                className="w-1/2 px-4 py-2 block text-gray-700 font-medium"
                            >
                                - {symbolName}
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

                    {activeTab === "smashday" && (
                        <SettingSmashday
                            tradeType={tradeType}
                            useHLBand={useHLBand}
                            spanHLBand={spanHLBand}
                            useEMA={useEMA}
                            spanEMAShort={spanEMAShort}
                            spanEMALong={spanEMALong}
                            setTradeType={setTradeType}
                            setUseHLBand={setUseHLBand}
                            setSpanHLBand={setSpanHLBand}
                            setUseEMA={setUseEMA}
                            setSpanEMAShort={setSpanEMAShort}
                            setSpanEMALong={setSpanEMALong}
                        />
                    )}
                    {activeTab === "insideday" && <SettingInsideday />}
                    {activeTab === "swingplay" && (
                        <SettingSwingplay
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
                            modeHeatmap={modeHeatmap}
                            setModeHeatmap={setModeHeatmap}
                            spanEMAShortStartSwingplay={spanEMAShortStartSwingplay}
                            setSpanEMAShortStartSwingplay={setSpanEMAShortStartSwingplay}
                            spanEMAShortEndSwingplay={spanEMAShortEndSwingplay}
                            setSpanEMAShortEndSwingplay={setSpanEMAShortEndSwingplay}
                            spanEMALongStartSwingplay={spanEMALongStartSwingplay}
                            setSpanEMALongStartSwingplay={setSpanEMALongStartSwingplay}
                            spanEMALongEndSwingplay={spanEMALongEndSwingplay}
                            setSpanEMALongEndSwingplay={setSpanEMALongEndSwingplay}
                        />
                    )}

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
