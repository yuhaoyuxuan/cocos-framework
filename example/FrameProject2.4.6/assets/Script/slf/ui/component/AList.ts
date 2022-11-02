import AComponent from "./AComponent";
import AItemRenderer from "./AItemRenerer";
const { ccclass, property } = cc._decorator;
/**
 * list类
 * @author slf
 *  */
@ccclass
export default class AList extends AComponent {
    @property({ type: cc.Prefab, serializable: true, displayName: "渲染预制体" })
    itemRenderer:  cc.Prefab = null;

    protected dataList: any[];        //列表数据
    private idx: number = 0;
    public destroyView(): void {
        this.dataList = null;
        this.itemRenderer && this.itemRenderer.destroy();
        this.itemRenderer = null;
    }
    /**
     * 刷新数据
     * @param data 数据源 单项|队列
     */
    public refreshData(data: any | any[]): void {
        if (Array.isArray(data)) {
            this.dataList = data;
        } else {
            this.dataList = [data];
        }
        this.idx = 0;
        this.refreshView();
    }

    /**更新列表显示 */
    public updateListView(): void {
        let len = this.node.children.length;
        let data: any, child: cc.Node, itemRender: AItemRenderer<any>;
        for (var i = 0; i < len; i++) {
            data = this.dataList[i];
            child = this.node.children[i];
            child.getComponent(AItemRenderer).refreshData();
        }
    }
    /**刷新显示 */
    protected refreshView(): void {
        this.unscheduleAllCallbacks();
        let child, len = this.node.children.length
        for (var i = this.dataList.length; i < len; i++) {
            child = this.node.children[i];
            child && child.destroy();
        }


        //遍历
        len = Math.max(this.node.children.length, this.dataList.length);
        for (var i = 0; i < len; i++) {
            this.initItem(i);
        }

        //分帧处理
        this.executePreFrame(this.getItemGenerator(), 8);
    }

    /**
    * 分帧执行 Generator 逻辑
    * @param generator 生成器
    * @param duration 持续时间（ms）
    *          每次执行 Generator 的操作时，最长可持续执行时长。
    *          假设值为8ms，那么表示1帧（帧频60帧 一帧=16ms）下，分出8ms时间给此逻辑执行
    * @param startTime 开始时间戳 默认当前时间戳
    */
    private executePreFrame(generator: Generator, duration = 8, startTime?: number) {
        // 执行之前，先记录开始时间戳
        startTime = startTime || new Date().getTime();
        //执行一次
        let iterator = generator.next();
        // 判断是否已经执行完所有 Generator 的小代码段
        if (iterator == null || iterator.done) {
            return;
        }
        // 每执行完一段小代码段，都检查一下是否已经超过我们分配给本帧，这些小代码端的最大可执行时间
        let offsetMs = new Date().getTime() - startTime
        // 如果超过了，那么本帧就不在执行，让下一帧再执行
        if (offsetMs > duration) {
            this.scheduleOnce(this.executePreFrame.bind(this, generator, duration));
        } else {
            this.executePreFrame(generator, duration, startTime);
        }
    }

    /**实现分帧加载  itemGenerator*/
    private *getItemGenerator() {
        let len = Math.max(this.node.children.length, this.dataList.length);
        for (var i = 0; i < len; i++) {
            yield this.initItem(i);
        }
    }

    /**初始化单项 */
    private initItem(index: number): void {
        let data: any, child: cc.Node, itemRender: AItemRenderer<any>;
        data = this.dataList[index];
        child = this.node.children[index];
        if (!data) {
            child && child.destroy();
            return;
        }
        if (!child) {
            child = cc.instantiate(this.itemRenderer);
            this.node.addChild(child);
        }
        itemRender = child.getComponent(AItemRenderer);
        if (itemRender) {
            itemRender.data = data;
            if(itemRender.isClick){
                itemRender.setTouchCallback(this.onItemTap, this, data);
            }
        } else {
            this.idx++;
            if (this.idx < 10) {
                this.scheduleOnce(this.initItem.bind(this, index));
            }
        }
    }

    /**
     * 设置列表 子项点击回调
     * @param cb 回调
     * @param cbT 作用域
     */
    public setTouchItemCallback(cb: Function, cbT: any): void {
        this.callback = cb;
        this.cbThis = cbT;
    }

    /**选中数据 */
    protected onItemTap(data: any): void {
        this.callback && this.callback.call(this.cbThis, data);
    }
}
