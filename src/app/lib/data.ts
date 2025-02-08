import { Dictionary, signals, SignalType } from "@/app/lib/defines";
import { getHelpText, setHelpText } from "./db";

// ヘルプメッセージのキャッシュ
export class HelpMessages{
    private static helpMessages_: Dictionary<string, string> = {};
    private static doneInitialize_ = false;

    private static async initialize(){
        for(const signal of signals){
            this.helpMessages_[signal] = await getHelpText(signal);
        }
    }

    public static async getHelpmessage(signal: SignalType){
        if(!this.doneInitialize_){
            await this.initialize();
            this.doneInitialize_ = true;
        }

        return this.helpMessages_[signal];
    }

    public static setHelpmessage(signal: SignalType, message: string): void{
        if(!this.doneInitialize_){
            this.initialize();
            this.doneInitialize_ = true;
        }

        setHelpText(signal, message);
    }
}

// 銘柄コードや銘柄名から他方を取得するデータのキャッシュ
export class SymbolNames{
    private static data_: { code: string; id: number; name: string }[];
    private static dicCodeToName_: Dictionary<string, string> = {};
    private static dicCodeToId_: Dictionary<string, number> = {};
    // private static dicNameToCode: Dictionary<string, string>;
    private static hasData_ = false;

    public static getHasData(): boolean{ return this.hasData_; }

    public static setData(data: { code: string; id: number; name: string }[]){
        if(this.hasData_) return;

        this.hasData_ = true;
        this.data_ = data;

        let dicCodeToName: Dictionary<string, string> = {};
        for(const e of data) dicCodeToName[e.code] = e.name;
        this.dicCodeToName_ = dicCodeToName;

        let dicCodeToId: Dictionary<string, number> = {};
        for(const e of data) dicCodeToId[e.code] = e.id;
        this.dicCodeToId_ = dicCodeToId;

        // let dicNameToCode: Dictionary<string, string> = {};
        // for(const e of data) dicNameToCode[e.name] = e.code;
        // this.dicNameToCode_ = dicNameToCode;
    }

    // 銘柄コードから銘柄名を取得する
    // 見つかったら銘柄名、見つからなかったらnull
    public static getSymbolNameFromCode(code: string): string | null{
        if(!this.hasData_) throw "データが設定されていません";
        
        const symbolName = this.dicCodeToName_[code];
        if(symbolName == undefined) return null;
        else return symbolName;
    }

    // 銘柄コードから銘柄IDを取得する
    // 見つかったら銘柄ID、見つからなかったらnull
    public static getSymbolIdFromCode(code: string): number | null{
        if(!this.hasData_) throw "データが設定されていません";
        
        const symbolId = this.dicCodeToId_[code];
        if(symbolId == undefined) return null;
        else return symbolId;
    }
}