import { DateStr} from "@/app/lib/defines";
import * as util from "@/app/lib/util";

let cntConvertDateStrToString = 1;
let cntConvertSpecificStringToDateStr = 1;

testConvertSpecificStringToDateStr();

function testConvertDateStrToString(){
    //                             [Name]         [Input]                    [ExpectedOutput]
    testConvertDateStrToStringCase("NumberData",  0,                         0);
    testConvertDateStrToStringCase("StringData",  "abc",                     "abc");
    testConvertDateStrToStringCase("NullData",    null,                      null);
    testConvertDateStrToStringCase("DateStrData", new DateStr("0000-00-00"), "0000-00-00");
    testConvertDateStrToStringCase("ArrayDataIncludeDateStr",
                                   [0, "abc", new DateStr("0000-00-00")],
                                   [0, "abc", "0000-00-00"]);
    testConvertDateStrToStringCase("ObjectDataIncludeDateStr",
                                   {num: 0, str: "abc", dateStr: new DateStr("0000-00-00")},
                                   {num: 0, str: "abc", dateStr: "0000-00-00"});
}

function testConvertDateStrToStringCase(
    testName: string,
    input:          any,
    expectedOutput: any)
{
    const output = util.convertDateStrToString(input);

    const testResult = new util.TestResult(
        testName,
        cntConvertDateStrToString,
        {output: output},
        {output: expectedOutput},
    )
    util.printTestMessage(testResult);
    cntConvertDateStrToString++;
}

function testConvertSpecificStringToDateStr(){
    //                                     [Name]         [Input]  [ExpectedOutput]
    testConvertSpecificStringToDateStrCase("NumberData",  0,       0);
    testConvertSpecificStringToDateStrCase("StringData",  "abc",   "abc");
    testConvertSpecificStringToDateStrCase("NullData",    null,    null);
    testConvertSpecificStringToDateStrCase("SpecificStringData",
                                           "0000-00-00-**DateStr**",
                                           new DateStr("0000-00-00"));
    testConvertSpecificStringToDateStrCase("ArrayDataIncludeSpecificString",
                                           [0, "abc", "0000-00-00-**DateStr**"],
                                           [0, "abc", new DateStr("0000-00-00")]);
    testConvertSpecificStringToDateStrCase("ObjectDataIncludeSpecificString",
                                   {num: 0, str: "abc", dateStr: "0000-00-00-**DateStr**"},
                                   {num: 0, str: "abc", dateStr: new DateStr("0000-00-00")});
}

function testConvertSpecificStringToDateStrCase(
    testName: string,
    input:          any,
    expectedOutput: any)
{
    const output = util.convertSpecificStringToDateStr(input);

    const testResult = new util.TestResult(
        testName,
        cntConvertSpecificStringToDateStr,
        {output: output},
        {output: expectedOutput},
    )
    util.printTestMessage(testResult);
    cntConvertSpecificStringToDateStr++;
}