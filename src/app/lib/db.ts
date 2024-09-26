import prisma from "./prisma";
import { SignalType } from "./defines";
import { asc } from "echarts/types/src/util/number.js";

export async function addMessageInForm(message: string) {
    const post = await prisma.form.create({
        data: {
            message: message,
        },
    });
}

export async function getHelpText(signal: string) {
    const result = await prisma.signalExplanation.findFirst({ where: { signal: signal } });
    return result ? result.text : "";
}

export async function setHelpText(signal: string, text: string) {
    const id = await prisma.signalExplanation.findFirst({
        where: { signal: signal },
        select: { id: true },
    });
    if (id) {
        await prisma.signalExplanation.update({
            where: { id: id?.id },
            data: { text: text },
        });
    } else {
        await prisma.signalExplanation.create({
            data: { signal: signal, text: text },
        });
    }
}

export async function getSymbolName(symbol: string) {
    const result = await prisma.stocks.findUnique({ where: { code: symbol } });
    if (result) return result.name;
    else return null;
}

export async function getStockData(param: {
    symbol: string;
    start: string;
    end: string;
    extradate: number;
}) {
    const symbol_id = (await prisma.stocks.findUnique({ where: { code: param.symbol } }))?.id;
    let rawPrices = await prisma.stockprices.findMany({
        where: {
            AND: [
                { stock_id: symbol_id },
                { date_num: { gte: convertDateNum(param.start) } },
                { date_num: { lte: convertDateNum(param.end) } },
            ],
        },
        select: {
            date: true,
            open: true,
            close: true,
            high: true,
            low: true,
            volume: true,
        },
    });
    const rawPrePrices = (
        await prisma.stockprices.findMany({
            where: {
                AND: [{ stock_id: symbol_id }, { date_num: { lte: convertDateNum(param.start) } }],
            },
            orderBy: {
                date: "desc",
            },
            select: {
                date: true,
                open: true,
                close: true,
                high: true,
                low: true,
                volume: true,
            },
            skip: 1,
            take: param.extradate,
        })
    ).sort((a, b) => {
        if (a.date == b.date) {
            return 0;
        } else if (a.date > b.date) {
            return 1;
        } else {
            return -1;
        }
    });
    const rawPostPrices = await prisma.stockprices.findMany({
        where: {
            AND: [{ stock_id: symbol_id }, { date_num: { gte: convertDateNum(param.end) } }],
        },
        orderBy: {
            date: "asc",
        },
        select: {
            date: true,
            open: true,
            close: true,
            high: true,
            low: true,
            volume: true,
        },
        skip: 1,
        take: param.extradate,
    });

    rawPrices = rawPrePrices.concat(rawPrices).concat(rawPostPrices);

    return rawPrices;
}

export function addIndicator(
    rawPrices: { date: string; open: number; close: number; high: number; low: number }[],
    param: { HLBand: number | null; EMA: { short: number; long: number } | null }
) {
    let result: {
        date: string;
        open: number;
        close: number;
        high: number;
        low: number;
        hband?: number;
        lband?: number;
        emashort?: number;
        emalong?: number;
    }[] = [];

    const useHLBand = param.HLBand && param.HLBand > 0;
    let spanHLBand = 0;
    if (param.HLBand) spanHLBand = param.HLBand;

    const useEMA = param.EMA && param.EMA.short > 0 && param.EMA.long > 0;
    let spanEMAShort = 0,
        spanEMALong = 0,
        weightShort = 0,
        weightLong = 0;
    if (param.EMA) {
        spanEMAShort = param.EMA.short;
        spanEMALong = param.EMA.long;
        weightShort = 2 / (param.EMA.short + 1);
        weightLong = 2 / (param.EMA.long + 1);
    }

    let emashort = 0,
        emalong = 0;
    for (let i = 0; i < rawPrices.length; i++) {
        let price: {
            date: string;
            open: number;
            close: number;
            high: number;
            low: number;
            hband?: number;
            lband?: number;
            emashort?: number;
            emalong?: number;
        } = rawPrices[i];
        let hband = -1,
            lband = 1000000;
        if (useHLBand && i >= spanHLBand - 1) {
            for (let j = i - spanHLBand + 1; j <= i; j++) {
                hband = Math.max(hband, rawPrices[j].high);
                lband = Math.min(lband, rawPrices[j].low);
            }
            price.hband = hband;
            price.lband = lband;
        }

        if (useEMA) {
            // EMAShort
            if (i < spanEMAShort - 1) emashort += rawPrices[i].close;
            else if (i == spanEMAShort - 1) {
                emashort += rawPrices[i].close;
                emashort /= spanEMAShort;
                price.emashort = emashort;
            } else {
                emashort = rawPrices[i].close * weightShort + emashort * (1 - weightShort);
                price.emashort = emashort;
            }
            // EMALong
            if (i < spanEMALong - 1) emalong += rawPrices[i].close;
            else if (i == spanEMALong - 1) {
                emalong += rawPrices[i].close;
                emalong /= spanEMALong;
                price.emalong = emalong;
            } else {
                emalong = rawPrices[i].close * weightLong + emalong * (1 - weightLong);
                price.emalong = emalong;
            }
        }

        result.push(price);
    }

    return result;
}

