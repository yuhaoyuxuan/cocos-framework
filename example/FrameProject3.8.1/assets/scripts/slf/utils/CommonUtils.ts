import { Sprite } from "cc";
import { Color } from "cc";
import { Label, Node } from "cc";

/**
 * 通用工具
 * @author slf
 * 
 * getDeviceInfo	获取设备信息 操作系统、浏览器类型
 * getAverageValue	获取平均值
 * clone			克隆对象
 * copyProperty		复制属性
 * uuid				生成uuid
 * angle			返回p1和p2之间的角度
 */
export default class CommonUtils {
	/**
	 * 获取设备信息 操作系统、浏览器类型
	 * @returns {osName:string,browserType:string}
	 */
	public static getDeviceInfo(): { osName: string, browserType: string } {
		var nav = window.navigator;
		var ua = nav.userAgent.toLowerCase();
		var isAndroid = false, iOS = false, osVersion = '', osMainVersion = 0;
		var uaResult = /android\s*(\d+(?:\.\d+)*)/i.exec(ua) || /android\s*(\d+(?:\.\d+)*)/i.exec(nav.platform);
		if (uaResult) {
			isAndroid = true;
			osVersion = uaResult[1] || '';
			osMainVersion = parseInt(osVersion) || 0;
		}
		uaResult = /(iPad|iPhone|iPod).*OS ((\d+_?){2,3})/i.exec(ua);
		if (uaResult) {
			iOS = true;
			osVersion = uaResult[2] || '';
			osMainVersion = parseInt(osVersion) || 0;
		}
		else if (/(iPhone|iPad|iPod)/.exec(nav.platform) || (nav.platform === 'MacIntel' && nav.maxTouchPoints && nav.maxTouchPoints > 1)) {
			iOS = true;
			osVersion = '';
			osMainVersion = 0;
		}

		var osName = "unknown";
		if (nav.appVersion.indexOf("Win") !== -1) osName = "Windows";
		else if (iOS) osName = "iOS";
		else if (nav.appVersion.indexOf("Mac") !== -1) osName = "OS X";
		else if (nav.appVersion.indexOf("X11") !== -1 && nav.appVersion.indexOf("Linux") === -1) osName = "Unix";
		else if (isAndroid) osName = "Android";
		else if (nav.appVersion.indexOf("Linux") !== -1 || ua.indexOf("ubuntu") !== -1) osName = "Linux";


		var typeReg1 = /mqqbrowser|micromessenger|qqbrowser|sogou|qzone|liebao|maxthon|ucbs|360 aphone|360browser|baiduboxapp|baidubrowser|maxthon|mxbrowser|miuibrowser/i;
		var typeReg2 = /qq|ucbrowser|ubrowser|edge/i;
		var typeReg3 = /chrome|safari|firefox|trident|opera|opr\/|oupeng/i;
		var browserTypes = typeReg1.exec(ua) || typeReg2.exec(ua) || typeReg3.exec(ua);

		var browserType = browserTypes ? browserTypes[0].toLowerCase() : "unknown";
		if (browserType === "safari" && isAndroid)
			browserType = "androidbrowser";
		else if (browserType === "qq" && ua.match(/android.*applewebkit/i))
			browserType = "androidbrowser";
		let typeMap = {
			'micromessenger': "wechat",
			'trident': "ie",
			'edge': "edge",
			'360 aphone': "360browser",
			'mxbrowser': "maxthon",
			'opr/': "opera",
			'ubrowser': "ucbs"
		};
		browserType = typeMap[browserType] || browserType;
		return { osName: osName, browserType: browserType }
	}

	/**
	 * 获得平均值    
	 * @param	starts   开始值        1
	 * @param	end		 结束值        100
	 * @param	start1   开始得到值     200
	 * @param	end1	 结束得到值     300
	 * @param	values   当前值        1 = 200；100=300；
	*/
	public static getAverageValue(starts: number, end: number, start1: number, end1: number, values: number): number {
		var d: number;
		d = end - starts;
		var d1: number;
		d1 = end1 - start1;
		var rate: number;
		rate = d1 / d;
		let v = start1 + (values - starts) * rate
		return v;
	}

