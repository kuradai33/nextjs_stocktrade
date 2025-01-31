/* 汎用コードのライブラリ */

import { DateStr } from "@/app/lib/defines";

// テストの結果を保持する
export class TestResult{
    name_ = "";
    num_ = -1;
    result_: { output: any; error?: any; };
    expectedResult_: { output: any; error?: any; };
    isCorrect_ = false;

    constructor(name: string, num: number,
                result:         { output: any; error?: any; },
                expectedResult: { output: any; error?: any; }){
        // メンバ変数の初期化
        this.name_ = name;
        this.num_ = num;
        this.result_ = result;
        this.expectedResult_ = expectedResult;

        // 出力とエラーが正しいか確認する
        if(this.checkEqualData(result.output, expectedResult.output) &&
           this.checkEqualData(result.error,  expectedResult.error )){
            this.isCorrect_ = true;
        }
        else this.isCorrect_ = false;
    }

    private checkEqualData(data1: any, data2: any){
        if(data1 === null && data2 === null) return true;

        const isArrayBothData = Array.isArray(data1) && Array.isArray(data2);
        // objectと判定されるのは配列とnullとオブジェクト
        const isObjectBothData = typeof data1 == "object" && typeof data2 == "object";
        if(isArrayBothData || isObjectBothData){
            // Object型はJson形式の文字列に変換して比較
            return JSON.stringify(data1) == JSON.stringify(data2);
        }

        // Enhance: 関数の同値判定を追加
        if(typeof data1 == "function" && typeof data2 == "function"){
            throw "TypeError: 関数同士を比較することができません";
        }

        return data1 === data2
    }

    // 各メンバ変数の値を返す
    public getName(): string{
        return this.name_;
    }
    public getNum(): number{
        return this.num_;
    }
    public getResult(): { output: any; error?: any; }{
        return this.result_;
    }
    public getExpectedResult(): { output: any; error?: any; }{
        return this.expectedResult_;
    }
    public getIsCorrect(): boolean{
        return this.isCorrect_;
    }
}

// テストの結果を出力する
export function printTestMessage(testInfo: TestResult){
    // テストの情報を出力
    console.log(`[Test${testInfo.getNum()}]`);
    console.log(`Name: ${testInfo.getName()}`);

    // テストの結果を出力
    console.log(`Result: ${testInfo.getIsCorrect()}`);

    // 異常な動作である
    if(!testInfo.getIsCorrect()){
        const result = testInfo.getResult();
        const expectedResult = testInfo.getExpectedResult();
        // 結果を出力
        console.log(`  Output        : ${result.output}`);
        console.log(`  ExpectedOutput: ${expectedResult.output}`);
        // エラーが存在するならエラーを出力
        if(result.error && expectedResult.error){
            console.log(`  Error        : ${result.error}`);
            console.log(`  ExpectedError: ${expectedResult.error}`);
        }
    }
}

// 今日の日付を持ったDateStrを返す
export function getTodayStr(): DateStr{
    // 今日の日付を取得
    const today = new Date();
    const monthNum = today.getMonth() + 1;
    const dayNum = today.getDate();
    const yearNum = today.getFullYear();

    // 月,日を2桁に
    const monthStr = (monthNum < 10) ? `0${monthNum}` : `${monthNum}`;
    const dayStr = (dayNum < 10) ? `0${dayNum}` : `${dayNum}`;

    const todayStr = `${yearNum}-${monthStr}-${dayStr}`;
    return new DateStr(todayStr);
}

// 文字列が特定の文字で構成されているか判定する
export function checkComposedUsableChar(checkedStr: string, usableChars: string): boolean{
    // checkedStrがavailableCharsで構成されているか確認する
    for(const c of checkedStr){
        // cが使えない文字であるか確認する
        if(!usableChars.includes(c)){
            return false;
        }
    }
    return true;
}

// データがDateStrであるまたは配列やオブジェクトの要素にDataStrが含まれていたらstringに変換する
// Json形式にするときに使用する
export function convertDateStrToString(data: any): any {
    // DateStrはtypeofでobjectと判定されるからその前に置く
    // 元に戻せるように文字列に印を付ける
    if(data instanceof DateStr){
        return `${data.dateStr_}-**DateStr**`;
    }
    else if(data == null) return data;
    else if(Array.isArray(data)){
        return data.map((v, _) => convertDateStrToString(v));
    }
    // objectと判定されるのは配列とnullとオブジェクト
    else if(typeof data == "object"){
        let newObject: {[K: string]: any} = {};
        for(const key in data){
            const value = data[key];
            newObject[key] = convertDateStrToString(value);
        }
        return newObject;
    }
    else return data;
}

// データの元がDateStrであるまたは配列やオブジェクトの要素にそれが含まれていたらDateStrに変換する
// Json形式から戻すときに使用する
export function convertSpecificStringToDateStr(data: any): any { 
    if(typeof data == "string"){
        const hyphenSplitStrData = data.split("-");
        if(hyphenSplitStrData[hyphenSplitStrData.length - 1] == "**DateStr**"){
            return new DateStr(data.slice(0, data.length - 12));
        }
        else return data;
    }
    else if(data == null) return data;
    else if(Array.isArray(data)){
        return data.map((v, _) => convertSpecificStringToDateStr(v));
    }
    // objectと判定されるのは配列とnullとオブジェクト
    else if(typeof data == "object"){
        let newObject: {[K: string]: any} = {};
        for(const key in data){
            const value = data[key];
            newObject[key] = convertSpecificStringToDateStr(value);
        }
        return newObject;
    }
    else return data;
}