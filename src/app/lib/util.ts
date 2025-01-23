/* 汎用コードのライブラリ */

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
        if(result.output == expectedResult.output && result.error == expectedResult.error){
            this.isCorrect_ = true;
        }
        else this.isCorrect_ = false;
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