import UIBase from "./base/UIBase";
import { BlockInputEvents, Node, Sprite, Widget } from "cc";

/**层级类型 */
export enum LayerType {
    /** 场景层*/
    Scene,
    /** 面板层 */
    Panel,
    /** 加载层 */
    Loading
}

/**
  * 游戏层级管理
  * @author slf
  */
export default class UILayer {
    /**场景层*/
    private sceneLayer: Node = new Node("scene");
    /**面板层*/
    private panelLayer: Node = new Node("panel");
    /**loading层 */
    private loadingLayer: Node = new Node("loading");

    //面板层黑底
    private blackMaskPanel: Node;
    constructor() {
        this.addWidget(this.sceneLayer);
        this.addWidget(this.panelLayer);
        this.addWidget(this.loadingLayer);

        this.blackMaskPanel = this.addBlack("blackPanel");
        this.panelLayer.addChild(this.blackMaskPanel);
    }

    /**
     * 初始化ui根容器
     * @param rootView 
     */
    public initRoot(rootView: Node): void {
        rootView.addChild(this.sceneLayer);
        rootView.addChild(this.panelLayer);
        rootView.addChild(this.loadingLayer);
    }

    /**
     * 添加到显示列表
     * @param ui 
     */
    public addLayer(ui: UIBase): void {
        switch (ui.layerType) {
            case LayerType.Scene:
                this.sceneLayer.addChild(ui.node);
                break;
            case LayerType.Panel:
                this.panelLayer.addChild(ui.node);
                ui.isDarkRect && this.flushDarkLayer(ui.layerType);
                break;
            case LayerType.Loading:
                this.loadingLayer.addChild(ui.node);
                break;
            default:
                console.error("none layer " + ui.layerType);
                break;
        }
    }
    
    /**
     * 从显示列表移除
     * @param ui 
     */
    public removeLayer(ui: UIBase): void {
        if (ui) {
            if (ui.node && ui.node.parent) {
                ui.node.parent.removeChild(ui.node);
            }
            ui.isDarkRect && this.flushDarkLayer(ui.layerType);
        }
    }

    /**添加层遮挡黑底 */
    private addBlack(name: string = "black"): Node {
        let black: Node = new Node(name);
        black.addComponent(Sprite);
        black.addComponent(BlockInputEvents);
        this.addWidget(black, -20);
        black.active = false;
        return black;
    }

    /**添加相对 布局节点 */
    private addWidget(node: Node, offsetV = 0): void {
        let widget: Widget = node.addComponent(Widget)
        widget.isAlignTop = widget.isAlignLeft = widget.isAlignRight = widget.isAlignBottom = true;
        widget.top = widget.bottom = widget.left = widget.right = offsetV;
    }

    /**刷新黑底 */
    private flushDarkLayer(type: LayerType) {
        let childList = this.panelLayer.children;
        let isDark = false
        for (let child of childList) {
            let ui: UIBase = child.getComponent(UIBase);
            if (ui?.isDarkRect) {
                isDark = true
                break
            }
        }
        if (childList.length > 1 && isDark) {
            this.panelLayer.insertChild(this.blackMaskPanel, childList.length - 2)
            this.blackMaskPanel.active = true;
        } else {
            this.blackMaskPanel.active = false;
        }
    }
}