export async function simulateSmashday(param: {
    symbol: string;
    start: string;
    end: string;
    tradeType: "buy" | "sell" | "both";
    HLBand: number | null;
    EMA: { short: number; long: number } | null;
}) {
    const symbol_id = (await prisma.stocks.findUnique({ where: { code: param.symbol } }))?.id;
    const rawPrices = await prisma.stockprices.findMany({
        where: {
            AND: [
                { stock_id: symbol_id },
                { date_num: { gte: convertDateNum(param.start) } },
                { date_num: { lte: convertDateNum(param.end) } },
            ],
        },
        select: {
            date: true,
            open: true,
            close: true,
            high: true,
            low: true,
        },
    });

    const prices = addIndicator(rawPrices, { HLBand: param.HLBand, EMA: param.EMA });

    let result: {
        sumAll: number;
        sumGain: number;
        sumLoss: number;
        cntGain: number;
        cntLoss: number;
        details: {
            startDate: string;
            endDate: string;
            tradeType: "Buy" | "Sell" | "";
            outcome: "Loss" | "Gain" | "";
            amount: string;
        }[];
    } = { sumAll: 0, sumGain: 0, sumLoss: 0, cntGain: 0, cntLoss: 0, details: [] };

    let tradePrice = 0,
        tradeType: "Buy" | "Sell" | "" = "",
        borderHigh = 0,
        borderLow = 0,
        highestClose = 0,
        lowestClose = 0,
        startDate = "";

    const useBuy = param.tradeType == "buy" || param.tradeType == "both",
        useSell = param.tradeType == "sell" || param.tradeType == "both";

    for (let i = 3; i < prices.length; i++) {
        if (tradeType != "") {
            let outcome: "Loss" | "Gain" | "" = "",
                amount = 0;
            if (tradeType == "Buy") {
                // Loss
                if (borderLow > prices[i].low) {
                    amount = tradePrice - borderLow;
                    outcome = "Loss";
                }
                // Gain Fix
                else if (prices[i].high > borderHigh) {
                    amount = borderHigh - tradePrice;
                    outcome = "Gain";
                }
                // Gain Var
                else if ((tradePrice + highestClose) / 2 > prices[i].low) {
                    amount = (tradePrice + highestClose) / 2 - tradePrice;
                    outcome = "Gain";
                } else {
                    highestClose = Math.max(highestClose, prices[i].close);
                    continue;
                }

                if (outcome == "Gain") {
                    result.sumAll += amount;
                    result.sumGain += amount;
                    result.cntGain++;
                } else if (outcome == "Loss") {
                    result.sumAll -= amount;
                    result.sumLoss += amount;
                    result.cntLoss++;
                }
            } else if ((tradeType = "Sell")) {
                // Loss
                if (borderHigh < prices[i].high) {
                    amount = borderHigh - tradePrice;
                    outcome = "Loss";
                }
                // Gain Fix
                else if (prices[i].low < borderLow) {
                    amount = tradePrice - borderLow;
                    outcome = "Gain";
                }
                // Gain Var
                else if ((tradePrice + lowestClose) / 2 > prices[i].low) {
                    amount = tradePrice - (tradePrice + lowestClose) / 2;
                    outcome = "Gain";
                } else {
                    lowestClose = Math.min(lowestClose, prices[i].close);
                    continue;
                }

                if (outcome == "Gain") {
                    result.sumAll += amount;
                    result.sumGain += amount;
                    result.cntGain++;
                } else if (outcome == "Loss") {
                    result.sumAll -= amount;
                    result.sumLoss += amount;
                    result.cntLoss++;
                }
            }
            result.details.push({
                startDate: startDate,
                endDate: prices[i].date,
                tradeType: tradeType,
                outcome: outcome,
                amount: amount.toFixed(1),
            });
            tradeType = "";
        } else {
            if (useBuy) {
                let signalBuy =
                    prices[i - 3].close > prices[i - 2].close &&
                    prices[i - 2].low > prices[i - 1].close &&
                    prices[i - 1].high < prices[i].high;

                const emashort = prices[i].emashort,
                    emalong = prices[i].emalong;
                if (emashort && emalong) {
                    // undefinedでないことの確認
                    signalBuy = signalBuy && emashort > emalong;
                }

                if (signalBuy) {
                    tradePrice = prices[i - 1].high;
                    borderLow = 0.96 * tradePrice;
                    borderHigh = 1.1 * tradePrice;
                    highestClose = prices[i - 1].close;
                    startDate = prices[i].date;
                    tradeType = "Buy";
                    continue;
                }
            }
            if (useSell) {
                let signalSell =
                    prices[i - 3].close < prices[i - 2].close &&
                    prices[i - 2].low < prices[i - 1].close &&
                    prices[i - 1].low > prices[i].low;

                const emashort = prices[i].emashort,
                    emalong = prices[i].emalong;
                if (emashort && emalong) {
                    // undefinedでないことの確認
                    signalSell = signalSell && emashort < emalong;
                }

                if (signalSell) {
                    tradePrice = prices[i - 1].low;
                    borderLow = 0.9 * tradePrice;
                    borderHigh = 1.04 * tradePrice;
                    lowestClose = prices[i - 1].close;
                    startDate = prices[i].date;
                    tradeType = "Sell";
                    continue;
                }
            }
        }
    }

    return result;
}

