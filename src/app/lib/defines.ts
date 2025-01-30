/* 複数ファイルにまたがる定数やクラスの定義ファイル */

import * as util from "@/app/lib/util";

// シグナルの名前 シグナルが増えたら足す
export const signals = ["smashday", "insideday", "swingplay"] as const;
export type SignalType = (typeof signals)[number];

export const ipAddress = false ? "192.168.0.110:3000" : "localhost:3000";

export type Dictionary<TKey extends string | number | symbol, TValue> = {
    [key in TKey]: TValue;
};

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

    // DateStrの大小等号を判定する
    // 並び替えないなら0以下、並び替えるなら0より大きい(sortに準拠)
    public static compareDateStr(date1: DateStr, date2: DateStr): number{
        if(date1.getDateStr() == date2.getDateStr()) return 0;
        if(date1.getDateStr() >  date2.getDateStr()) return 1;
        return -1;
    }

    // "date1 == date2"であるかを判定する
    public static equalDateStr(date1: DateStr, date2: DateStr): boolean{
        return date1.getDateStr() == date2.getDateStr();
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

// 株価の四値と生産高として適切な値を保持する
export class StockPrice{
    open_: number;
    high_: number;
    low_: number;
    close_: number;
    volume_: number;

    constructor(open: number, high: number, low: number, close: number, volume: number){
        // いずれかの値が負である
        if(open < 0 || high < 0 || low < 0 || close < 0 || volume < 0){
            throw "Invalid Value: 負の値が含まれている";
        }
        // lowが最低値,highが最高値でなくてはならない
        else if(!(low <= open && open <= high && low <= close && close <= high)){
            throw "Invalid Value: 値が不正な大小関係をとっている";
        }

        this.open_ = open;
        this.high_ = high;
        this.low_ = low;
        this.close_ = close;
        this.volume_ = volume;
    }

    public getOHLCVData(): StockPriceObject{
        return {
            open:  this.open_,
            high:  this.high_,
            low:   this.low_,
            close: this.close_,
            volume: this.volume_,
        }
    }
}

type StockPriceObject = {
    open:  number,
    high:  number,
    low:   number,
    close: number,
    volume: number
};

// 判別可能ユニオン型
type TaggedStockPriceObject = {
    type: "object",
    data: ({date: string} & StockPriceObject)[],
};
type TaggedStockPrice = {
    type: "class",
    data: {date: DateStr, stockPrice: StockPrice}[],
};

type JsonStockPriceChartData = {
    symbolCode_: string;
    datas_: ({date: string} & StockPriceObject)[],
    hasHLBand_: boolean,
    hasEMA_   : boolean,
};

export class StockPriceChartData{
    private symbolCode_: string;
    private datas_: {date: DateStr, stockPrice: StockPrice}[];
    private hasHLBand_ = false;
    private hasEMA_ = false;

    constructor();
    constructor(symbolCode: string, datas: TaggedStockPrice);
    constructor(symbolCode: string, datas: TaggedStockPriceObject)
    constructor(symbolCode: string,
                datas: TaggedStockPrice,
                hasHLBand: boolean,
                hasEMA   : boolean);
    constructor(jsonData: JsonStockPriceChartData);

    constructor(
        symbolCodeORJsonData?: string | JsonStockPriceChartData,
        datas?: TaggedStockPrice | TaggedStockPriceObject,
        hasHLBand?: boolean,
        hasEMA?   : boolean,
    ){
        if(symbolCodeORJsonData && typeof symbolCodeORJsonData == "object"){
            const jsonData = symbolCodeORJsonData;
            this.symbolCode_ = jsonData.symbolCode_;
            this.datas_ = this.convertStockPriceObjectToClass(jsonData.datas_);
            this.hasHLBand_ = jsonData.hasHLBand_;
            this.hasEMA_ = jsonData.hasEMA_;
            return;
        }

        const symbolCode = symbolCodeORJsonData;
        this.symbolCode_ = symbolCode ? symbolCode : "";

        if(datas){
            // 判別可能ユニオン型で型制限
            if(datas.type == "class") this.datas_ = datas.data;
            else{
                this.datas_ = this.convertStockPriceObjectToClass(datas.data);
            }
        }
        else this.datas_ = [];
        // Check: ソート順が合っているか
        this.datas_.sort((a, b) => DateStr.compareDateStr(a.date, b.date))

        this.hasHLBand_ = hasHLBand ? hasHLBand : this.hasHLBand_;
        this.hasEMA_ = hasEMA ? hasEMA : this.hasEMA_;
    }

    // ろうそく足チャート表示用のデータを返す
    // TODO: EMAの計算処理とその引数指定
    public createStockPriceChartData
        (startDate: DateStr, endDate: DateStr): {
            chartData: {
                open: number;
                high: number;
                low: number;
                close: number;
            }[];
            chartDate: string[];
            chartEMAShort: number[];
            chartEMALong: number[];
        }
    {
        const firstDataIndex =
            this.dateToIndexBinaryFind(
                (x: DateStr) => DateStr.compareDateStr(x, startDate) >= 0
            );
        const lastDataIndex =
            this.dateToIndexBinaryFind(
                (x: DateStr) => DateStr.compareDateStr(x, endDate) > 0
            ) - 1;
        
        let chartDate: string[] = [];
        let chartData: {
            open: number;
            close: number;
            high: number;
            low: number;
        }[] = [];
        for(let di = firstDataIndex; di <= lastDataIndex && di < this.datas_.length; di++){
            chartDate.push(this.datas_[di].date.getDateStr());

            const {open, high, low, close} = this.datas_[di].stockPrice.getOHLCVData();
            chartData.push({
                open:  open,
                high:  high,
                low:   low,
                close: close,
            })
        }

        return {
            chartDate: chartDate,
            chartData: chartData,
            chartEMAShort: [],
            chartEMALong : [],
        };
    }

    // data_にconditionalExpをかけて[F,…,F,T,…,T]のとき正常に動作する
    // 左から見て最初にTとなる要素のインデックスを返す、存在しないなら最後のインデックス+1(配列の長さ)
    private dateToIndexBinaryFind(conditionalExp: (x: DateStr) => boolean): number{
        let left = 0, right = this.datas_.length;

        while(left < right){
            const mid = Math.floor((left + right) / 2);
            if(conditionalExp(this.datas_[mid].date)){
                right = mid;
            }
            else left = mid + 1;
        }

        return right;
    }

    // オブジェクトの配列をStockPriceの配列に変えたものを返す
    // コンストラクタでデータベースからの直接データを渡すときに使用する
    private convertStockPriceObjectToClass
        (datas: ({date: string} & StockPriceObject)[]):
        {date: DateStr, stockPrice: StockPrice}[]
    {
        return datas.map((val, _) => ({
            date: new DateStr(val.date),
            stockPrice: new StockPrice(
                val.open,
                val.high,
                val.low,
                val.close,
                val.volume,
            )
        }))
    }

    // Jsonに変換できる型に変換したものを返す
    public convertJsonFormat(): 
        {
            symbolCode_: string;
            datas_: (StockPriceObject & {date:string})[],
            hasHLBand_: boolean,
            hasEMA_   : boolean,
        }
    {
        return {
            symbolCode_: this.symbolCode_,
            // 復元しやすいように日付とその他をまとめる
            datas_: this.datas_.map((val, _) => ({
                date: val.date.getDateStr(),
                open:  val.stockPrice.open_,
                high:  val.stockPrice.high_,
                low :  val.stockPrice.low_,
                close: val.stockPrice.close_,
                volume: val.stockPrice.volume_,
            })),
            hasHLBand_: this.hasHLBand_,
            hasEMA_:    this.hasEMA_,
        }
    }
};