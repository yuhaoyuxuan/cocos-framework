import { Button, EventTouch, _decorator } from "cc";

/**
 * 按钮扩展
 * @author slf
 */
const { ccclass, property } = _decorator;
@ccclass('AButton')
export class AButton extends Button {
    /**回调函数 */
    private callback: Function;
    /**作用域 */
    private thisArg: any;
    /**透传参数 */
    private param: any;
    /**
     * 设置点击回调
     * @param callback 回调函数
     * @param thisArg 回调函数目标作用域
     * @param param 参数
     */
    public setClickCallback(callback: Function, thisArg: any, param?: any) {
        this.callback = callback;
        this.thisArg = thisArg;
        this.param = param;
    }

    protected _onTouchEnded(event?: EventTouch) {
        if (!this._interactable || !this.enabledInHierarchy) {
            return;
        }
        super._onTouchEnded(event);
        this.callback?.call(this.thisArg, this.param);
    }

    onDestroy(): void {
        super.onDestroy();
        this.callback = null;
        this.thisArg = null;
        this.param = null;
    }
}
