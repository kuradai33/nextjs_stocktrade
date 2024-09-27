"use client";

import { useState } from "react";

export default function Page() {
    const today = new Date();
    const strMonth = today.getMonth() + 1 < 10 ? `0${today.getMonth() + 1}` : `${today.getMonth() + 1}`;
    const strDay = today.getDate() < 10 ? `0${today.getDate()}` : `${today.getDate()}`;
    const strToday = `${today.getFullYear()}-${strMonth}-${strDay}`;

    const [date, setDate] = useState<string>("2024-09-26");

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="p-8">
                {/* Title */}
                <h1 className="text-4xl font-bold text-center mb-8">株シグナル</h1>

                <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mb-8">
                    <form>
                        <div className="mb-4">
                            <label
                                htmlFor="date"
                                className="block text-gray-700 font-medium mb-2"
                            >
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
                            - {date}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            表示
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
