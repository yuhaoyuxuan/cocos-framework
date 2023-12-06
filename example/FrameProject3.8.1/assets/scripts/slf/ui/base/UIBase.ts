import UIManager from "../UIManager";
import AComponent from "../component/AComponent";
import UIData from "./UIData";
import { IUI } from "./IUI";
import { IPreload } from "./IPreload";
import { Asset, CCBoolean, Enum, _decorator } from "cc";
import { LayerType } from "../UILayer";
import { PopupType } from "../UIPopup";
import { ResManager } from "../../res/ResManager";

const { ccclass, property } = _decorator;
/**
 * 界面基础类
 * @author slf
 */
@ccclass
export default class UIBase extends AComponent implements IUI, IPreload {
	/**层级类型*/
	@property({ type: Enum(LayerType), tooltip: "层级类型" })
	public layerType: LayerType = LayerType.Panel;
	/**弹出效果 */
	@property({ type: Enum(PopupType), tooltip: "弹出效果" })
	public popupType: PopupType = PopupType.None;
	/**是否显示半透黑底*/
	@property({ tooltip: "是否显示半透黑底", visible() { return this.layerType == LayerType.Panel } })
	public isDarkRect: boolean = true;
	/**关闭面板是否销毁*/
	@property({ tooltip: "关闭面板是否销毁" })
	public isDestroy: boolean = true;

	public uiData: UIData;
	protected preloadCb: Function;
	/// <summary>
	/// 移除显示列表后
	/// </summary>
	public removeLayer(): void {
		this.preloadCb = null;
		this.removeView();
	}

	public preload(cb: Function): void {
		this.preloadCb = cb;
		this.preloadComplete();
	}

	public preloadComplete(): void {
		(this.preloadCb != null)
		{
			this.preloadCb.call(this);
			this.preloadCb = null;
		}
	}

	public preloadTimeout(): void {
		this.preloadCb = null;
	}

	public initEvent(): void { }
	public initView(): void { }
	public removeView(): void { }
	public destroyView(): void { }

	/**
	* 加载资源
	* @param url 
	* @param type 
	* @param callback 
	* @param bundleName 
	*/
	protected load(url: string, type: Asset, callback: (asset) => void, bundleName: string = "resources"): void {
		ResManager.Instance().load(url, type, this.uiData, callback, this, bundleName);
	}

	/**todo 子类重写后记得 suepr */
	protected onDestroy(): void {
		super.onDestroy();
		ResManager.Instance().destroy(this.uiData);
		this.uiData = null;
	}

	/**关闭 */
	public onClose(): void {
		UIManager.Instance().closeUI(this);
	}
}
