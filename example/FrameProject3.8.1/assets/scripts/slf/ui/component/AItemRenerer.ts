import { _decorator } from "cc";
import AComponent from "./AComponent";

const { ccclass } = _decorator;
/**
 * 单项渲染基类
 * @author slf
 *  */
@ccclass
export default abstract class AItemRenderer<T> extends AComponent {
    /**调用列表 回调函数  回调作用域*/
    protected callback: Function;
    protected thisArg: any;

    private _data: T;//数据结构
    public get data(): T {
        return this._data;
    }

    public set data(v: T) {
        this._data = v;
        this.refreshData();
    }

    /**刷新数据 */
    public refreshData(): void {
        this.dataChanged();
    }

    protected destroyView(): void {
        this._data = null;
    }

    /**数据发生变化 子类重写*/
    protected abstract dataChanged(): void

    /**注册回调 */
    public registerCallback(cb: Function, cbT?: any): void {
        this.callback = cb;
        this.thisArg = cbT;
    }
    /**派发回调 */
    protected emitCallback() {
        this.callback && this.callback.call(this.thisArg, this._data);
    }
}
