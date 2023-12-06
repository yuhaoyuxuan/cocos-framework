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
}