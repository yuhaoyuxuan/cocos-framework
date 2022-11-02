/**字符串工具
 * @author slf
 */
export default class StringUtils {
	/**
	 * 检测是否有中文字符
	 * @param str 输入字符串
	 */
	public static isContainChinese(str) {
		let reg = /[\u4e00-\u9fa5]/g
		return reg.test(str)
	}
	/**
	 * 获取字符串的字节长度  如有中文字符改为N个字节
	 * @param str 输入字符串
	 * @param length 输入字符串中的单个中文占用的字节长度 默认一个中文占用两个字节
	 * */
	public static getStrLength(str: string, length: number = 2): number {
		let replaceStr = ""
		for (var i = 0; i < length; i++) {
			replaceStr += "*"
		}
		return str.replace(/[^\x00-\xff]/g, replaceStr).length;
	}

	/**
	 * 格式化字符串
	 * @param str "测试{0},测试{1}"
	 * @param arg 5,3
	 * @returns "测试5,测试3"
	 */
	public static format(str:string,...arg) : string{
		return str.replace(/\{(\d+)\}/g, function ($0, $1) {
			return arg[$1] !== void 0 ? arg[$1] : $0;
		});
	}


}