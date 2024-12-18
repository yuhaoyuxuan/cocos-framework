/**
 * 日期工具
 * @author slf
 */
export default class DateUtils {

	/**一分钟 s */
	public static Minute: number = 60;
	/**一小时 s */
	public static Hour: number = this.Minute * 60;
	/**一天 s */
	public static Day: number = this.Hour * 24;

	/**
	 * 获取当前时间戳(毫秒)
	 */
	public static getTime(): number {
		return new Date().getTime();
	}
	/**
	 * 获取年月日
	 * @param ms 毫秒 | 当前时间的日期
	 * @param flag 分隔符默认 -
	 * @returns 年-月-日
	 */
	public static getYMD(ms?: number, flag: string = "-"): string {
		let date = this.YMDHMS(ms);
		let str = date.year + flag + date.month + flag + date.day;
		return str;
	}

	/**
	 * 获取时分秒
	 * @param ms 毫秒 | 当前时间的日期
	 * @param isZero 是否补零
	 * @returns 时:分:秒
	 */
	public static getHMS(ms?: number, isZero: boolean = true): string {
		let date = this.YMDHMS(ms);
		if (isZero) {
			return this.pad(date.hour) + ":" + this.pad(date.minute) + ":" + this.pad(date.second);
		} else {
			return date.hour + ":" + date.minute + ":" + date.second;
		}
	}

	/**
	 * 获取年-月-日 时:分:秒
	 * @param ms 时间戳的日期 | 当前时间的日期
	 */
	public static getYTDHMS(ms?: number, flag: string = "-"): string {
		return this.getYMD(ms, flag) + " " + this.getHMS(ms);
	}

	/**
	 * 获取倒计时
	 * @param second 秒
	 * @param showSecond 是否显示秒
	 * @returns 天:时:分:秒
	 *  */
	public static getCD(second: number, showSecond: boolean = true): string {
		let str = "";
		if (second == 0) {
			return '0'
		}
		let minute = Math.floor(second / 60);
		let hour = Math.floor(minute / 60);
		let day = Math.floor(hour / 24);

		if (day > 0) {
			str += day + "天";
		}
		if (hour % 24 > 0) {
			str += (hour % 24) + "小时";
		}
		if (minute % 60 > 0) {
			str += (minute % 60) + "分";
		}

		if (showSecond) {
			str += this.pad(second % 60) + "秒";
		} else if (str == "" && second > 0) {
			str += "1分钟";
		}
		return str;
	}

	/**
	 * 获取当天23:59:59的毫秒
	 */
	public static getNowDayTime(): number {
		return new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime();
	}

	/**
	 * 获取当天剩余毫秒
	 * @param nowMillisecond 当前毫秒
	 */
	public static getDayTimeSurplus(nowMillisecond?: number): number {
		let nowM = nowMillisecond || new Date().getTime();
		return this.getNowDayTime() - nowM;
	}



	/**年月日时分秒 */
	public static YMDHMS(ms?: number): { year: number, month: number, day: number, hour: number, minute: number, second: number } {
		let date = ms ? new Date(ms) : new Date();
		let data = {
			year: date.getFullYear(),
			month: date.getMonth() + 1,
			day: date.getDate(),
			hour: date.getHours(),
			minute: date.getMinutes(),
			second: date.getSeconds()
		}
		return data;
	}

	/*
	* 数字字符串补0
	* @param {int} num 要处理的数字
	* @param {int} n 补足位数
	*/
	public static pad(num, n = 2) {
		let len = num.toString().length;
		while (len < n) {
			num = "0" + num;
			len++;
		}
		return num;
	}
}