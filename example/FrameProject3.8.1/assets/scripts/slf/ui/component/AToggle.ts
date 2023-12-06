import { Toggle, _decorator, Node } from "cc";

const { ccclass, property } = _decorator;
/**
 * toggle扩展
 * 新增组件未选中的时候，可以隐藏node
 * @author slf
 */
@ccclass
export default class AToggle extends Toggle {
    @property({ type: Node, tooltip: "未选中隐藏节点" })
    hideMark: Node = null;

    private callback: Function;
    private thisArg: any;
    private param: any;
    /**
     * 状态变化回调
     * @param callback 回调函数包含两个参数  是否选中，透传参数
     * @param thisArg 作用域
     * @param param 参数
     */
    public setCallback(callback: (checked: boolean, param?: any) => void, thisArg?: any, param?: any): void {
        this.callback = callback;
        this.thisArg = thisArg;
        this.param = param;
    }

    public playEffect(): void {
        super.playEffect();
        this.hideMark && (this.hideMark.active = !this._isChecked);
    }

    protected _set(value: boolean, emitEvent = true) {
        super._set(value, emitEvent);
        emitEvent && this.callback && this.callback.call(this.thisArg, this._isChecked, this.param);
    }

    onDestroy(): void {
        super.onDestroy();
        this.callback = null;
        this.thisArg = null;
        this.param = null;
    }
}


