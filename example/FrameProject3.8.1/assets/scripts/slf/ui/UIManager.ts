import UIPopup from "./UIPopup";
import UILayer from "./UILayer";
import UIData from "./base/UIData";
import UIController from "./UIController";
import { ResManager } from "../res/ResManager";
import { Singleton } from "../common/Singleton";
import { Node, Prefab, Widget, instantiate } from "cc";
import { IUI } from "./base/IUI";
import { IPreload } from "./base/IPreload";
import { IUIManager } from "./base/IUIManager";

/**
 * ui界面管理类
 * 
 * @author slf
 * */
export default class UIManager extends Singleton implements IUIManager {
	/**ui控制器 */
	public controller: UIController;
	/**弹出管理 */
	private popup: UIPopup;
	/**层级管理 */
	private layer: UILayer;
	/**已缓存的界面 */
	private cacheUIMap: Map<number, IUI>;
	/**带打开界面队列 */
	private openList: UIData[];
	/**当前打开界面 */
	private currOpen: UIData;

	/**初始化ui管理 */
	protected init(): void {
		this.layer = new UILayer();
		this.popup = new UIPopup();
		this.controller = new UIController();
		this.cacheUIMap = new Map();
		this.openList = [];
	}

	/**
	 * 初始化容器
	 * @param uiRoot ui根容器
	 */
	public initRoot(uiRoot: Node): void {
		this.layer.initRoot(uiRoot, this);
	}

	/**
	 * 打开ui界面
	 * @param uiId 界面id
	 * @param data 透传数据
	 * @returns 
	 */
	public openUI(uiId: number, data?: any): void {
		let uiData: UIData = this.controller.getUIData(uiId);
		if (uiData == null) {
			return;
		}
		uiData.data = data;

		//检测是否缓存
		if (this.cacheUIMap.has(uiId)) {
			this.show(this.cacheUIMap.get(uiId));
			return;
		}

		//加入待打开队列
		let index = this.openList.indexOf(uiData);
		if (index != -1) {//ui已在带打开队列
			this.openList[index].data = data;
		} else {
			this.openList.push(uiData);
		}
		this.loadUI();
	}

	/**加载ui预制体 */
	private loadUI(): void {
		if (this.currOpen == null && this.openList.length > 0) {
			this.currOpen = this.openList.shift();
			//显示同步loading界面
			if (this.currOpen.isSync) {

			}
			ResManager.Instance().load(this.currOpen.prefabPath, Prefab, this.currOpen, this.loadComplete, this, this.currOpen.bundleName)
		}
	}
	/**加载完成 */
	private loadComplete(prefab: Prefab): void {
		let node: Node = instantiate(prefab);

		//添加相对 布局节点
		let widget: Widget = node.getComponent(Widget)
		if (!widget) {
			widget = node.addComponent(Widget)
		}
		widget.isAlignTop = widget.isAlignLeft = widget.isAlignRight = widget.isAlignBottom = true;
		widget.top = widget.bottom = widget.left = widget.right = 0;

		//获取脚本
		let uiBase: IUI = node.getComponent("UIBase") as any;
		this.cacheUIMap.set(this.currOpen.id, uiBase);
		uiBase.uiData = this.currOpen;
		this.show(uiBase);
	}

	/**添加到显示列表 */
	private show(uiBase: IUI): void {
		/**循环引用 */
		let preload: IPreload = uiBase as any;
		//ui界面预加载操作
		preload.preload(() => {
			if (uiBase.uiData.closeFailed) {
				uiBase.uiData.closeFailed = false;
				return;
			}

			if (!uiBase.node.parent) {
				this.layer.addLayer(uiBase);
				this.popup.popup(uiBase);
			}
			uiBase.initView();

		});

		this.currOpen = null;
		this.loadUI();
	}

	/**
	 * 关闭ui界面
	 * @param uiId id 或 ui脚本
	 */
	public closeUI(uiId: number | IUI): void {
		let uiBase: IUI;
		if (typeof (uiId) != "number") {
			uiBase = uiId;
		} else {
			uiBase = this.cacheUIMap.get(uiId);
		}

		if (uiBase) {
			//移除显示列表
			if (uiBase.node.parent) {
				this.layer.removeLayer(uiBase);
				uiBase.removeView();
			}
			//销毁
			if (uiBase.isDestroy) {
				this.cacheUIMap.delete(uiBase.uiData.id);
				uiBase.node && uiBase.node.destroy();
			}
		} else {
			//未加载成功就关闭页面 添加状态
			let uData: UIData = this.controller.getUIData(uiId as number);
			if (uData) {
				uData.closeFailed = true;
			}
		}
	}
}