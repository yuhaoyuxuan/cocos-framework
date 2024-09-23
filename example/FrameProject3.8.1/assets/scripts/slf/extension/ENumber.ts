
/**
 * 扩展Number原型
 */
interface Number {
    /**
     * 返回以定点记数法表示数字的字符串。(小数位不会四舍五入) toFixed会四舍五入
     * @param decimals 小数位数 默认2位
     */
    toFix(decimals?: number): number
    /**
     * 数字转换KBM显示
     * @param showK 是否显示k 默认显示 最小单位1w才会转换
     */
    toKBM(showK?: boolean): string

}

Number.prototype.toFix = function (decimals: number = 2): number {
    let num: number = this;
    if (!num) {
        return 0;
    }
    if (num % 1 == 0) {
        return num;
    }
    let strs = num.toString().split(".");
    return Number(strs[0] + "." + strs[1].substring(0, decimals));
}

Number.prototype.toKBM = function (showK: boolean = true): string {
    let chipsNum: number = this;
    if (!chipsNum) {
        return "0";
    }
    let flag = "";
    if (chipsNum < 0) {
        flag = "-";
    }
    chipsNum = Math.abs(chipsNum);
    let _chipsStr = '';
    if (chipsNum < 1000000) {
        if (showK && chipsNum >= 10000) {
            chipsNum = chipsNum / 1000;
            _chipsStr = `${chipsNum.toFix()}K`;
        } else {
            _chipsStr = `${chipsNum.toFix()}`;
        }
    } else if (chipsNum < 1000000000) {
        chipsNum = chipsNum / 1000;
        chipsNum = chipsNum / 1000;
        _chipsStr = `${chipsNum.toFix()}M`;
    } else {
        chipsNum = chipsNum / 1000000;
        chipsNum = chipsNum / 1000;
        _chipsStr = `${chipsNum.toFix()}B`;
    }
    return flag + _chipsStr;
}

