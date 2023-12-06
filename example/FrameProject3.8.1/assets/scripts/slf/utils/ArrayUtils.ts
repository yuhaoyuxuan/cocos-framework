/**数组工具
 * @author slf
 */
export default class ArrayUtils {

	/**
	 * 数组乱序
	 * @param array [1,2,3,4,5]
	 * @returns	[5,3,2,4,1]
	 *  */
	public static arrDisorder(array: any[]) {
		array.sort(() => {
			return Math.random() * 2 - 1;
		})
		return array
	}

	/**
	 * 数组内去重
	 * @param array [1,1,2,3,3]
	 * @returns [1,2,3]
	 */
	public static arrUnique(array: any[]) {
		var res = array.filter(function (item, index, array) {
			return array.indexOf(item) === index;
		})
		return res;
	}

	/**
	 * 两个数组之间去重 
	 * @param arr1 [1,2,3]
	 * @param arr2 [1,2,3,4]
	 * @returns [1,2,3,4]
	 */
	public static arrTwoUnique(arr1: any[], arr2: any[]) {
		var tempArr = arr1.filter((item) => {
			return arr2.indexOf(item) == -1
		}, this);
		return tempArr;
	}

	/**
	 * 从一个整数数组中找出总和为target的子集 （总和<=target）
	 * @param list 整数数组 [100,200,300,400,500]
	 * @param target 目标 1000
	 * @returns [100, 200, 300, 400]
	 */
	public static getListSumTarget(list: number[], target: number) {
		let stack: number[] = [];
		let index = 0, len = list.length - 1;
		let MaxLen = 100;
		list.sort((a, b) => {
			return a - b;
		});
		let minNum = list[0];
		if (len < 1 || minNum < 1) {
			return stack;
		}

		if (minNum > target) {
			return [0];
		}

		while (target >= minNum && MaxLen > 0) {
			MaxLen--;
			if (index > 0 && list[index] > target) {
				index--;
			}
			if (list[index] <= target) {
				stack.push(list[index]);
				target -= list[index];
				index++;
				if (index > len) {
					index = 0;
				}
			}
		}
		return stack;
	}

	/**
	 * 二分法查找值
	 * @param array 查找数组 
	 * @param value 查找值 
	 * @returns [10，11，12]  11 返回索引 1
	 *  */
	public static binary(list, val): number {
		let str = JSON.stringify(list), time = new Date().getTime(), count = 0, len = list.length, low = 0, mid, high = len - 1, index = -1, num;
		while (low <= high) {
			count++;
			mid = (low + high) / 2 >> 0;
			num = list[mid];
			if (num == val) {
				time = new Date().getTime() - time;
				console.log("二分法查找:" + str + "------查找：" + val + "索引：" + mid + "  查找次数：" + count + "  耗时ms：" + time);
				return mid;
			}
			if (num > val) {
				high = mid - 1;
			} else {
				low = mid + 1;
			}
		}
		return index;
	}

	/**
	 * 二分法查找属性 返回目标索引
	 * @param array 查找数组 
	 * @param value 查找值 
	 * @param key 属性名 
	 * @returns [{n:10},{n:20},{n:5}]  20  n 返回索引 1
	 */
	public static binaryProperty(array: Array<any>, value: any, key: any): number {
		var arr: Array<any> = array;
		var low: number = 0;
		var high: number = arr.length - 1;
		var middle: number;
		while (low <= high) {
			middle = low + high >> 1;
			if (value == arr[middle][key]) {
				return middle;
			}
			if (value > arr[middle][key]) {
				low = middle + 1;
			}
			if (value < arr[middle][key]) {
				high = middle - 1;
			}
		}
		return -1;
	}

	private static swap(arr, i, j): void {
		let temp = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;
	}

	/**
	 * 冒泡 时间复杂度O(n2)
	 * 基本思想：两个数比较大小，较大的数下沉，较小的数冒起来。
	 */
	public static bubble(list: number[]): any {
		let str = JSON.stringify(list), time = new Date().getTime(), num = 0, nums = 0, len = list.length;
		for (var i: number = 0; i < len - 1; i++) {
			for (var j: number = len - 1; j > i; j--) {
				num++;
				if (list[j - 1] > list[j]) {
					nums++;
					this.swap(list, j, j - 1);
				}
			}
		}
		time = new Date().getTime() - time;
		console.log("冒泡排序:" + str + "------" + JSON.stringify(list) + "  遍历次数：" + num + "  交换次数：" + nums + "  耗时ms：" + nums);
		this.bubble1(JSON.parse(str));
		return list;
	}

