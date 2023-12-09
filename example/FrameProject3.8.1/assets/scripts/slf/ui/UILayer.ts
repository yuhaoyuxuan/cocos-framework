import { BlockInputEvents, Color, Graphics, Node, UITransform, Widget, view } from "cc";
import { IUI } from "./base/IUI";
import { IUIManager } from "./base/IUIManager";

/**层级类型 */
export enum LayerType {
    /** 场景层*/
    Scene,
    /** 唯一层 互斥，同时只会存在一个*/
    Sole,
    /** 面板层 */
    Panel,
    /** 对话框层 */
    Dialog,
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
            value = LayerType[key];
            this.layerMap.set(value, this.addNode(key));

            if (value == LayerType.Scene.toString() || value == LayerType.Loading.toString()) {
                continue;
            }

            //添加层遮罩节点
            this.layerMaskMap.set(LayerType[key], this.addBlack(key, this.layerMap.get(LayerType[key])));
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
        if (!this.layerMap.has(uiBase.layerType)) {
            console.error("addLayer none layer " + uiBase.layerType);
            return;
        }
        if (uiBase.layerType == LayerType.Sole) {
            this.removeLayerAll(uiBase.layerType);
        }
        this.layerMap.get(uiBase.layerType).addChild(uiBase.node);
        uiBase.isBlackMask && this.flushBlackMask(uiBase.layerType);
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
        return black;
    }

    /**绘制黑底 */
    private setGraphicsSize(gh: Graphics): void {
        gh.clear();
        let size = gh.node.getComponent(UITransform).contentSize;
        let defSize = view.getDesignResolutionSize();
        if (size.x < defSize.x || size.y < defSize.y) {
            size = defSize;
        }
        gh.fillRect(-size.x / 2, -size.y / 2, size.width, size.height);
        gh.fill();
    }

    /**添加相对 布局节点 */
    private addWidget(node: Node, offsetV = 0): void {
        let widget: Widget = node.addComponent(Widget)
        widget.isAlignTop = widget.isAlignLeft = widget.isAlignRight = widget.isAlignBottom = true;
        widget.top = widget.bottom = widget.left = widget.right = offsetV;
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
