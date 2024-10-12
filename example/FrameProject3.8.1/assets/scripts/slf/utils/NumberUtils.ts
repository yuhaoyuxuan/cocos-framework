/**数字工具
 * @author slf
 */
export default class NumberUtils {
	/**
	 * 数字格式化
	 * @param num
	 * @returns 10000 return 10,000
	*/
	public static getMoneyFormat(num): string {
		return num.toLocaleString();
	}

	/**数量转换 万||亿 保留两位小数点
	* @param num 数量
	*/
	public static getNumberString(num) {
		let prefix = ''
		num = Math.floor(num);
		if (num < 0) {
			num = -num
			prefix = '-'
		}
		let flag = "";
		let unit1 = 10000;      //  万
		let unit2 = 100000000;  //  亿
		if (num >= unit2) {
			num = parseInt(num / unit2 * 100 + "") / 100;
			flag = "亿";
		} else if (num >= 100000) {
			num = parseInt(num / unit1 * 100 + "") / 100;
			flag = "万";
		}
		return prefix + num + flag;
	}

	/**
	 * 随机固定长度的数字 0-9
	 * @param len 长度 默认5
	 * @returns 12312
	 *  */
	public static randomNum(len: number = 5): number {
		let num: string = "";
		while (--len > -1) {
			num += Math.random() * 10 >> 0
		}
		return parseInt(num);
	}

	/**
	* 固定范围内随机数
	* @param minV 最小值
	* @param maxV 最大值
	* @param isInt 是否整数 默认true
	* @returns num
	*/
	public static random(minV: number, maxV: number, isInt: Boolean = true): number {
		var result: number = (maxV - minV) * Math.random() + minV;
		if (isInt) {
			return Math.round(result)
		} else {
			return result
		}
	}

	/**
	* 固定范围内随机数字（去重）
	* @param minV 最小值
	* @param maxV 最大值
	* @param times 随机次数
	* @returns 1,10,3  [2,6,10]
	*/
	public static randomLenNum(minV: number, maxV: number, times: number): number[] {
		let arr = [];
		let arr1 = []
		let idx: number;
		if (maxV < times) {
			times = maxV;
		}
		for (var i: number = minV; i < maxV; i++) {
			arr.push(i);
		}
		while (--times > -1) {
			idx = arr.splice(this.random(arr.length - 2, 0), 1)[0]
			arr1.push(idx);
		}
		return arr1;
	}

	private static makeNumstr(num, maxnum, unit: string = "k") {
		if (num >= Math.pow(10, maxnum + 2)) {
			return Math.floor(num / Math.pow(10, maxnum)) + unit
		}
		let numPoint = 0
		if ((num % Math.pow(10, maxnum)) / Math.pow(10, maxnum - 1) >= 1) {
			numPoint = 1
		}
		return (Math.floor(num / Math.pow(10, maxnum - 2)) / Math.pow(10, 2)).toFixed(numPoint) + unit
	}
	
}