import { Button } from "cc";
import { ICallback } from "./ICallback";
import { EventTouch } from "cc";
/**
 * 扩展cc.Button原型
 * 新增设置点击回调
 * @author slf
 */
declare module "cc" {
    interface Button {
        /**是否开启点击穿透 */
        __preventSwallow: boolean;
        /**开启穿透后延迟回调 单位秒 */
        __preventSwallowDelayCallback: number;
        /**
         * 设置点击回调
         * @param callback 回调函数
         * @param thisArg 回调目标
         * @param arg 回调参数
         */
        onClickCallback(callback: (...args) => void, thisArg?: any, ...arg): void
        /**
         * 设置点击穿透 
         * @param bool 是否开启穿透 默认false不开启穿透  true可穿透 
         * @param delayCallback 延迟回调 默认延迟一帧回调（秒）
         */
        setPreventSwallow(bool: boolean, delayCallback: number): void
    }
}


Button.prototype.onClickCallback = function (callback: (...args) => void, thisArg?: any, ...arg) {
    if (!this.__callbackData) {
        this.__callbackData = {};
    }
    let cd: ICallback = this.__callbackData;
    cd.callback = callback;
    cd.thisArg = thisArg;
    cd.arg = arg;
}

Button.prototype.setPreventSwallow = function (bool?: boolean, delayCallback: number = 0) {
    this.__preventSwallow = bool;
    this.__preventSwallowDelayCallback = delayCallback;

}

//重写按钮点击开始
Button.prototype['_onTouchBeganClone'] = Button.prototype['_onTouchBegan'];
Button.prototype['_onTouchBegan'] = function (event?: EventTouch) {
    event.preventSwallow = !!this.__preventSwallow;
    this["_onTouchBeganClone"](event);
}

//重写按钮点击结束事件
Button.prototype['_onTouchEndedClone'] = Button.prototype['_onTouchEnded'];
Button.prototype['_onTouchEnded'] = function (event?: EventTouch) {
    if (!this._interactable || !this.enabledInHierarchy) {
        return;
    }
    event.preventSwallow = !!this.__preventSwallow;
    this["_onTouchEndedClone"](event);

    let cd: ICallback = this.__callbackData;
    if (!cd) {
        return;
    }

    //设置穿透后延迟回调
    if (this.__preventSwallow && this.__preventSwallowDelayCallback >= 0) {
        //todo 如果延迟过程中隐藏节点，底层会暂停计时器的更新，显示后继续更新定时器
        this.scheduleOnce(() => {
            cd.callback.apply(cd.thisArg, cd.arg);
        }, this.delayCallback)
        return;
    }

    cd.callback.apply(cd.thisArg, cd.arg);
}

