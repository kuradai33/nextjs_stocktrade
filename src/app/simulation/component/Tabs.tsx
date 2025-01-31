import { SetStateAction, useLayoutEffect } from "react";

import { signals, SignalType } from "@/app/lib/defines";
import { ipAddress } from "@/app/lib/defines";

export default function Page(props: {
    activeTab: SignalType;
    setActiveTab: (value: SetStateAction<SignalType>) => void;
    setHelpMessage: (value: SetStateAction<string>) => void;
}) {
    const {activeTab} = props;
    const submitGethelp = async (signal: SignalType) => {
        try {
            props.setActiveTab(signal);
            const response = await fetch("http://" + ipAddress + "/api/gethelp", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    signal: String(signal),
                }),
            });
            const jsonData = await response.json();
            props.setHelpMessage(jsonData.text);
        } catch (err) {
            alert("メッセージの送信が失敗しました");
        }
    };

    useLayoutEffect(() => {
        submitGethelp(activeTab);
    }, [activeTab]);

    return (
        <div className="flex justify-center mb-6">
            <div className="inline-flex border-b border-gray-300">
                {signals.map((signal, index) => {
                    return (
                        <button
                            className={`py-2 px-4 text-lg font-semibold ${
                                props.activeTab === signal
                                    ? "text-blue-500 border-b-2 border-blue-500"
                                    : "text-gray-600"
                            }`}
                            onClick={() => submitGethelp(signal)}
                            key={index}
                        >
                            {signal}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
