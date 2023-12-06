import { Layout, Prefab, ScrollView, UITransform, Vec2, Vec3, Widget, _decorator, instantiate, view, Node } from "cc";
import AItemRenderer from "./AItemRenerer";

const { ccclass, property } = _decorator;

/**
 * 虚拟滚动视图 扩展ScrollView
 * 渲染预制体必需挂载 AItemRenerer子类
 * @author slf
 */
@ccclass('AVirtualScrollView')
export default class AVirtualScrollView extends ScrollView {
    /**渲染预制体必需挂载 AItemRenerer子类 */
    @property({ type: Prefab, serializable: true, displayName: "渲染预制体" })
    AItemRenerer: Prefab = null;
    @property({ displayName: "启动虚拟列表" })
    virtualList: boolean = true;
    /**开启滑动到底部 发送回调 */
    @property({ tooltip: "无限滑动，到底后发送回调事件", visible() { return this.virtualList } })
    infiniteScroll = false;
    @property({ tooltip: "自动检测画布大小变化，改变content layout布局", visible() { return this.virtualList } })
    autoSize = false;
    @property({ tooltip: "GRID水平居中显示", visible() { return this.autoSize } })
    distributeHorizontalCenter = false;

    private infiniteScrollCb: Function;
    private infiniteScrollThis: any;

    /**子项 回调函数  回调作用域*/
    protected callback: Function;
    protected thisArg: any;

    /**最大渲染预制体 垂直数量 */
    private verticalCount: number;
    /**最大渲染预制体 水平数量 */
    private horizontalCount: number;
    /**预制体宽高 */
    private itemW: number;
    private itemH: number;
    /**定时器 */
    private interval: any;
    /**预制体池 */
    private itemPool: any[];
    /**预制体列表 */
    private itemList: any[];
    /**预制体渲染类列表 */
    private AItemRenererList: any[];
    /**数据列表 */
    private dataList: any[];
    /**开始坐标 */
    private startPos: Vec2;
    /**布局*/
    private contentLayout: Layout;

    /**强制刷新 */
    private forcedRefresh: boolean;
    /**刷新 */
    private refresh: boolean;
    /**是否移动到底部  无限滚动回调*/
    private moveBottom: boolean;

    private _uiTransform: UITransform;

    private isInit: boolean;
    onLoad() {
        this.isInit = true;
        this.itemList = [];
        this.itemPool = [];
        this.AItemRenererList = [];

        if (this.virtualList) {
            this.contentLayout = this.content.getComponent(Layout);
            this.contentLayout.enabled = false;
            this._uiTransform = this.node.getComponent(UITransform);
            this.resetSize();
            this.autoSize && view.on("canvas-resize", this.onCanvasSizeChange, this);
        }
        if (this.dataList) {
            this.refreshData(this.dataList);
        }
    }

    private onCanvasSizeChange(): void {
        this.unschedule(this.delayRefresh);
        this.scheduleOnce(this.delayRefresh, 0.5);
    }

    private delayRefresh(): void {
        this.resetSize();
        if (this.dataList != null) {
            this.refreshData(this.dataList);
        }
    }

    /**重置大小 */
    private resetSize(): void {
        let widget = this.content.getComponent(Widget);
        if (widget) {
            widget.updateAlignment();
        } else {
            widget = this.getComponent(Widget);
            widget && widget.updateAlignment();
        }

        let itemNode: UITransform = this.AItemRenerer.data.getComponent(UITransform);
        //起始位置
        this.startPos = new Vec2(itemNode.width * itemNode.anchorX + this.contentLayout.paddingLeft, -(itemNode.height * itemNode.anchorY + this.contentLayout.paddingTop));

        //预制体宽高
        this.itemW = itemNode.width + this.contentLayout.spacingX;
        this.itemH = itemNode.height + this.contentLayout.spacingY;

        let hCount = (this._uiTransform.width + this.contentLayout.spacingX - this.contentLayout.paddingLeft) / this.itemW;
        let vCount = (this._uiTransform.height + this.contentLayout.spacingY - this.contentLayout.paddingTop) / this.itemH;

        //垂直、水平最大预制体数量
        this.horizontalCount = Math.ceil(hCount) + 1;
        this.verticalCount = Math.ceil(vCount) + 1;

        if (this.contentLayout.type == Layout.Type.GRID) {
            if (this.contentLayout.startAxis == Layout.AxisDirection.HORIZONTAL) {
                this.horizontalCount = Math.floor(hCount);
                //动态计算居中平均分布
                if (this.autoSize && this.distributeHorizontalCenter) {
                    let spacingX = (this._uiTransform.width - this.horizontalCount * itemNode.width) / this.horizontalCount;
                    this.startPos.x = itemNode.width * itemNode.anchorX + spacingX / 2;
                    this.itemW = itemNode.width + spacingX;
                }
            } else {
                this.verticalCount = Math.floor(vCount);
            }
        }
    }


