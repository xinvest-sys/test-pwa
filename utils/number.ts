/// How to Round to a Certain Number of Decimal Places in JavaScript
/// https://medium.com/swlh/how-to-round-to-a-certain-number-of-decimal-places-in-javascript-ed74c471c1b8

export function roundUp(value: number, decimalPlaces: number): number {
  if (value) {
    if (value % 1 !== 0) {
      const x: number = parseFloat(value + "e" + decimalPlaces);
      return Number(Math.round(x) + "e-" + decimalPlaces);
    } else {
      return value;
    }
  } else {
    return 0;
  }
}

export function padWithZero(num: number | undefined, size: number): string {
  return num ? String(num).padStart(size, "0") : "0.00";
}

export function getDecimalPlaces(ticker: string): number {
  if (ticker === "^GSPC" || ticker === "SP500" || ticker === "标普") return 0;
  if (ticker === "^DJI" || ticker === "DOW" || ticker === "道指") return 0;
  if (ticker === "^HSI" || ticker === "HSI" || ticker === "恒指") return 0;
  if (ticker === "000300.SS" || ticker === "CSI" || ticker === "滬深") return 0;
  if (ticker === "^N225" || ticker === "NIKKEI" || ticker === "日經") return 0;
  if (ticker === "GC=F" || ticker === "GOLD" || ticker === "黄金") return 0;
  if (ticker === "SI=F" || ticker === "SILVER" || ticker === "白銀") return 2;
  if (ticker === "MCL=F" || ticker === "WTI" || ticker === "石油") return 2;
  if (ticker === "EURUSD=X" || ticker === "EURUSD" || ticker === "歐元兌美元") return 4;
  if (ticker === "USDJPY=X" || ticker === "USDJPY" || ticker === "美元兌日圓") return 2;
  if (ticker === "GBPUSD=X" || ticker === "GBPUSD" || ticker === "英鎊兌美元") return 4;
  if (ticker === "USDCHF=X" || ticker === "USDCHF" || ticker === "美元兌瑞郎") return 4;
  if (ticker === "AUDUSD=X" || ticker === "AUDUSD" || ticker === "澳元兌美元") return 4;
  if (ticker === "NZDUSD=X" || ticker === "NZDUSD" || ticker === "紐元兌美元") return 4;
  if (ticker === "USDCAD=X" || ticker === "USDCAD" || ticker === "美元兌加元") return 4;

  return 2;
}

export function displayNumber (
  value: number | null,
  displayDecimal: number | null
): string {
  // Round the number to the specified decimal places
  if (value && displayDecimal) {
    const factor = Math.pow(10, displayDecimal);
    const roundedNumber = Math.round(value * factor) / factor;

    // Convert the rounded number to a string with fixed decimal places
    const result = roundedNumber.toFixed(displayDecimal);

    // Display the result on console.log
    console.log(result);

    // Return the result as a string
    return result;
  } else {
    return value?.toString() || "";
  }
};
