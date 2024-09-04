import {FormEvent, useState} from "react";

export default function Page(){
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [message, setMessage] = useState("");

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (window.confirm("メッセージを送信しますか？")) {
            try {
                const response = await fetch("http://192.168.0.105:3000/api/form", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ message }),
                });
                if (response.ok) {
                    alert("メッセージが送信されました！");
                    setIsFormVisible(false); // Hide the form after submission
                    setMessage("");
                } else {
                    alert("メッセージの送信に失敗しました。");
                }
            } catch (err) {
                alert("メッセージの送信に失敗しました。");
            }
        }
    };

    return (
        <>
            {/* フォームを開くボタン */}
            <button
                onClick={() => setIsFormVisible(!isFormVisible)}
                className="fixed top-4 right-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
                フォームを開く
            </button>

            {/* 固定されたフォーム */}
            {isFormVisible && (
                <div className="fixed top-16 right-4 bg-white p-4 rounded-lg shadow-lg z-50">
                    <form onSubmit={handleFormSubmit}>
                        <div className="mb-4">
                            <label
                                htmlFor="message"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                メッセージ
                            </label>
                            <textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full h-24 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="メッセージを入力"
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                        >
                            送信
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}