    protected onDestroy(): void {
        this.dataList = null;
        this.itemList = null;
        this.AItemRenererList = null;
        if (this.interval) {
            clearInterval(this.interval);
        }
        view.off("canvas-resize", this.onCanvasSizeChange, this);
    }

    /**利用ScrollView本身方法 来标记滑动中 */
    _setContentPosition(position: Vec3) {
        super['_setContentPosition'](position);
        this.refresh = true;
    }

    /**
     * 设置列表 子项回调
     * 回调会携带当前子项的 data 和 透传参数
     * @param cb 回调
     * @param cbT 作用域
     * @param thisarg 透传参数
     */
    public setItemCallback(callback: (data: any, thisarg?: any) => void, cbT: any): void {
        this.callback = callback;
        this.thisArg = cbT;
    }

    /**子项回调 */
    private onItemCallback(data: any): void {
        this.callback && this.callback.call(this.thisArg, data);
    }

    /**
     * 设置列表 无限滚动到底部后 回调
     * @param cb 回调
     * @param cbT 作用域
     */
    public setInfiniteScrollCallback(cb: () => void, cbT: any): void {
        this.infiniteScrollCb = cb;
        this.infiniteScrollThis = cbT;
    }

    /**无限滚动到底部后 回调 */
    private onInfiniteScrollCallback(): void {
        this.moveBottom = false;
        if (this.infiniteScrollCb) {
            // console.log("发送回调");
            this.infiniteScrollCb.call(this.infiniteScrollThis);
        }
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
        if (!this.isInit) {
            return;
        }

        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.addItem();

        if (this.virtualList) {
            this.refreshContentSize();
            this.forcedRefresh = true;
            this.refresh = true;
            this.interval = setInterval(this.refreshItem.bind(this), 1000 / 10);
            this.refreshItem();
        }
    }

    /**添加预制体 */
    private addItem(): void {
        let len: number = 0;
        if (this.virtualList) {
            switch (this.contentLayout.type) {
                case Layout.Type.HORIZONTAL:
                    len = this.horizontalCount;
                    break;
                case Layout.Type.VERTICAL:
                    len = this.verticalCount;
                    break;
                case Layout.Type.GRID:
                    len = this.horizontalCount * this.verticalCount;
                    break;
            }
            len = Math.min(len, this.dataList.length);
        } else {
            len = this.dataList.length;
        }

        let itemListLen = this.itemList.length;
        if (itemListLen < len) {
            let AItemRenerer: AItemRenderer<any> = null;
            for (var i = itemListLen; i < len; i++) {
                let child = this.itemPool.length > 0 ? this.itemPool.shift() : instantiate(this.AItemRenerer);
                this.content.addChild(child);
                this.itemList.push(child);
                AItemRenerer = child.getComponent(AItemRenerer);
                this.AItemRenererList.push(AItemRenerer);
                AItemRenerer.registerCallback(this.onItemCallback, this);
            }
        } else {
            let cL: number = this.content.children.length;
            let item;
            while (cL > len) {
                item = this.itemList[cL - 1];
                this.content.removeChild(item);
                this.itemList.splice(cL - 1, 1);
                this.AItemRenererList.splice(cL - 1, 1);
                this.itemPool.push(item);
                cL = this.content.children.length;
            }
        }

        if (!this.virtualList) {
            this.dataList.forEach((v, idx) => {
                this.AItemRenererList[idx].data = v;
            });
        }
    }

    /**根据数据数量 改变content宽高 */
    private refreshContentSize(): void {
        let layout: Layout = this.contentLayout;
        let dataListLen: number = this.dataList.length;
        switch (this.contentLayout.type) {
            case Layout.Type.VERTICAL:
                this.content.getComponent(UITransform).height = layout.paddingTop + dataListLen * this.itemH + layout.paddingBottom;
                break;
            case Layout.Type.HORIZONTAL:
                this.content.getComponent(UITransform).width = layout.paddingLeft + dataListLen * this.itemW + layout.paddingRight;
                break;
            case Layout.Type.GRID:
                if (this.contentLayout.startAxis == Layout.AxisDirection.HORIZONTAL) {
                    this.content.getComponent(UITransform).height = layout.paddingTop + Math.ceil(dataListLen / this.horizontalCount) * this.itemH + layout.paddingBottom;
                } else if (this.contentLayout.startAxis == Layout.AxisDirection.VERTICAL) {
                    this.content.getComponent(UITransform).width = layout.paddingLeft + Math.ceil(dataListLen / this.verticalCount) * this.itemW + layout.paddingRight;
                }
                break;
        }
    }

