import AComponent from "./AComponent";
const { ccclass, property } = cc._decorator;
/**
 * 单项渲染基类
 * @author slf
 *  */
@ccclass
export default class AItemRenderer<T> extends AComponent {
    @property({displayName:"是否添加点击事件"})
    isClick:boolean = false;

    private _data: T;//数据结构
    public get data(): T {
        return this._data;
    }
    public set data(v: T) {
        this._data = v;
        this.dataChanged();
    }

    /**数据发生变化 子类重写*/
    protected dataChanged(): void { }

    /**刷新数据 */
    public refreshData(): void {
        this.dataChanged();
    }

    /**销毁 */
    public onDestroy(): void {
        super.onDestroy();
        this._data = null;   
    }

    /**重写预制体被点击回调 */
    protected onClickCallback(e: cc.Event): void {
        this.callback && this.callback.call(this.cbThis, this.data);
    }
}
