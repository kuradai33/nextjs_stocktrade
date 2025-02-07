import { Dispatch, SetStateAction } from "react";

import { signals, SignalType } from "@/app/lib/defines";

export default function Page(props: {
    activeTab: SignalType;
    setActiveTab: Dispatch<SetStateAction<SignalType>>;
}) {
    const { activeTab, setActiveTab } = props;

    return (
        <div className="flex justify-center mb-6">
            <div className="inline-flex border-b border-gray-300">
                {signals.map((signal, index) => {
                    return (
                        <button
                            className={`py-2 px-4 text-lg font-semibold ${
                                activeTab === signal
                                    ? "text-blue-500 border-b-2 border-blue-500"
                                    : "text-gray-600"
                            }`}
                            onClick={() => setActiveTab(signal)}
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
