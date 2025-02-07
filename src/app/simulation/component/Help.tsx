import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";

import { SignalType, ipAddress } from "@/app/lib/defines";

export default function Page(props: {activeTab: SignalType;})
{
    const [helpMessage, setHelpMessage] = useState("");
    const [editHelp, setEditHelp] = useState(false);

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

    return (
        <>
            {/* Help */}
            <div className="absolute right-0 top-0 flex items-center">
                <div className="relative group">
                    <button
                        className="w-6 h-6 bg-gray-300 text-gray-700 rounded-full flex justify-center items-center cursor-pointer"
                        title="Help"
                        onClick={() => {
                            editHelp && submitSethelp();
                            setEditHelp(!editHelp);
                        }}
                        type="button"
                    >
                        ?
                    </button>
                    {editHelp ? (
                        <textarea
                            className="absolute bottom-12 right-0 w-40 p-2 bg-gray-700 text-white text-sm rounded-md shadow-md"
                            id="message"
                            value={helpMessage}
                            onChange={(e) => setHelpMessage(e.target.value)}
                        ></textarea>
                    ) : (
                        <div className="absolute bottom-12 right-0 hidden w-40 p-2 bg-gray-700 text-white text-sm rounded-md shadow-md group-hover:block">
                            <p>{helpMessage}</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
