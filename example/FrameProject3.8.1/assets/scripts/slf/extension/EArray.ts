/**
 * 扩展Array原型
 */
interface Array<T> {
    /**
     * 数组乱序
     * [1,2,3,4,5] 
     * 修改原数组内容改为 [2,1,4,3,5]
     *  */
    disorder(): void;
    /**
     * 数组内去重
     * [1,1,2,3,3] 
     * 修改原数组内容改为 [1,2,3]
     */
    unique(): void;
    /**
     * 两个数组之间去重
     * [0,1,2,3,4,5,6]
     * @param array [0,1,2,3,4]
     * 修改原数组内容改为 [5,6]
     */
    unique(array?: number[]): void;

    /**
     * 从一个整数数组中找出总和为value的子集 （总和<=value） 不会修改原数组
     * 数组 [100,200,300,400,500]
     * @param value 目标 1000
     * @returns [100, 200, 300, 400]
     */
    sum(value: number): number[];
    /**
     * 二分法查找值 返回目标索引 找不到返回-1
     * 基本思想：（分治） 数组一定是有序的
     * @param value 查找值 11
     * @returns [10，11，12] 返回索引 1
     *  */
    binary(value: number): number
    /**
     * 二分法查找属性 返回目标索引 找不到返回-1
     * 基本思想：（分治） 数组一定是有序的
     * @param key 属性名 
     * @param value 查找值 
     * @returns [{n:10},{n:20},{n:5}] n 10   返回索引 0
     */
    binaryProperty(key: any, value: any): number
    /**
     * 冒泡排序 时间复杂度O(n2) 会修改原数组
     * 基本思想：两个数比较大小，较大的数下沉，较小的数冒起来。
     */
    bubble(): void
    /**
     * 冒泡排序优化 时间复杂度O(n2) 会修改原数组
     * 设置标志位flag，如果发生了交换flag设置为true；如果没有交换就设置为false。
     * 这样当一轮比较结束后如果flag仍为false，即：这一轮没有发生交换，说明数据的顺序已经排好，没有必要继续进行下去。
     */
    bubbles(): void
    /**
     * 选择排序 时间复杂度O(n2) 会修改原数组
     * 基本思想：
     * 在长度为N的无序数组中，第一次遍历n-1个数，找到最小的数值与第一个元素交换；
     * 第二次遍历n-2个数，找到最小的数值与第二个元素交换；
     * 第n-1次遍历，找到最小的数值与第n-1个元素交换，排序完成。
     */
    select(): void
    /**
     * 插入排序 时间复杂度O(n2) 会修改原数组
     * 基本思想：
     * 在要排序的一组数中，假定前n-1个数已经排好序，现在将第n个数插到前面的有序数列中，
     * 使得这n个数也是排好顺序的。如此反复循环，直到全部排好顺序。
     */
    insert(): void
    /**
     * 希尔排序 时间复杂度O(n1.5)   会修改原数组
     * 基本思想：
     * 在要排序的一组数中，根据某一增量分为若干子序列，并对子序列分别进行插入排序。
     * 然后逐渐将增量减小,并重复上述过程。直至增量为1,此时数据序列基本有序,最后进行插入排序。
     * */
    shell(): void
    /**
     * 快速排序 时间复杂度O(N*logN) 不会修改原数组
     * 基本思想：（分治）
     * 先从数列中取出一个数作为key值；
     * 将比这个数小的数全部放在它的左边，大于或等于它的数全部放在它的右边；
     * 对左右两个小数列重复第二步，直至各区间只有1个数。
     * @returns number[]
     * */
    quick(list: number[]): number[]
}


Array.prototype.disorder = function (): void {
    this.sort(() => {
        return Math.random() * 2 - 1;
    })
}

Array.prototype.unique = function (array?: number[]): void {
    if (!array) {
        return this.filter((item, index, arr) => arr.indexOf(item) === index);
    }
    return this.filter(item => array.indexOf(item) == -1);
}


Array.prototype.sum = function (value: number): number[] {
    let stack: number[] = [];
    let index = 0, len = this.length - 1;
    let MaxLen = 100;
    this.sort((a, b) => {
        return a - b;
    });
    let minNum = this[0];
    if (len < 1 || minNum < 1) {
        return stack;
    }

    if (minNum > value) {
        return [0];
    }

    while (value >= minNum && MaxLen > 0) {
        MaxLen--;
        if (index > 0 && this[index] > value) {
            index--;
        }
        if (this[index] <= value) {
            stack.push(this[index]);
            value -= this[index];
            index++;
            if (index > len) {
                index = 0;
            }
        }
    }
    return stack;
}

