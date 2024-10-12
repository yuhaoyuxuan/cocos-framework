import { Button, Node } from "cc";
import { ICallback } from "./ICallback";
import { EventTouch } from "cc";
import { game } from "cc";
import { Label } from "cc";
import { Sprite } from "cc";
import { Color } from "cc";
import { EDITOR, EDITOR_NOT_IN_PREVIEW } from "cc/env";
/**
 * 扩展cc.Button原型
 * @author slf
 */
declare module "cc" {
    interface Button {
        /**是否开启点击穿透 */
        __preventSwallow: boolean;
        /**开启穿透后延迟回调 单位秒 */
        __preventSwallowDelayCallback: number;
        /**是否开启点击间隔 */
        __clickInterval: boolean;
        /**间隔值 */
        __clickIntervalValue: boolean;
        /**上次点击的值 */
        __clickIntervalOld: boolean;
        /**
         * 设置点击回调
         * @param callback 回调函数
         * @param thisArg 回调目标
         * @param args 回调参数
         */
        setClickCallback(callback: (...args) => void, thisArg?: any, ...args): void
        /**
         * 设置点击穿透 
         * @param bool 是否开启穿透 默认false不开启穿透  true可穿透 
         * @param delayCallback 延迟回调 默认延迟一帧回调（秒）
         */
        setPreventSwallow(bool: boolean, delayCallback: number): void
        /**
         * 设置点击间隔 （防止用户连续点击）
         * @param interval 单位秒 默认1秒
         */
        setClickInterval(interval?: number): void
        /**
         * true 按钮无法点击变灰
         * 灰度模式渲染(所有子项都会修改)
         * 图片使用的灰度模式、文本采用修改alpha的方式
         * todo (白色图的灰度模式不生效)
        */
        grayscale: boolean;
    }

    /**播放点击音效 */
    export let clickPlaySound: Function;
}


export const EButtonObj = {
    /**播放点击音效方法 */
    clickPlaySoundFun: Function
}


//不在编辑器 或 在编辑器预览运行
if (!EDITOR || !EDITOR_NOT_IN_PREVIEW) {
    Button.prototype.setClickCallback = function (callback: (...args) => void, thisArg?: any, ...args) {
        if (!this.__callbackData) {
            this.__callbackData = {};
        }
        let cd: ICallback = this.__callbackData;
        cd.callback = callback;
        cd.thisArg = thisArg;
        cd.args = args;
    }

    Button.prototype.setPreventSwallow = function (bool?: boolean, delayCallback: number = 0) {
        this.__preventSwallow = bool;
        this.__preventSwallowDelayCallback = delayCallback;

    }
    Button.prototype.setClickInterval = function (interval: number = 1) {
        this.__clickInterval = true;
        this.__clickIntervalValue = interval * 1000;
        this.__clickIntervalOld = 0;
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

        EButtonObj.clickPlaySoundFun?.call(null);
        event.preventSwallow = !!this.__preventSwallow;
        this["_onTouchEndedClone"](event);

        let cd: ICallback = this.__callbackData;
        if (!cd) {
            return;
        }

        if (this.__clickInterval) {
            if (this.__clickIntervalOld > game.totalTime) {
                return;
            }
            this.__clickIntervalOld = game.totalTime + this.__clickIntervalValue;
        }

        //设置穿透后延迟回调
        if (this.__preventSwallow && this.__preventSwallowDelayCallback >= 0) {
            //todo 如果延迟过程中隐藏节点，底层会暂停计时器的更新，显示后继续更新定时器
            this.scheduleOnce(() => {
                cd.callback.call(cd.thisArg, ...cd.args, event);
            }, this.delayCallback);
            return;
        }

        cd.callback.call(cd.thisArg, ...cd.args, event);
    }

    Object.defineProperty(Button.prototype, "grayscale", {
        get() {
            return !this._interactable;
        },
        set(v) {
            if (this._interactable == !v) {
                return;
            }

            this._interactable = !v;
            setAlpha(this.node, v)

        },
        configurable: true
    })

    function setAlpha(node: Node, gray?: boolean): void {
        node.children.forEach(node => {
            setAlpha(node, gray);
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

