import { Toggle } from "cc";
import { ICallback } from "./ICallback";

/**
 * 扩展cc.Toggle原型
 * 新增状态发生变化回调
 * @author slf
 */
declare module "cc" {
    interface Toggle {
        /**
         * 设置状态发生变化回调
         * @param callback 回调函数 checked是否被选中true、false
         * @param thisArg 回调目标
         * @param arg 回调参数
         */
        onToggleCheckCallback(callback: (checked: boolean, ...args) => void, thisArg?: any, ...arg): void
    }
}

Toggle.prototype.onToggleCheckCallback = function (callback: (...args) => void, thisArg?: any, ...arg) {
    if (!this.__callbackData_toggle) {
        this.__callbackData_toggle = {};
    }
    let cd: ICallback = this.__callbackData_toggle;
    cd.callback = callback;
    cd.thisArg = this.thisArg;
    cd.arg = arg || [];
}

/**重写Toggle状态发生变化事件 */
Toggle.prototype['_setClone'] = Toggle.prototype['_set'];
Toggle.prototype['_set'] = function (value: boolean, emitEvent = true) {
    this["_setClone"](value, emitEvent);
    let cd: ICallback = this.__callbackData_toggle;
    if (emitEvent && !!cd) {
        cd.callback.apply(cd.thisArg, [value].concat(cd.arg));
    }
}



