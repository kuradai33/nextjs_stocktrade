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
export class DateStr{
    readonly dateStr_: string;

    // コンストラクタの複数定義
    constructor();
    constructor(dateStr: string);

    constructor(dateStr?: string){
        if(!dateStr){
            this.dateStr_ = "0000-00-00";
            return;
        }

        // 「○○○○-○○-○○」の文字数は10
        if(dateStr.length != 10){
            throw "Invalid Value: 文字数が適切ではありません";
        }
        // 日付として「-」が適切な位置にある
        if(dateStr[4] != "-" || dateStr[7] != "-"){
            throw "Invalid Value: ハイフンが適切な位置にありません";
        }

        // yyyy,mm,ddの場所を取り出し結合する
        const yearStr = dateStr.slice(0, 4);
        const monthStr = dateStr.slice(5, 7);
        const dayStr = dateStr.slice(8, 10);
        // 上3つは全て数字で構成される必要がある
        const dateStrNumber = yearStr + monthStr + dayStr;
        if(!util.checkComposedUsableChar(dateStrNumber, "1234567890")){
            throw "Invalid Value: 数字でない文字が不適切な位置で使用されています";
        }

        // dateStrはyyyy-mm-ddの形になっている
        this.dateStr_ = dateStr;
    }

    // DateStrの大小等号を判定する
    // 並び替えないなら0以下、並び替えるなら0より大きい(sortに準拠)
    public static compareDateStr(date1: DateStr, date2: DateStr): number{
        if(date1.dateStr_ == date2.dateStr_) return 0;
        if(date1.dateStr_ >  date2.dateStr_) return 1;
        return -1;
    }

    // "date1 == date2"であるかを判定する
    public static equalDateStr(date1: DateStr, date2: DateStr): boolean{
        return date1.dateStr_ == date2.dateStr_;
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
        detailsByDate: {
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
    ){
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
                this.detailsByDate_ = detailsByDate.map((value, _) => {
                    try {
                        value.startDate = new DateStr(value.startDate.dateStr);
                        value.endDate = new DateStr(value.endDate.dateStr);
                    }
                    catch(e){
                        console.log(`Error: ${e}`);
                    }
                    return value;
                });
            }
            else if(typeof startDate == "string"){
                this.detailsByDate_ = detailsByDate.map((value, _) => {
                    try{
                        value.startDate = new DateStr(value.startDate);
                        value.endDate = new DateStr(value.endDate);
                    }
                    catch (e){
                        console.log(`Error: ${e}`);
                    }
                    return value;
                });
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
    readonly open_: number;
    readonly high_: number;
    readonly low_: number;
    readonly close_: number;
    readonly volume_: number;

    constructor(open: number, high: number, low: number, close: number, volume: number){
        // いずれかの値が負である
        if(open < 0 || high < 0 || low < 0 || close < 0 || volume < 0){
            throw "Invalid Value: 負の値が含まれている";
        }
        // lowが最低値,highが最高値でなくてはならない
        else if(!(low <= open && open <= high && low <= close && close <= high)){
            throw "Invalid Value: 値が不正な大小関係をとっている";
        }

        this.open_  = open;
        this.high_  = high;
        this.low_   = low;
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
        };
    }
}

type StockPriceObject = {
    open:  number;
    high:  number;
    low:   number;
    close: number;
    volume: number
};

// 判別可能ユニオン型
type TaggedStockPriceObject = {
    type: "object";
    data: ({date: string} & StockPriceObject)[];
};
type TaggedStockPrice = {
    type: "class";
    data: { date: DateStr; stockPrice: StockPrice }[];
};

type JsonStockPriceChartData = {
    symbolCode_: string;
    datas_: ({ date: string } & StockPriceObject)[];
};

export class StockPriceData{
    readonly symbolCode_: string;
    readonly datas_: { date: DateStr; stockPrice: StockPrice }[];

    private datasEMA_: Dictionary<number, (number | null)[]> = {};

    constructor();
    constructor(symbolCode: string, datas: TaggedStockPrice);
    constructor(symbolCode: string, datas: TaggedStockPriceObject);
    constructor(jsonData: JsonStockPriceChartData);

