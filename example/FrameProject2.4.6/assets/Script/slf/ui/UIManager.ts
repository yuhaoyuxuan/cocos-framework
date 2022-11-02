import UIBase from "./base/UIBase";
import UIPopup from "./UIPopup";
import UILayer from "./UILayer";
import UIData from "./base/UIData";
import UIController from "./UIController";
import { Logger } from "../Logger";
import { ResManager } from "../res/ResManager";

/**
 * ui管理
 * @author slf
 * */
export default class UIManager {
	/**ui控制器 */
	private controller:UIController;
	/**弹出管理 */
	private popup:UIPopup;
	/**层级管理 */
	private layer:UILayer;

	/**界面表 */
	private viewMap: { key?: UIBase } = {};
	private openList:UIData[] = [];
	private currOpen:UIData;

	private static _instance: UIManager;
	public static getInstance(): UIManager {
		return this._instance || (this._instance = new UIManager());
	}

	/**
	 * 初始化
	 * @param uiRoot ui根容器
	 */
	public init(uiRoot:cc.Node):void
	{
		this.layer = new UILayer();
		this.layer.init(uiRoot);
		this.popup = new UIPopup();
		this.controller = UIController.getInstance();
		this.controller.init();
	}

	public showUI(uiId:number,data?: any):void
	{
		let self = this;
		let uiData:UIData = this.controller.getUIData(uiId);
		if(uiData == null){
			return;
		}

		Logger.warn("open= "+uiData.className);
		if(uiData.isSync){
			//显示loading
		}

		uiData.data = data;
		let ui: UIBase = self.viewMap[uiId];
		//预制体加载
		if(!ui){
			cc.resources.load(uiData.prefabPath, cc.Prefab, (error, prefab: cc.Prefab) => {
				//创建预制体
				let node:cc.Node = cc.instantiate(prefab);
				//添加相对 布局节点
				let widget: cc.Widget = node.getComponent(cc.Widget)
				if(!widget){
					widget = node.addComponent(cc.Widget)
				}
				widget.isAlignTop = widget.isAlignLeft = widget.isAlignRight = widget.isAlignBottom = true;
				widget.top = widget.bottom = widget.left = widget.right = 0;
				//添加脚本
				ui = node.addComponent(uiData.className);
				ui.prefab = prefab;
				//添加预制体 引用++
				ui.prefab.addRef();
				self.viewMap[uiId] = ui;
				ui.uiData = uiData;
				self.show(ui);
			})
		}else{
			ui.uiData = uiData;
			this.show(ui);
		}
	}

	private load():void
	{
		if(this.currOpen == null && this.openList.length>0){
			this.currOpen = this.openList.shift();
			ResManager.loadPrefab(this.currOpen.prefabPath,this.loadComplete.bind(this),this.currOpen);
		}
	}

	private loadComplete(prefab:cc.Prefab):void
	{
		let node:cc.Node = cc.instantiate(prefab);
		//添加相对 布局节点
		let widget: cc.Widget = node.getComponent(cc.Widget)
		if(!widget){
			widget = node.addComponent(cc.Widget)
		}
		widget.isAlignTop = widget.isAlignLeft = widget.isAlignRight = widget.isAlignBottom = true;
		widget.top = widget.bottom = widget.left = widget.right = 0;

		//添加脚本
		let ui:UIBase = node.addComponent(this.currOpen.className);
		this.viewMap[this.currOpen.id] = ui;
		ui.uiData = this.currOpen;
		this.show(ui);
	}

	private show(uiBase:UIBase):void
	{
		uiBase.preload(()=>{
			if(uiBase.uiData.isSync){
				//隐藏loading
			}
			if(uiBase.uiData.closeFailed){
				uiBase.uiData.closeFailed = false;
				return;
			}

			if(!uiBase.node.parent){
				this.layer.addLayer(uiBase);
				this.popup.addPopup(uiBase);
			}
			uiBase.initView();
			
		});
		this.currOpen = null;
		this.load();
	}

	public closeUI(uiId:number | UIBase):void
	{
		let ui: UIBase;
		if (typeof (uiId) != "number") {
			ui = uiId;
		}else{
			ui= this.viewMap[uiId];
		}

		if(ui){
			if(ui.node.parent){
				this.layer.removeLayer(ui);
				ui.removeLayer();
			}
			Logger.warn("close= "+ui.uiData.className);
			if(ui.uiData.isDestroy){
				delete this.viewMap[ui.uiData.id];
				ui.node && ui.node.destroy();
			}
		}else{
			//未加载成功就关闭页面 添加状态
			let uData:UIData = this.controller.getUIData(uiId as number);
			if(uData){
				uData.closeFailed = true;
			}
		}
	}
}