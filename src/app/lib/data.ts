import { Dictionary } from "@/app/lib/defines";

// 銘柄コードや銘柄名から他方を取得するデータのキャッシュ
export class SymbolNames{
    private static data_: { code: string; id: number; name: string }[];
    private static dicCodeToName_: Dictionary<string, string> = {};
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

        // let dicNameToCode: Dictionary<string, string> = {};
        // for(const e of data) dicNameToCode[e.name] = e.code;
        // this.dicNameToCode_ = dicNameToCode;
    }

    // 銘柄コードから銘柄名を取得する
    // 見つかったら銘柄名、見つからなかったらnull
    public static getSymbolNameFromCode(code: string){
        if(!this.hasData_) throw "データが設定されていません";
        
        const symbolName = this.dicCodeToName_[code];
        if(symbolName == undefined) return null;
        else return symbolName;
    }
}