import UIManager from "../UIManager";
import AComponent from "../component/AComponent";
import UIData from "./UIData";
import { IUI } from "./IUI";
import { IPreload } from "./IPreload";
import { Enum, _decorator } from "cc";
import { LayerType } from "../UILayer";
import { PopupType } from "../UIPopup";

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
	@property({ tooltip: "是否显示半透黑底", visible() { return this.layerType == LayerType.Sole || this.layerType == LayerType.Panel } })
	public isBlackMask: boolean = true;
	/**关闭面板是否销毁*/
	@property({ tooltip: "关闭面板是否销毁" })
	public isDestroy: boolean = true;

	public uiData: UIData;
	protected preloadCb: Function;

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

	public initView(): void { }
	public removeView(): void { }

	public close(): void {
		UIManager.Instance().closeUI(this);
	}
}
