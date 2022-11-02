
//日志级别
export enum LogLevel {
	DEBUG,		//调试
	WARN,		//警告
	ERROR		//错误
}
/**
 * log打印 控制台输出
 * @author slf
 */
export class Logger {
	/**日志级别*/
	public static logLevel: number = LogLevel.DEBUG;
	/**调试*/
	public static log(...params): void {
		if (this.logLevel > LogLevel.DEBUG) { return };
		this.print(params, LogLevel.DEBUG);
	}
	/**警告*/
	public static warn(...params): void {
		if (this.logLevel > LogLevel.WARN) { return };
		this.print(params, LogLevel.WARN);
	}
	/**异常*/
	public static error(...params): void {
		if (this.logLevel > LogLevel.ERROR) { return };
		this.print(params, LogLevel.ERROR);
	}

	private static print(params, lv: LogLevel): void {
		var dateStr = "[" + new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-').replace(/\b\d\b/g, '0$&') + "]  ";
		var lvColors: string[] = ['#5180CE', '#ff9900', '#ff0000'];
		params[0] = dateStr + params[0];
		console.log("%c" + params, "color:" + lvColors[lv])
	}
}