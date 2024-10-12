import { Toggle } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { ICallback } from './ICallback';
import { EDITOR, EDITOR_NOT_IN_PREVIEW } from 'cc/env';
const { ccclass, property } = _decorator;
/**
 * 扩展cc.Toggle原型
 * 新增设置点击(选中)回调
 * @author slf
 */
declare module "cc" {
    interface Toggle {
        /**
         * 设置点击(选中)回调
         * @param callback 回调函数
         * @param thisArg 回调目标
         * @param args 回调参数
         */
        setClickCallback(callback: (checked: boolean, ...args) => void, thisArg?: any, ...args): void
    }
}

//不在编辑器 或 在编辑器预览运行
if (!EDITOR || !EDITOR_NOT_IN_PREVIEW) {
    Toggle.prototype.setClickCallback = function (callback: (checked: boolean, ...args) => void, thisArg?: any, ...args) {
        if (!this.__callbackData__) {
            this.__callbackData__ = {};
        }
        let cd: ICallback = this.__callbackData__;
        cd.callback = callback;
        cd.thisArg = thisArg;
        cd.args = args;
    }

    Toggle.prototype['_setClone'] = Toggle.prototype['_set'];
    Toggle.prototype['_set'] = function (value: boolean, emitEvent = true): void {
        this["_setClone"](value, emitEvent);

        let cd: ICallback = this.__callbackData__;
        if (!cd || !emitEvent) {
            return;
        }
        cd.callback.call(cd.thisArg, value, ...cd.args);
    }
}
