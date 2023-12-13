import { _decorator, Component, Node, Slider, Sprite } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 扩展Slider
 * @author slf
 */

@ccclass('ASlider')
export class ASlider extends Slider {
    @property({ type: Sprite, tooltip: "显示进度的线 图片设置为FILLED" })
    progressLine: Sprite = null;
    private callback: Function;
    private thisArg: any;
    private param: any;

    protected _updateHandlePosition() {
        super._updateHandlePosition();

        this.callback?.call(this.thisArg, this.progress, this.param);
        if (!this.progressLine) {
            return;
        }
        this.progressLine.fillRange = this.progress;
    }

    /**
     * 进度变化回调
     * @param callback 回调函数包含两个参数  进度，透传参数
     * @param thisArg 作用域
     * @param param 参数
     */
    public setCallback(callback: (progress: number, param?: any) => void, thisArg: any, param?: any): void {
        this.callback = callback;
        this.thisArg = thisArg;
        this.param = param;
    }


    protected onDestroy(): void {
        this.callback = null;
        this.thisArg = null;
        this.param = null;
    }
}