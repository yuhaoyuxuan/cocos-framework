import { BlockInputEvents, Color, Graphics, Node, UITransform, Widget, view } from "cc";
import { IUI } from "./base/IUI";
import { IUIManager } from "./base/IUIManager";

/**层级类型 */
export enum LayerType {
    /** 全屏层 如果有多个全屏界面，下层界面会隐藏 减少性能消耗*/
    FullScreen,
    /** 面板层 */
    Panel,
    /** 加载、通信层 */
    Loading
}

/**
  * 游戏层级管理
  * @author slf
  */
export default class UILayer {
    private manager: IUIManager;
    /**层合集 */
    private layerMap: Map<LayerType | string, Node>;
    /**层遮挡合集 */
    private layerMaskMap: Map<LayerType | string, Node>;
    constructor() {
        this.layerMap = new Map();
        this.layerMaskMap = new Map();

        let value;
        /**添加层节点 */
        for (let key in LayerType) {
            if (!isNaN(key as any)) {
                continue;
            }
            value = LayerType[key];
            this.layerMap.set(value, this.addNode(key));

            //添加层遮罩节点
            if (value == LayerType.Panel.toString()) {
                this.layerMaskMap.set(value, this.addBlack(key, this.layerMap.get(value)));
            }
        }
    }

    /**
     * 初始化ui根容器
     * @param rootView 
     */
    public initRoot(rootView: Node, manager: IUIManager): void {
        this.layerMap.forEach(node => {
            node.parent = rootView;
        })
        this.manager = manager;
    }

    /**
     * 添加到显示列表
     * @param uiBase 
     */
    public addLayer(uiBase: IUI): void {
        let node = this.getLayer(uiBase.layerType);
        if (!node) {
            return;
        }
        node.addChild(uiBase.node);
        uiBase.isBlackMask && this.flushBlackMask(uiBase.layerType);
    }

    /**获取层级节点 */
    public getLayer(layerType: LayerType): Node {
        if (!this.layerMap.has(layerType)) {
            console.error("addLayer none layer " + layerType);
            return;
        }
        return this.layerMap.get(layerType);
    }

    /**
     * 从显示列表移除
     * @param uiBase 
     */
    public removeLayer(uiBase: IUI): void {
        if (uiBase) {
            if (uiBase.node && uiBase.node.parent) {
                uiBase.node.parent.removeChild(uiBase.node);
            }
            uiBase.isBlackMask && this.flushBlackMask(uiBase.layerType);
        }
    }

    /**
     * 删除此层的所有节点
     * @param layer 
     */
    public removeLayerAll(layer: LayerType | LayerType[]): void {
        if (Array.isArray(layer)) {
            layer.forEach(v => {
                this.removeLayerAll(v);
            })
            return;
        }
        let childList = this.layerMap.get(layer).children;
        let uiBase: IUI
        for (let i = childList.length - 1; i >= 0; i--) {
            uiBase = childList[i].getComponent("UIBase") as any;
            if (uiBase) {
                this.manager.closeUI(uiBase);
            }
        }
    }

    /**添加层节点 */
    private addNode(name: string): Node {
        let layer: Node = new Node(name);
        layer.addComponent(UITransform);
        this.addWidget(layer, 0);
        return layer;
    }


    /**添加层遮挡黑底 */
    private addBlack(name: string, parent: Node): Node {
        let black: Node = new Node(name + "_black");
        let gh = black.addComponent(Graphics);
        gh.fillColor = new Color(0, 0, 0, 120);
        black.addComponent(BlockInputEvents);
        this.addWidget(black, -20);
        black.active = false;
        this.setGraphicsSize(gh);
        black.parent = parent;
        black.on(Node.EventType.SIZE_CHANGED, this.setGraphicsSize.bind(this, gh));
        return black;
    }

    /**绘制黑底 */
    private setGraphicsSize(gh: Graphics): void {
        gh.clear();
        let size = gh.node.getComponent(UITransform).contentSize.clone();
        let defSize = view.getDesignResolutionSize().clone();
        if (size.x < defSize.x || size.y < defSize.y) {
            size = defSize;
        }
        size.x *= 1.5;
        size.y *= 1.5;
        gh.fillRect(-size.x / 2, -size.y / 2, size.width, size.height);
        gh.fill();
    }

    /**添加相对 布局节点 */
    private addWidget(node: Node, offsetV = 0): void {
        let widget: Widget = node.addComponent(Widget)
        widget.isAlignTop = widget.isAlignLeft = widget.isAlignRight = widget.isAlignBottom = true;
        widget.top = widget.bottom = widget.left = widget.right = offsetV;
        widget.alignMode = Widget.AlignMode.ALWAYS;
    }

    /**刷新黑底 */
    private flushBlackMask(type: LayerType) {
        if (!this.layerMaskMap.has(type)) {
            return;
        }
        let childList: Node[] = this.layerMap.get(type).children;
        let black: Node = this.layerMaskMap.get(type);

        let isDark = false;
        let uiBase: IUI;
        for (let i = childList.length - 1; i >= 0; i--) {
            uiBase = childList[i].getComponent("UIBase") as any;
            if (uiBase?.isBlackMask) {
                isDark = true;
                break;
            }
        }

        if (childList.length > 1 && isDark) {
            let index = uiBase.node.getSiblingIndex();
            black.parent.insertChild(black, black.getSiblingIndex() > index ? index : index - 1);
            black.active = true;
        } else {
            black.active = false;
        }
    }
}