Array.prototype.binary = function (value: number): number {
    // let str = JSON.stringify(this),time = new Date().getTime(); 
    let count = 0, len = this.length, low = 0, mid, high = len - 1, index = -1, num;

    while (low <= high) {
        count++;
        mid = (low + high) / 2 >> 0;
        num = this[mid];
        if (num == value) {
            // time = new Date().getTime() - time;
            // console.log("二分法查找:" + str + "------查找：" + value + "索引：" + mid + "  查找次数：" + count + "  耗时ms：" + time);
            return mid;
        }
        if (num > value) {
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return index;
}

Array.prototype.binaryProperty = function (key: string, value: number): number {
    var low: number = 0;
    var high: number = this.length - 1;
    var middle: number;
    while (low <= high) {
        middle = low + high >> 1;
        if (value == this[middle][key]) {
            return middle;
        }
        if (value > this[middle][key]) {
            low = middle + 1;
        }
        if (value < this[middle][key]) {
            high = middle - 1;
        }
    }
    return -1;
}



Array.prototype.bubble = function (): void {
    // let str = JSON.stringify(this),time = new Date().getTime();
    let num = 0, nums = 0, len = this.length;
    for (var i: number = 0; i < len - 1; i++) {
        for (var j: number = len - 1; j > i; j--) {
            num++;
            if (this[j - 1] > this[j]) {
                nums++;
                this.swap(this, j, j - 1);
            }
        }
    }
    // time = new Date().getTime() - time;
    // console.log("冒泡排序:" + str + "------" + JSON.stringify(this) + "  遍历次数：" + num + "  交换次数：" + nums + "  耗时ms：" + nums);
}

Array.prototype.bubbles = function (): void {
    // let str = JSON.stringify(list), time = new Date().getTime()
    let num = 0, nums = 0, len = this.length, flag;
    for (var i: number = 0; i < len - 1; i++) {
        flag = false;
        for (var j: number = len - 1; j > i; j--) {
            num++;
            if (this[j - 1] > this[j]) {
                flag = true;
                nums++;
                this.swap(this, j, j - 1);
            }
        }
        if (!flag) { break; }
    }
    // time = new Date().getTime() - time;
    // console.log("冒泡排序优化:" + str + "------" + JSON.stringify(this) + "  遍历次数：" + num + "  交换次数：" + nums + "  耗时ms：" + nums);
}

Array.prototype.select = function (): void {
    // let str = JSON.stringify(this), time = new Date().getTime();
    let num = 0, nums = 0, len = this.length, min;
    for (var i: number = 0; i < len - 1; i++) {
        min = i
        for (var j: number = i + 1; j < len; j++) {
            num++;
            if (this[min] > this[j]) {
                min = j
            }
        }
        if (min != i) {
            nums++;
            this.swap(this, min, i);
        }
    }
    // time = new Date().getTime() - time;
    // console.log("选择排序:" + str + "------" + JSON.stringify(this) + "  遍历次数：" + num + "  交换次数：" + nums + "  耗时ms：" + nums);
}

Array.prototype.insert = function (): void {
    // let str = JSON.stringify(this), time = new Date().getTime();
    let num = 0, nums = 0, len = this.length;
    for (var i: number = 0; i < len - 1; i++) {
        for (var j: number = i + 1; j > 0; j--) {
            num++;
            if (this[j - 1] > this[j]) {
                nums++;
                this.swap(this, j, j - 1)
            } else {
                break;
            }
        }
    }
    // time = new Date().getTime() - time;
    // console.log("插入排序:" + str + "------" + JSON.stringify(this) + "  遍历次数：" + num + "  交换次数：" + nums + "  耗时ms：" + nums);
}

Array.prototype.shell = function (): void {
    // let str = JSON.stringify(this), time = new Date().getTime();
    let num = 0, nums = 0, len = this.length, incre = len;
    while (true) {
        incre = incre / 2 >> 0;
        for (var k = 0; k < incre; k++) { //根据增量分为若干子序列
            for (var i: number = k + incre; i < len; i += incre) {
                for (var j: number = i; j > k; j -= incre) {
                    num++;
                    if (this[j - incre] > this[j]) {
                        nums++;
                        this.swap(this, j, j - incre)
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
    // time = new Date().getTime() - time;
    // console.log("希尔排序:" + str + "------" + JSON.stringify(this) + "  遍历次数：" + num + "  交换次数：" + nums + "  耗时ms：" + nums);
}

Array.prototype.quick = function (list): number[] {
    let len = list.length, left = [], right = [];
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

/**交换 */
function swap(arr, i, j): void {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}