    constructor(
        symbolCodeORJsonData?: string | JsonStockPriceChartData,
        datas?: TaggedStockPrice | TaggedStockPriceObject,
    ){
        if(symbolCodeORJsonData && typeof symbolCodeORJsonData == "object"){
            const jsonData = symbolCodeORJsonData;
            this.symbolCode_ = jsonData.symbolCode_;
            this.datas_ = this.convertStockPriceObjectToClass(jsonData.datas_);
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
        this.datas_.sort((a, b) => DateStr.compareDateStr(a.date, b.date));
    }

    // ろうそく足チャート表示用のデータを返す
    // TODO: EMAの計算処理とその引数指定
    public createStockPriceData({
        rangeDate,
        extraDate = 0,
        spanEMA,
        spanEMALong,
    }: {
        rangeDate?: [DateStr, DateStr];
        extraDate?: number;
        spanEMA?: number;
        spanEMALong?: number;
    }): {
        sizeData: number;
        chartData: {
            open: number;
            high: number;
            low: number;
            close: number;
        }[];
        chartDate: string[];
        chartEMAShort: (number | null)[];
        chartEMALong: (number | null)[];
    } {
        // EMAが必要なら取得する
        let indicatorEMA: (number | null)[] = [];
        let indicatorEMALong: (number | null)[] = [];
        if (spanEMA) {
            indicatorEMA =
                `${spanEMA}` in this.datasEMA_
                    ? this.datasEMA_[spanEMA]
                    : this.addComputedEMAIndicator(spanEMA);
        }
        if (spanEMA && spanEMALong) {
            indicatorEMALong =
                `${spanEMALong}` in this.datasEMA_
                    ? this.datasEMA_[spanEMALong]
                    : this.addComputedEMAIndicator(spanEMALong);
        }

        // 日付指定がなかったらデータ全体を返す
        if (!rangeDate) {
            return {
                sizeData: this.datas_.length,
                chartData: this.datas_.map((val) => val.stockPrice.getOHLCVData()),
                chartDate: this.datas_.map((val) => val.date.dateStr_),
                chartEMAShort: spanEMA ? this.datasEMA_[spanEMA] : [],
                chartEMALong: spanEMALong ? this.datasEMA_[spanEMALong] : [],
            };
        }

        const [startDate, endDate] = rangeDate;
        // 期間内のデータの範囲を表すインデックスを取得
        const mainDataFirstIndex = this.dateToIndexBinaryFind(
            (x: DateStr) => DateStr.compareDateStr(x, startDate) >= 0
        );
        const mainDataLastIndex =
            this.dateToIndexBinaryFind(
                (x: DateStr) => DateStr.compareDateStr(x, endDate) > 0
            ) - 1;

        // 期間を広げたインデックスを取得
        // firstはfor文の初期値のため少なくとも0以上
        // lastはfor文の条件式ではじかれるため上限を決めなくてよい
        const dataFirstIndex = Math.max(0, mainDataFirstIndex - extraDate);
        const dataLastIndex  = mainDataLastIndex + extraDate;

        let chartDate: string[] = [];
        let chartData: {
            open: number;
            close: number;
            high: number;
            low: number;
        }[] = [];
        let chartDataEMA: (number | null)[] = [];
        let chartDataEMALong: (number | null)[] = [];
        for(let i = dataFirstIndex; i <= dataLastIndex && i < this.datas_.length; i++){
            chartDate.push(this.datas_[i].date.dateStr_);

            const { open, high, low, close } = this.datas_[i].stockPrice.getOHLCVData();
            chartData.push({
                open:  open,
                high:  high,
                low:   low,
                close: close,
            });

            if(spanEMA) chartDataEMA.push(indicatorEMA[i]);
            if(spanEMA && spanEMALong) chartDataEMALong.push(indicatorEMALong[i]);
        }

        return {
            sizeData: chartData.length,
            chartDate: chartDate,
            chartData: chartData,
            chartEMAShort: chartDataEMA,
            chartEMALong : chartDataEMALong,
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
    private convertStockPriceObjectToClass(
        datas: ({ date: string } & StockPriceObject)[]
    ): { date: DateStr; stockPrice: StockPrice }[] {
        return datas.map((val, _) => ({
            date: new DateStr(val.date),
            stockPrice: new StockPrice(val.open, val.high, val.low, val.close, val.volume),
        }));
    }

    // Jsonに変換できる型に変換したものを返す
    public convertJsonFormat():{
        symbolCode_: string;
        datas_: (StockPriceObject & { date: string })[];
    }{
        return {
            symbolCode_: this.symbolCode_,
            // 復元しやすいように日付とその他をまとめる
            datas_: this.datas_.map((val, _) => ({
                date: val.date.dateStr_,
                open:  val.stockPrice.open_,
                high:  val.stockPrice.high_,
                low :  val.stockPrice.low_,
                close: val.stockPrice.close_,
                volume: val.stockPrice.volume_,
            })),
        };
    }

    // EMAを計算してindicatorEMAに追加
    private addComputedEMAIndicator(spanEMA: number): (number | null)[]{
        const weightEMA = 2 / (spanEMA + 1);

        let valueEMA = 0;
        let indicatorEMA: (number | null)[] = [];
        for(let i = 0; i < this.datas_.length; i++){
            const close = this.datas_[i].stockPrice.close_;
            // spanEMA日目までは未定義
            if(i < spanEMA - 1){
                valueEMA += close;
                indicatorEMA.push(null);
                continue;
            }

            // spanEMA日目はそれまでの相加平均
            if(i == spanEMA - 1){
                valueEMA += close;
                valueEMA /= spanEMA;
            }
            // spanEMA日目より後は重み付き和
            else valueEMA = close * weightEMA + valueEMA * (1 - weightEMA);
            indicatorEMA.push(valueEMA);
        }

        this.datasEMA_[spanEMA] = indicatorEMA;
        return indicatorEMA;
    }
};