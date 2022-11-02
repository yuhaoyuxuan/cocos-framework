import UIBase from "./base/UIBase";

/**层级类型 */
export enum LayerType {
	/** 场景层*/
	Scene,
	/** 唯一的  会把同层级的view移除*/
	Sole,
	/** 面板层 */
	Panel,
	/** 加载层 */
	Loading
}

/**
  * 游戏层级管理
  * @author slf
  */
export default class UILayer{
    /**场景层*/
    public sceneLayer: cc.Node = new cc.Node("scene");
    /**唯一层 会把同层级的view移除*/
    public soleLayer: cc.Node = new cc.Node("sole");
    /**面板层*/
    public panelLayer: cc.Node = new cc.Node("panel");
    /**loading层 */
    public loadingLayer: cc.Node = new cc.Node("loading");


    //面板层黑底
    private blackMaskSole: cc.Node;
    private blackMaskPanel: cc.Node;
    private blackMaskLoading: cc.Node;


    //初始化场景类
    public init(rootView: cc.Node): void {
        rootView.addChild(this.sceneLayer);
        rootView.addChild(this.soleLayer);
        rootView.addChild(this.panelLayer);
        rootView.addChild(this.loadingLayer);


        this.addWidget(this.sceneLayer);
        this.addWidget(this.soleLayer);
        this.addWidget(this.panelLayer);
        this.addWidget(this.loadingLayer);

        this.blackMaskSole = this.addBlack("blackSole");
        this.soleLayer.addChild(this.blackMaskSole);
        this.blackMaskPanel = this.addBlack("blackPanel");
        this.panelLayer.addChild(this.blackMaskPanel);
        this.blackMaskLoading = this.addBlack("blackLoading");
        this.loadingLayer.addChild(this.blackMaskLoading);



        // this.blackMask.active = false;
        /**尺寸发生变化 */
        // cc.view.setResizeCallback(function () {
            
        // }.bind(this));
    }


    /**添加相对 布局节点 */
    private addWidget(node: cc.Node, offsetV = 0): void {
        let widget: cc.Widget = node.addComponent(cc.Widget)
        widget.isAlignTop = widget.isAlignLeft = widget.isAlignRight = widget.isAlignBottom = true;
        widget.top = widget.bottom = widget.left = widget.right = offsetV;
    }

    /**添加层遮挡黑底 */
    private addBlack(name:string = "black"): cc.Node {
        let self = this;
        let black:cc.Node = new cc.Node(name);
        black.addComponent(cc.Sprite);
        black.addComponent(cc.BlockInputEvents);
        cc.resources.load("images/com/com_blackBg", cc.SpriteFrame, (error, texture:cc.SpriteFrame) => {
            texture.addRef();
            black.getComponent(cc.Sprite).spriteFrame = texture;
            self.addWidget(black, -20);
        });
        black.active = false;
        return black;
    }

    /**刷新黑底 */
    private flushDarkLayer(type:LayerType) {
        let childList = this.panelLayer.children;
        if(type == LayerType.Sole){
            childList = this.soleLayer.children;
        }else if(type == LayerType.Loading){
            childList = this.loadingLayer.children;
        }


        let isDark = false
        for (let child of childList) {
            let code: UIBase = child.getComponent(UIBase);
            if (code && code.uiData.isDarkRect) {
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

    //添加面板
    public addLayer(layer: UIBase): void {
        switch (layer.uiData.layerType) {
            case LayerType.Scene:
                this.sceneLayer.addChild(layer.node);
                break;
            case LayerType.Sole:
                this.soleLayer.addChild(layer.node);
                break;
                case LayerType.Panel:
                this.panelLayer.addChild(layer.node);
                break;
                case LayerType.Loading:
                this.loadingLayer.addChild(layer.node);
                break;
        }
        layer.uiData.isDarkRect && this.flushDarkLayer(layer.uiData.layerType);
    }

    //移除面板
    public removeLayer(layer: UIBase): void {
        if (layer) {
            if (layer.node && layer.node.parent) {
                layer.node.parent.removeChild(layer.node, false);
            }
            layer.uiData.isDarkRect && this.flushDarkLayer(layer.uiData.layerType);
        }
    }
}
