import { SetStateAction, useEffect, useState } from "react";

import { signals, SignalType } from "../../lib/defines";
import { setHelpText } from "@/app/lib/db";
import { ipAddress } from "../../lib/defines";

export default function Page(props: {
    activeTab: SignalType;
    setActiveTab: (value: SetStateAction<SignalType>) => void;
    setHelpMessage: (value: SetStateAction<string>) => void;
}) {
    const submitGethelp = async (signal: SignalType) => {
        try {
            props.setActiveTab(signal);
            const response = await fetch("http://" + ipAddress + ":3000/api/gethelp", {
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

    useEffect(() => {
        submitGethelp(props.activeTab);
    }, []);

    return (
        <div className="flex justify-center mb-6">
            <div className="inline-flex border-b border-gray-300">
                {signals.map((signal) => {
                    return (
                        <button
                            className={`py-2 px-4 text-lg font-semibold ${
                                props.activeTab === signal
                                    ? "text-blue-500 border-b-2 border-blue-500"
                                    : "text-gray-600"
                            }`}
                            onClick={() => submitGethelp(signal)}
                        >
                            {signal}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
