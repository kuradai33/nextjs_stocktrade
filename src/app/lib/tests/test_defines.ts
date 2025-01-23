import * as defines from "@/app/lib/defines";
import * as util from "@/app/lib/util";

let cntTestDateStr = 1;

function testDateStr(){
    //               [Name]                [Input]        [RaiseError] (ExpectedError)
    testDateStrCase("Usable01234567",      "0123-45-67",  false);
    testDateStrCase("Usable89",            "0000-00-89",  false);
    testDateStrCase("TooLongStr",          "0000-00-000", true,
                    "Invalid Value: 文字数が適切ではありません");
    testDateStrCase("WrongHyphenPosition", "000-000-00",  true,
                    "Invalid Value: ハイフンが適切な位置にありません");
    testDateStrCase("IncludeWrongChar",    "0o00-00-00",  true,
                    "Invalid Value: 数字でない文字が不適切な位置で使用されています");
}

function testDateStrCase(testName: string,
    dateStr: string,
    raisedError: boolean,
    expectedErrorText: string = ""){
try{
// dateStrで実行する
const date = new defines.DateStr(dateStr);
}
catch(errorText){
// 入力が不適切だった
const testResult = new util.TestResult(testName, 
                    cntTestDateStr,
                    {output: "", error: errorText},
                    {output: "", error: expectedErrorText});
util.printTestMessage(testResult);
cntTestDateStr++;
return;
}

// 入力が適切だった
const testResult = new util.TestResult(testName, 
                      cntTestDateStr,
                      {output: ""},
                      {output: ""});
util.printTestMessage(testResult);
cntTestDateStr++;
}