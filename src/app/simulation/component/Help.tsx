import { useEffect, useState } from "react";

import { SignalType, ipAddress } from "@/app/lib/defines";

export default function Page(props: { activeTab: SignalType })
{
    const [helpMessage, setHelpMessage] = useState("");
    const [editHelp, setEditHelp] = useState(false);

    // サーバからヘルプメッセージを取得
    const submitGethelp = async () => {
        try {
            const response = await fetch("http://" + ipAddress + "/api/gethelp", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    signal: String(props.activeTab),
                }),
            });
            const jsonData = await response.json();
            setHelpMessage(jsonData.text);
        } catch (err) {
            alert("メッセージの送信が失敗しました");
        }
    };

    // ヘルプメッセージの更新をサーバに送る
    const submitSethelp = async () => {
        try {
            const response = await fetch("http://" + ipAddress + "/api/sethelp", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    signal: props.activeTab,
                    text: helpMessage,
                }),
            });
        } catch (err) {
            alert("メッセージの送信が失敗しました");
        }
    };

    // 読み込み直後にメッセージを設定
    useEffect(()=>{submitGethelp()}, []);

    return (
        <>
            {/* Help */}
            <div className="absolute right-0 top-0 flex items-center">
                <div className="relative group">
                    <button
                        className={`w-6 h-6 bg-gray-300 text-gray-700 rounded-full flex justify-center items-center ${editHelp ? "cursor-default" : "cursor-pointer"}`}
                        title="Help クリックで編集"
                        onClick={() => {setEditHelp(true)}}
                        type="button"
                    >?</button>

                    {editHelp ? (
                        <>
                            <textarea
                                className="absolute bottom-7 right-0 w-40 p-2 bg-gray-700 text-white text-sm rounded-md shadow-md"
                                id="message"
                                value={helpMessage}
                                onChange={(e) => setHelpMessage(e.target.value)}
                            ></textarea>
                            <button
                                type="button"
                                className="absolute bottom-0 right-28 w-12 h-7 bg-gray-500 text-sm text-white rounded-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                onClick={submitSethelp}
                            >
                                保存
                            </button>
                            <button
                                type="button"
                                className="absolute bottom-0 right-16 w-12 h-7 bg-blue-500 text-sm text-white rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                onClick={() => setEditHelp(false)}
                            >
                                終了
                            </button>
                        </>
                    ) : (
                        <div className="absolute bottom-7 right-0 hidden w-40 p-2 bg-gray-700 text-white text-sm rounded-md shadow-md group-hover:block">
                            <p>{helpMessage}</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}