    /**刷新预制体位置 和 数据填充 */
    private refreshItem(): void {
        this.moveBottom && this.onInfiniteScrollCallback();
        if (!this.refresh) {
            return;
        }
        switch (this.contentLayout.type) {
            case Layout.Type.HORIZONTAL:
                this.refreshHorizontal();
                break;
            case Layout.Type.VERTICAL:
                this.refreshVertical();
                break;
            case Layout.Type.GRID:
                this.refreshGrid();
                break;
        }
        this.refresh = false;
        this.forcedRefresh = false;
    }

    /**刷新水平 */
    private refreshHorizontal() {
        
        let start = Math.floor(Math.abs(this.content.position.x) / this.itemW);
        if (start < 0 || this.content.position.x > 0) {                //超出边界处理
            start = 0;
        }
        let end = start + this.horizontalCount;
        if (end > this.dataList.length) {//超出边界处理
            end = this.dataList.length;
            start = Math.max(end - this.horizontalCount, 0);
        }



        let tempV = 0;
        let itemListLen = this.itemList.length;
        let item: Node, pos: Vec3, idx;
        for (var i = 0; i < itemListLen; i++) {
            idx = (start + i) % itemListLen;
            item = this.itemList[idx];
            pos = item.position;
            tempV = this.startPos.x + ((start + i) * this.itemW);
            if (pos.x != tempV || this.forcedRefresh) {
                // console.log("修改的数据="+(start+i))
                pos.x = tempV;
                item.position = pos;
                this.AItemRenererList[idx].data = this.dataList[start + i];

                if (this.infiniteScroll && start > 0 && start + i == this.dataList.length - 1) {
                    this.moveBottom = true;
                }
            }
        }
    }

    /**刷新垂直 */
    private refreshVertical(): void {
        let start = Math.floor(Math.abs(this.content.position.y) / this.itemH);
        if (start < 0 || this.content.position.y < 0) {
            start = 0;
        }

        let end = start + this.verticalCount;
        if (end > this.dataList.length) {
            end = this.dataList.length;
            start = Math.max(end - this.verticalCount, 0);
        }



        let tempV = 0;
        let itemListLen = this.itemList.length;
        let item: Node, pos: Vec3, idx;
        for (var i = 0; i < itemListLen; i++) {
            idx = (start + i) % itemListLen;
            item = this.itemList[idx];
            pos = item.position;
            tempV = this.startPos.y + (-(start + i) * this.itemH);
            if (pos.y != tempV || this.forcedRefresh) {
                // console.log("修改的数据="+(start+i))
                pos.y = tempV;
                item.position = pos;
                this.AItemRenererList[idx].data = this.dataList[start + i];

                if (this.infiniteScroll && start > 0 && start + i == this.dataList.length - 1) {
                    this.moveBottom = true;
                }
            }
        }
    }

    /**刷新网格 */
    private refreshGrid(): void {
        //是否垂直方向 添加网格
        let isVDirection = this.contentLayout.startAxis == Layout.AxisDirection.VERTICAL;
        let start = Math.floor(Math.abs(this.content.position.y) / this.itemH) * this.horizontalCount;
        if (isVDirection) {
            start = Math.floor(Math.abs(this.content.position.x) / this.itemW) * this.verticalCount;
            if (this.content.position.x > 0) {
                start = 0;
            }
        } else if (this.content.position.y < 0) {
            start = 0;
        }

        if (start < 0) {
            start = 0;
        }

        let end = start + this.horizontalCount * this.verticalCount;
        if (end > this.dataList.length) {
            end = this.dataList.length;
            start = Math.max(end - this.horizontalCount * this.verticalCount, 0);
        }


        let tempX = 0;
        let tempY = 0;
        let itemListLen = this.itemList.length;
        let item: Node, pos: Vec3, idx;
        for (var i = 0; i < itemListLen; i++) {
            idx = (start + i) % itemListLen;
            item = this.itemList[idx];
            pos = item.position;
            if (isVDirection) {
                tempX = this.startPos.x + (Math.floor((start + i) / this.verticalCount)) * this.itemW;
                tempY = this.startPos.y + -((start + i) % this.verticalCount) * this.itemH;
            } else {
                tempX = this.startPos.x + ((start + i) % this.horizontalCount) * this.itemW;
                tempY = this.startPos.y + -(Math.floor((start + i) / this.horizontalCount)) * this.itemH;
            }

            if (pos.y != tempY || pos.x != tempX || this.forcedRefresh) {
                // console.log("修改的数据="+(start+i))
                pos.x = tempX;
                pos.y = tempY;
                item.position = pos;
                this.AItemRenererList[idx].data = this.dataList[start + i];
                if (this.infiniteScroll && start > 0 && start + i == this.dataList.length - 1) {
                    this.moveBottom = true;
                }
            }
        }
    }
}
