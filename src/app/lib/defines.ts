/* 複数ファイルにまたがる定数やクラスの定義ファイル */

import * as util from "@/app/lib/util";

// シグナルの名前 シグナルが増えたら足す
export const signals = ["smashday", "insideday", "swingplay"] as const;
export type SignalType = (typeof signals)[number];

export const ipAddress = false ? "192.168.0.110:3000" : "localhost:3000";

// yyyy-mm-ddの日付を保持する
export class DateStr {
    private dateStr_: string;

    // コンストラクタの複数定義
    constructor();
    constructor(dateStr: string);

    constructor(dateStr?: string) {
        if(!dateStr){
            this.dateStr_ = "0000-00-00";
            return;
        }

        // 「○○○○-○○-○○」の文字数は10
        if (dateStr.length != 10) {
            throw "Invalid Value: 文字数が適切ではありません";
        }
        // 日付として「-」が適切な位置にある
        if (dateStr[4] != "-" || dateStr[7] != "-") {
            throw "Invalid Value: ハイフンが適切な位置にありません";
        }

        // yyyy,mm,ddの場所を取り出し結合する
        const yearStr = dateStr.slice(0, 4);
        const monthStr = dateStr.slice(5, 7);
        const dayStr = dateStr.slice(8, 10);
        // 上3つは全て数字で構成される必要がある
        const dateStrNumber = yearStr + monthStr + dayStr;
        if (!util.checkComposedUsableChar(dateStrNumber, "1234567890")) {
            throw "Invalid Value: 数字でない文字が不適切な位置で使用されています";
        }

        // dateStrはyyyy-mm-ddの形になっている
        this.dateStr_ = dateStr;
    }

    public getDateStr(): string {
        return this.dateStr_;
    }
}

// 日ごとのシグナルの詳細の型
export type SignalDetailByDate = {
    startDate: DateStr;
    endDate:   DateStr;
    tradeType: "Buy" | "Sell" | "";
    outcome: string;
    amount: string;
};

// シミュレーションの結果を保持するクラス
export class SimulationResult {
    totalProfit_: number;
    totalGain_: number;
    totalLoss_: number;
    cntGain_: number;
    cntLoss_: number;
    detailsByDate_: SignalDetailByDate[] = [];

    // コンストラクタの複数定義
    constructor();
    constructor(
        totalProfit: number,
        totalGain: number,
        totalLoss: number,
        cntGain: number,
        cntLoss: number,
        detailsByDate: SignalDetailByDate[]
    );
    constructor(
        totalProfit: number,
        totalGain: number,
        totalLoss: number,
        cntGain: number,
        cntLoss: number,
        detailsByDate: 
        {
            startDate: DateStr;
            endDate:   DateStr;
            tradeType: "Buy" | "Sell" | "";
            outcome: string;
            amount: string;
        }[]
    );

    constructor(
        totalProfit?: number,
        totalGain?: number,
        totalLoss?: number,
        cntGain?: number,
        cntLoss?: number,
        detailsByDate?: any[]
    ) {
        this.totalProfit_ = totalProfit ? totalProfit : -1;
        this.totalGain_ = totalGain ? totalGain : -1;
        this.totalLoss_ = totalLoss ? totalLoss : -1;
        this.cntGain_ = cntGain ? cntGain : -1;
        this.cntLoss_ = cntLoss ? cntLoss : -1;

        // 配列が存在するか
        if(!detailsByDate || detailsByDate.length == 0) this.detailsByDate_ = [];
        else{
            const startDate = detailsByDate[0].startDate;
            // dateの型がDateStrかstringか
            if(startDate instanceof DateStr){
                this.detailsByDate_ = detailsByDate;
            }
            else if(typeof startDate == "object"){
                this.detailsByDate_ = detailsByDate.map(
                    (value, _) => {
                        try{
                            value.startDate = new DateStr(value.startDate.dateStr);
                            value.endDate = new DateStr(value.endDate.dateStr);
                        }
                        catch(e){
                            console.log(`Error: ${e}`);
                        }
                        return value});
            }
            else if(typeof startDate == "string"){
                this.detailsByDate_ = detailsByDate.map(
                    (value, _) => {
                        try{
                            value.startDate = new DateStr(value.startDate);
                            value.endDate = new DateStr(value.endDate);
                        }
                        catch(e){
                            console.log(`Error: ${e}`);
                        }
                        return value});
            }
            else throw "detailsByDateの型が適切ではありません";
        }
    }

    public getTotalProfit(): number {
        return this.totalProfit_;
    }
    public getTotalGain(): number {
        return this.totalGain_;
    }
    public getTotalLoss(): number {
        return this.totalLoss_;
    }
    public getCntGain(): number {
        return this.cntGain_;
    }
    public getCntLoss(): number {
        return this.cntLoss_;
    }
    public getDetailsByDate(): SignalDetailByDate[] {
        return this.detailsByDate_;
    }
}