	/**
	 * 冒泡优化 时间复杂度O(n2) 
	 * 	设置标志位flag，如果发生了交换flag设置为true；如果没有交换就设置为false。
	 *	这样当一轮比较结束后如果flag仍为false，即：这一轮没有发生交换，说明数据的顺序已经排好，没有必要继续进行下去。
	 */
	public static bubble1(list: number[]): any {
		let str = JSON.stringify(list), time = new Date().getTime(), num = 0, nums = 0, len = list.length, flag;
		for (var i: number = 0; i < len - 1; i++) {
			flag = false;
			for (var j: number = len - 1; j > i; j--) {
				num++;
				if (list[j - 1] > list[j]) {
					flag = true;
					nums++;
					this.swap(list, j, j - 1);
				}
			}
			if (!flag) { break; }
		}
		time = new Date().getTime() - time;
		console.log("冒泡排序优化:" + str + "------" + JSON.stringify(list) + "  遍历次数：" + num + "  交换次数：" + nums + "  耗时ms：" + nums);
		return list;
	}

	/**
	 * 选择 时间复杂度O(n2)
	 * 基本思想：
	 *	在长度为N的无序数组中，第一次遍历n-1个数，找到最小的数值与第一个元素交换；
	 *	第二次遍历n-2个数，找到最小的数值与第二个元素交换；
	 *	第n-1次遍历，找到最小的数值与第n-1个元素交换，排序完成。
	 */
	public static select(list: number[]): any {
		let str = JSON.stringify(list), time = new Date().getTime(), num = 0, nums = 0, len = list.length, min;
		for (var i: number = 0; i < len - 1; i++) {
			min = i
			for (var j: number = i + 1; j < len; j++) {
				num++;
				if (list[min] > list[j]) {
					min = j
				}
			}
			if (min != i) {
				nums++;
				this.swap(list, min, i);
			}
		}
		time = new Date().getTime() - time;
		console.log("选择排序:" + str + "------" + JSON.stringify(list) + "  遍历次数：" + num + "  交换次数：" + nums + "  耗时ms：" + nums);
		return list;
	}

	/**
	 * 插入 时间复杂度O(n2)
	 * 基本思想：
	 *	在要排序的一组数中，假定前n-1个数已经排好序，现在将第n个数插到前面的有序数列中，
	 *	使得这n个数也是排好顺序的。如此反复循环，直到全部排好顺序。
	 */
	public static insert(list: number[]): any {
		let str = JSON.stringify(list), time = new Date().getTime(), num = 0, nums = 0, len = list.length;
		for (var i: number = 0; i < len - 1; i++) {
			for (var j: number = i + 1; j > 0; j--) {
				num++;
				if (list[j - 1] > list[j]) {
					nums++;
					this.swap(list, j, j - 1)
				} else {
					break;
				}
			}
		}
		time = new Date().getTime() - time;
		console.log("插入排序:" + str + "------" + JSON.stringify(list) + "  遍历次数：" + num + "  交换次数：" + nums + "  耗时ms：" + nums);
		return list;
	}

	/**
	 * 希尔 时间复杂度O(n1.5)
	 * 基本思想：
	 * 在要排序的一组数中，根据某一增量分为若干子序列，并对子序列分别进行插入排序。
	 * 然后逐渐将增量减小,并重复上述过程。直至增量为1,此时数据序列基本有序,最后进行插入排序。
	 * */
	public static shell(list: number[]): any {
		let str = JSON.stringify(list), time = new Date().getTime(), num = 0, nums = 0, len = list.length, incre = len;
		while (true) {
			incre = incre / 2 >> 0;
			for (var k = 0; k < incre; k++) { //根据增量分为若干子序列
				for (var i: number = k + incre; i < len; i += incre) {
					for (var j: number = i; j > k; j -= incre) {
						num++;
						if (list[j - incre] > list[j]) {
							nums++;
							this.swap(list, j, j - incre)
						} else {
							break;
						}
					}
				}
			}
			if (incre == 1) {
				break;
			}
		}

		time = new Date().getTime() - time;
		console.log("希尔排序:" + str + "------" + JSON.stringify(list) + "  遍历次数：" + num + "  交换次数：" + nums + "  耗时ms：" + nums);
		return list;
	}

	/**
	 * 快速 时间复杂度O(N*logN)
	 *	基本思想：（分治）
	 *	先从数列中取出一个数作为key值；
	 *	将比这个数小的数全部放在它的左边，大于或等于它的数全部放在它的右边；
	 *	对左右两个小数列重复第二步，直至各区间只有1个数。
	 * */
	public static quick(list: number[]): any[] {
		let str = JSON.stringify(list), time = new Date().getTime(), num = 0, nums = 0, len = list.length, left = [], right = [];
		if (len < 2) {
			return list;
		}
		let key = list.splice(0, 1)[0];
		list.forEach(val => {
			if (val <= key) {
				left.push(val);
			} else {
				right.push(val);
			}
		}, this)
		return this.quick(left).concat(key).concat(this.quick(right));
	}
}