	/**
	 * 深度克隆对象 返回一个新对象
	 * @param obj 对象
	 *  */
	public static clone<T>(obj: T): T {
		let result;
		// 如果当前需要深拷贝的是一个对象的话
		if (typeof obj === 'object') {
			// 如果是一个数组的话
			if (Array.isArray(obj)) {
				result = []; // 将result赋值为一个数组，并且执行遍历
				for (let i in obj) {
					// 递归克隆数组中的每一项
					result.push(this.clone(obj[i]))
				}
				// 判断如果当前的值是null的话；直接赋值为null
			} else if (obj === null) {
				result = null;
				// 判断如果当前的值是一个RegExp对象的话，直接赋值    
			} else if (obj.constructor === RegExp) {
				result = obj;
			} else {
				// 否则是普通对象，直接for in循环，递归赋值对象的所有值
				result = {};
				for (let i in obj) {
					result[i] = this.clone(obj[i]);
				}
			}
			// 如果不是对象的话，就是基本数据类型，那么直接赋值
		} else {
			result = obj;
		}
		return result;
	}

	/**
	 * 复制属性 target[param] = nTarget[param]
	 * 如果未设置 param 
	 * @param target 	需要设置新属性的对象
	 * @param nTarget 	属性的对象
	 * @param param     参数 ['x','y']
	 */
	public static copyProperty(target: any, nTarget: any, param?: string[]): void {
		if (!target || !nTarget) {
			console.warn(target + "复制属性无效对象" + nTarget);
			return;
		}
		if (param) {
			param.forEach(pro => {
				target[pro] = nTarget[pro]
			}, this);
		} else {
			for (var pro in nTarget) {
				target[pro] = nTarget[pro]
			}
		}
	}

	/**
	 * 生成uuid
	 * @param len 长度
	 *  */
	public static uuid(len?: number): string {
		var r: number;
		var i: string[] = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
		var n: number = i.length;
		var a: string[] = [];
		if (len) {
			for (r = 0; len > r; r++) {
				a[r] = i[0 | Math.random() * n]
			}
		} else {
			var s;
			a[8] = a[13] = a[18] = a[23] = "-";
			a[14] = "4";
			for (r = 0; 36 > r; r++) {
				a[r] || (s = 0 | 16 * Math.random(), a[r] = i[19 == r ? 3 & s | 8 : s])
			}
		}
		return a.join("")
	}

	/**
	* 返回 pt1 和 pt2 之间的 角度。
	* @param pt1   当前坐标
	* @param pt2   目标坐标
	* @param offsetA   角度偏移 默认0
	*/
	public static angle(pt1, pt2, offsetA: number = 0) {
		let angle = Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x) * 180 / Math.PI + offsetA;
		return angle;
	}


	/**
	 * 一键复制 
	 * @param str 需要复制的文本
	 */
	public static copyStr(str): boolean {
		try {
			var oInput = document.createElement('input');
			oInput.value = str;
			document.body.appendChild(oInput);
			oInput.select();
			document.execCommand("Copy");
			document.body.removeChild(oInput);
			console.log("复制成功");
			return true;
		} catch (e) {
			console.log("复制失败");
			return false;
		}
	}

	/**刷新浏览器 */
	public static refreshBrowser(): void {
		window.location.reload();
	}


	/**解析浏览器参数 */
	public static parseBrowserArgs(): any {
		let param = window.location.search;
		let paramObj = {};
		if (param) {
			param = param.replace("?", "");
			let strArr = param.split("&");
			let parArr;
			strArr.forEach(str => {
				parArr = str.split("=");
				paramObj[parArr[0]] = parArr[1]
			}, this);
		}
		return paramObj
	}

	/**
	 * 设置灰色滤镜
	 * @param node node节点 子项变灰 如果是文本修改alpha值
	 * @param gray true变灰 
	 */
	public static setAlpha(node: Node, gray: boolean = true): void {
		node.children.forEach(node => {
			CommonUtils.setAlpha(node, gray);
		});
		let target: any = node.getComponent(Label);
		if (target) {
			if (gray) {
				target.___oldColor__ = target.color.clone();
			}
			let color: Color = target.color;
			if (gray) {
				color.a = color.a * 0.6;
			} else {
				color = target.___oldColor__;
			}
			target.color = color;
		} else {
			target = node.getComponent(Sprite);
			if (target) {
				target.grayscale = gray;
			}
		}
	}
}