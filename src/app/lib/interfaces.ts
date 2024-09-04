import { Dispatch, SetStateAction } from "react";

export interface settingSets {
    setTotalProfit: Dispatch<SetStateAction<string>>;
    setTotalGain: Dispatch<SetStateAction<string>>;
    setTotalLoss: Dispatch<SetStateAction<string>>;
    setCntGain: Dispatch<SetStateAction<string>>;
    setCntLoss: Dispatch<SetStateAction<string>>;
    setDetails: Dispatch<
        SetStateAction<
            {
                startDate: string;
                endDate: string;
                outcome: string;
                amount: string;
            }[]
        >
    >;
    setResultVisible: Dispatch<SetStateAction<boolean>>;
}

export interface argOption {
    id: string;
    name: string;
    type: "string" | "number" | "pulldown" | "radio_yn";
    select?: { id: string; name: string }[];
    switchele?: argOption[];
    placeholder?: string;
    var: string | number | boolean;
    setVar:
        | Dispatch<SetStateAction<string>>
        | Dispatch<SetStateAction<number>>
        | Dispatch<SetStateAction<boolean>>;
}

export function isStringSetter(
    setter:
        | Dispatch<SetStateAction<string>>
        | Dispatch<SetStateAction<number>>
        | Dispatch<SetStateAction<boolean>>
): setter is Dispatch<SetStateAction<string>> {
    try {
        // setter が string 型の引数を受け取れるかどうかをテスト
        setter("test string" as any); // "test string" を渡してみる
        return true; // エラーが発生しなければ string 型の setter と判定
    } catch (e) {
        return false; // エラーが発生したら string ではないと判定
    }
}

export function isNumberSetter(
    setter:
        | Dispatch<SetStateAction<string>>
        | Dispatch<SetStateAction<number>>
        | Dispatch<SetStateAction<boolean>>
): setter is Dispatch<SetStateAction<number>> {
    try {
        // setter が string 型の引数を受け取れるかどうかをテスト
        setter(0 as any); // "test string" を渡してみる
        return true; // エラーが発生しなければ string 型の setter と判定
    } catch (e) {
        return false; // エラーが発生したら string ではないと判定
    }
}

export function isBooleanSetter(
    setter:
        | Dispatch<SetStateAction<string>>
        | Dispatch<SetStateAction<number>>
        | Dispatch<SetStateAction<boolean>>
): setter is Dispatch<SetStateAction<boolean>> {
    try {
        // setter が string 型の引数を受け取れるかどうかをテスト
        setter(false as any); // "test string" を渡してみる
        return true; // エラーが発生しなければ string 型の setter と判定
    } catch (e) {
        return false; // エラーが発生したら string ではないと判定
    }
}