export async function simulateSwingplay(param: {
    symbol: string;
    start: string;
    end: string;
    tradeType: "buy" | "sell" | "both";
    closingPeriod: number;
    EMA: { short: number; long: number };
    exEMA?: { short: number; long: number };
}) {
    const symbol_id = (await prisma.stocks.findUnique({ where: { code: param.symbol } }))?.id;
    const rawPrices = await prisma.stockprices.findMany({
        where: {
            AND: [
                { stock_id: symbol_id },
                { date_num: { gte: convertDateNum(param.start) } },
                { date_num: { lte: convertDateNum(param.end) } },
            ],
        },
        select: {
            date: true,
            open: true,
            close: true,
            high: true,
            low: true,
        },
    });

    const prices = addIndicator(rawPrices, { HLBand: null, EMA: param.EMA });

    let result: {
        sumAll: number;
        sumGain: number;
        sumLoss: number;
        cntGain: number;
        cntLoss: number;
        details: {
            startDate: string;
            endDate: string;
            tradeType: "Buy" | "Sell" | "";
            outcome: string;
            amount: string;
        }[];
    } = { sumAll: 0, sumGain: 0, sumLoss: 0, cntGain: 0, cntLoss: 0, details: [] };

    let tradePrice = 0,
        tradeType: "Buy" | "Sell" | "" = "",
        tradePeriod = 0,
        over4per = false,
        startDate = "";

    const useBuy = param.tradeType == "buy" || param.tradeType == "both",
        useSell = param.tradeType == "sell" || param.tradeType == "both";

    for (let i = 1; i < prices.length; i++) {
        if (tradeType != "") {
            let outcome: string = "",
                amount = 0;
            if (tradeType == "Buy") {
                const emalong = prices[i - 1].emalong;
                // Loss
                if (!over4per && prices[i].low < tradePrice * 0.96) {
                    amount = tradePrice * 0.96 - tradePrice;
                    outcome = "損切(4%前)";
                } else if (over4per && emalong && prices[i].low < emalong) {
                    amount = emalong - tradePrice;
                    outcome = "損切(4%後)";
                }
                // Mid
                else if (tradePeriod >= param.closingPeriod) {
                    amount = prices[i].close - tradePrice;
                    outcome = "期間手仕舞い";
                }
                // Gain
                else if (prices[i].high > tradePrice * 1.08) {
                    amount = tradePrice * 1.08 - tradePrice;
                    outcome = "利益";
                } else {
                    tradePeriod++;
                    if (!over4per && prices[i].high > tradePrice * 1.04) over4per = true;
                    continue;
                }
            } else if ((tradeType = "Sell")) {
                const emalong = prices[i - 1].emalong;
                // Loss
                if (!over4per && prices[i].high > tradePrice * 1.04) {
                    amount = tradePrice - tradePrice * 1.04;
                    outcome = "損切(4%前)";
                } else if (over4per && emalong && prices[i].high > emalong) {
                    amount = tradePrice - emalong;
                    outcome = "損切(4%後)";
                }
                // Mid
                else if (tradePeriod >= param.closingPeriod) {
                    amount = tradePrice - prices[i].close;
                    outcome = "期間手仕舞い";
                }
                // Gain
                else if (prices[i].low < tradePrice * 0.92) {
                    amount = tradePrice - tradePrice * 0.92;
                    outcome = "利益";
                } else {
                    tradePeriod++;
                    if (!over4per && prices[i].low < tradePrice * 0.96) over4per = true;
                    continue;
                }
            }
            result.sumAll += amount;
            result.sumGain += Math.max(amount, 0);
            result.sumLoss += Math.min(amount, 0);
            if (amount >= 0) result.cntGain++;
            else result.cntLoss++;

            result.details.push({
                startDate: startDate,
                endDate: prices[i].date,
                tradeType: tradeType,
                outcome: outcome,
                amount: amount >= 0 ? amount.toFixed(1) : "▲" + (-amount).toFixed(1),
            });
            tradeType = "";
        } else {
            if (useBuy) {
                let signalBuy = false;
                const emashort = prices[i - 1].emashort,
                    emalong = prices[i - 1].emalong;
                if (emashort && emalong) {
                    signalBuy = emashort > emalong && emashort < prices[i].high;
                }

                if (signalBuy && emashort) {
                    tradePrice = emashort;
                    startDate = prices[i].date;
                    tradeType = "Buy";
                    over4per = false;
                    tradePeriod = 0;
                    continue;
                }
            }
            if (useSell) {
                let signalSell = false;
                const emashort = prices[i - 1].emashort,
                    emalong = prices[i - 1].emalong;
                if (emashort && emalong) {
                    signalSell = emashort < emalong && emashort > prices[i].low;
                }

                if (signalSell && emashort) {
                    tradePrice = emashort;
                    startDate = prices[i].date;
                    tradeType = "Sell";
                    over4per = false;
                    tradePeriod = 0;
                    continue;
                }
            }
        }
    }

    return result;
}

function convertDateNum(date: string) {
    const devided_date = date.split("-");
    return (
        (Number(devided_date[0]) - 2000) * 366 +
        (Number(devided_date[1]) - 1) * 31 +
        Number(devided_date[2]) -
        1
    );
}

export function roundByDigit(value: number, digit: number) {
    const multiplier = Math.pow(10, digit);
    return Math.round(value * multiplier) / multiplier;
}