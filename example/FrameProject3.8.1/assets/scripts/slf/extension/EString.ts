/**
 * 扩展字符串原型
 * @author slf
 */
interface String {
    /**
     * 字符串格式化
     * "abc{0}def{1}g".format("-","+") == "abc-wer+324";
     */
    format(...args): string;

    /**
     * 字符串转uint8Array
     */
    toUint8Array(): Uint8Array;

    /**
     * 字符串转数字 默认保留2位小数
     * @param decimals 小数位
     */
    toNumber(decimals?: number): number

    /**转字符串 */
    toStr(): string;

     /**
     * 获取字符串 字节长度，中文字符 2个字节  英文1个字节
     */
     byteLength(): number;
     /**
      * 根据字节长度截取字符串 超出采用...
      * 测试字符串  4 => 测试...
      * @param length 字节长度
      */
     byteSubstr(length: number): string
}

interface Uint8Array {
    /**uint8Array转字符串 */
    toStr(): string;
}


Uint8Array.prototype.toStr = function (): string {
    let array = this;
    if (!array) {
        return "";
    }
    var out, i, len, c;
    var char2, char3;
    out = "";
    len = array.length;
    i = 0;
    while (i < len) {
        c = array[i++];
        switch (c >> 4) {
            case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                // 0xxxxxxx
                out += String.fromCharCode(c);
                break;
            case 12: case 13:
                // 110x xxxx   10xx xxxx
                char2 = array[i++];
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = array[i++];
                char3 = array[i++];
                out += String.fromCharCode(((c & 0x0F) << 12) |
                    ((char2 & 0x3F) << 6) |
                    ((char3 & 0x3F) << 0));
                break;
        }
    }
    return out;
}


String.prototype.toStr = function (): string {
    return this;
}


String.prototype.toNumber = function (decimals: number = 2): number {
    let str = this.replace(/[^0-9.]/g, "").trim();
    if (decimals > 0 && str.indexOf(".") != -1) {
        let str1 = str.split(".");
        if (str1[1].length > decimals) {
            str1[1] = str1[1].substring(0, decimals)
            return Number(str1[0] + "." + str1[1]) || 0
        }
    }
    return Number(str) || 0;
}

String.prototype.format = function (...args): string {
    if (args.length === 0) return this;
    if (args.length == 1 && Array.isArray(args[0])) {
        args = args[0];
    }
    var str = this;
    for (var i = 0; i < args.length; i++) {
        str = str.replace(/\{[0-9]+\}/g, value => {
            return (value.substring(1, value.length - 1) == i) ? args[i] : value;
        });
    }
    return str;
}

String.prototype.toUint8Array = function (): Uint8Array {
    let _string = this;
    if (_string instanceof Uint8Array) {
        return _string;
    }
    // if (js.isNumber(_string)) {
    //     _string = `${_string}`;
    // }
    // if (!js.isString(_string)) {
    //     _string = '';
    // }
    let pos = 0;
    const len = _string.length;
    const out = [];
    let at = 0;  // output position
    let tlen = Math.max(32, len + (len >> 1) + 7);  // 1.5x size
    let target = new Uint8Array((tlen >> 3) << 3);  // ... but at 8 byte offset
    while (pos < len) {
        let value = _string.charCodeAt(pos++);
        if (value >= 0xd800 && value <= 0xdbff) {
            // high surrogate
            if (pos < len) {
                const extra = _string.charCodeAt(pos);
                if ((extra & 0xfc00) === 0xdc00) {
                    ++pos;
                    value = ((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000;
                }
            }
            if (value >= 0xd800 && value <= 0xdbff) {
                continue;  // drop lone surrogate
            }
        }
        // expand the buffer if we couldn't write 4 bytes
        if (at + 4 > target.length) {
            tlen += 8;  // minimum extra
            tlen *= (1.0 + (pos / _string.length) * 2);  // take 2x the remaining
            tlen = (tlen >> 3) << 3;  // 8 byte offset
            const update = new Uint8Array(tlen);
            update.set(target);
            target = update;
        }
        if ((value & 0xffffff80) === 0) {  // 1-byte
            target[at++] = value;  // ASCII
            continue;
        } else if ((value & 0xfffff800) === 0) {  // 2-byte
            target[at++] = ((value >> 6) & 0x1f) | 0xc0;
        } else if ((value & 0xffff0000) === 0) {  // 3-byte
            target[at++] = ((value >> 12) & 0x0f) | 0xe0;
            target[at++] = ((value >> 6) & 0x3f) | 0x80;
        } else if ((value & 0xffe00000) === 0) {  // 4-byte
            target[at++] = ((value >> 18) & 0x07) | 0xf0;
            target[at++] = ((value >> 12) & 0x3f) | 0x80;
            target[at++] = ((value >> 6) & 0x3f) | 0x80;
        } else {
            continue;
        }
        target[at++] = (value & 0x3f) | 0x80;
    }
    return target.subarray(0, at);
}

String.prototype.byteLength = function () {
    return this.replace(/[^\x00-\xff]/g, "**").length;
}

String.prototype.byteSubstr = function (length: number) {
    if (this.byteLength() <= length) {
        return this;
    }
    let str = '';
    let strLen = this.length;
    let bLen = 0;
    for (let i = 0; i < strLen; i++) {
        str += this.charAt(i);
        if (this.charCodeAt(i) > 255) {
            bLen += 2;
        } else {
            bLen += 1;
        }
        if (bLen == length) {
            break;
        }
        if (bLen > length) {
            str.substring(0, i - 1);
            break;
        }
    }
    return str + "...";
}
