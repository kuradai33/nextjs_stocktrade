"use client";

import { ChangeEvent, FormEvent, useState } from "react";

import { ipAddress } from "../lib/defines";

export default function Page() {
    const today = new Date();
    const strMonth =
        today.getMonth() + 1 < 10 ? `0${today.getMonth() + 1}` : `${today.getMonth() + 1}`;
    const strDay = today.getDate() < 10 ? `0${today.getDate()}` : `${today.getDate()}`;
    const strToday = `${today.getFullYear()}-${strMonth}-${strDay}`;

    const [date, setDate] = useState<string>(strToday);
    const [stockSymbol, setStockSymbol] = useState<string>("");
    const [stockName, setStockName] = useState<string>("");

    const [inputdate, setInputdate] = useState<string>(strToday);
    const [signalResults, setSignalResults] = useState<{
        date: string;
        buy: { code: string; name: String; close: number; plus: boolean; date: string }[];
        sell: { code: string; name: string; close: number; plus: boolean; date: string }[];
    }>({ date: "", buy: [], sell: [] });

    const [isShow, setIsShow] = useState<boolean>(false);

    const submitSymbolName = async (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        try {
            setStockSymbol(e.target.value);
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
            setStockName(stockName);
        } catch (err) {
            alert("メッセージの送信が失敗しました");
        }
    };

    const submitSignalRSIBB = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch("http://" + ipAddress + "/api/signal/rsibb", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    date: date,
                    code: stockSymbol,
                }),
            });
            const jsonData = await response.json();
            setInputdate(date);
            setSignalResults({
                date: jsonData.date,
                buy: jsonData.buysignals,
                sell: jsonData.sellsignals,
            });
            setIsShow(true);
        } catch (err) {
            alert("メッセージの送信が失敗しました");
        }
    };

    const testlist = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="p-8">
                {/* Title */}
                <h1 className="text-4xl font-bold text-center mb-8">株シグナル</h1>

                <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mb-8">
                    <form onSubmit={submitSignalRSIBB}>
                        <div className="mb-4">
                            <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
                                日付
                            </label>
                            <input
                                type="date"
                                id="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>

                        <label htmlFor="stockSymbol" className="block text-gray-700 font-medium">
                            銘柄
                        </label>
                        <div className="flex mb-4">
                            <input
                                type="text"
                                id="stockSymbol"
                                value={stockSymbol}
                                onChange={submitSymbolName}
                                className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="銘柄シンボルを入力"
                            />
                            <label
                                htmlFor="stockSymbol"
                                className="w-1/2 px-4 py-2 block text-gray-700 font-medium"
                            >
                                - {stockName}
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            表示
                        </button>
                    </form>
                </div>

                <div className="p-4 w-full bg-white rounded-3xl border-2 ">
                    <div className="mb-2 flex items-end border-b border-gray-700">
                        <div className="mr-2 text-2xl font-medium">日付 {signalResults.date}</div>
                        {isShow && signalResults.date != inputdate && (
                            <div className="pb-1 text-sm fond-semibold text-red-600">
                                {inputdate} のデータはありません 直前の日付を表示します
                            </div>
                        )}
                    </div>
                    <div className="flex">
                        <div className="w-full flex flex-col">
                            <label className="text-lg font-medium">買いシグナル</label>
                            <div className="mb-2 h-[40vh] w-full overflow-y-scroll">
                                <table className="text-left">
                                    <thead>
                                        <tr>
                                            <th className="sticky px-1 font-medium">コード</th>
                                            <th className="sticky px-1 font-medium">銘柄</th>
                                            <th className="sticky px-1 font-medium">終値</th>
                                            <th className="sticky px-1 font-medium">日付</th>
                                        </tr>
                                    </thead>
                                    <tbody className="">
                                        {signalResults.buy.length > 0
                                            ? signalResults.buy.map((result, index) => (
                                                  <tr
                                                      className={`${
                                                          result.plus ? "bg-red-300" : ""
                                                      }`}
                                                  >
                                                      <td className="px-2 font-medium">
                                                          {result.code}
                                                      </td>
                                                      <td className="px-1 font-medium">
                                                          {result.name}
                                                      </td>
                                                      <td className="px-1 font-medium">
                                                          ￥{result.close.toFixed(0)}
                                                      </td>
                                                      <td className="px-2 font-medium">
                                                          {result.date}
                                                      </td>
                                                  </tr>
                                              ))
                                            : <tr><td colSpan={3}>シグナルがありません</td></tr>}
                                    </tbody>
                                </table>
                            </div>

                            <label className="text-lg font-medium">売りシグナル</label>
                            <div className="mb-4 h-[40vh] w-full overflow-y-scroll">
                                <table className="text-left">
                                    <thead>
                                        <tr>
                                            <th className="sticky px-1 font-medium">コード</th>
                                            <th className="sticky px-1 font-medium">銘柄</th>
                                            <th className="sticky px-1 font-medium">終値</th>
                                            <th className="sticky px-1 font-medium">日付</th>
                                        </tr>
                                    </thead>
                                    <tbody className="">
                                        {signalResults.sell.length > 0
                                            ? signalResults.sell.map((result, index) => (
                                                  <tr
                                                      className={`${
                                                          result.plus ? "bg-red-300" : ""
                                                      }`}
                                                  >
                                                      <td className="px-2 font-medium">
                                                          {result.code}
                                                      </td>
                                                      <td className="px-2 font-medium">
                                                          {result.name}
                                                      </td>
                                                      <td className="px-2 font-medium">
                                                          ￥{result.close.toFixed(0)}
                                                      </td>
                                                      <td className="px-2 font-medium">
                                                          {result.date}
                                                      </td>
                                                  </tr>
                                              ))
                                            : <tr><td colSpan={3}>シグナルがありません</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="w-3/5">
                            {/* {testlist.map((list, index) => (
                                <div className="flex flex-row">
                                    {list.map((e, i) => (
                                        <div className="h-10 w-10 border border-gray-200">{e}</div>
                                    ))}
                                </div>
                            ))} */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
