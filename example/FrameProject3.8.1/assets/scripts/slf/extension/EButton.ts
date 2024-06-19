import { EventTouch } from 'cc';
import { Button } from 'cc';
import { _decorator } from 'cc';
import { ICallback } from './ICallback';
/**
 * 扩展cc.Button原型
 * 新增设置点击回调
 * @author slf
 */
declare module "cc" {
    interface Button {
        /**
         * 设置点击回调
         * @param callback 回调函数 
         * @param thisArg 回调目标
         * @param arg 回调参数
         */
        onClickCallback(callback: (...args) => void, thisArg?: any, ...arg): void
    }
}

Button.prototype.onClickCallback = function (callback: (...args) => void, thisArg?: any, ...arg) {
    if (!this.__callbackData) {
        this.__callbackData = {};
    }
    let cd: ICallback = this.__callbackData;
    cd.callback = callback;
    cd.thisArg = this.thisArg;
    cd.arg = arg;
}

/**重写按钮点击结束事件 */
Button.prototype['_onTouchEndedClone'] = Button.prototype['_onTouchEnded'];
Button.prototype['_onTouchEnded'] = function (event?: EventTouch) {
    if (!this._interactable || !this.enabledInHierarchy) {
        return;
    }

    let cd: ICallback = this.__callbackData;
    if (!!cd) {
        cd.callback.apply(cd.thisArg, cd.arg);
    }

    this["_onTouchEndedClone"](event);
}

