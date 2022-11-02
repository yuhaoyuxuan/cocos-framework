import UIManager from "../UIManager";
import AComponent from "../component/AComponent";
import { PopupType } from "../UIPopup";
import { LayerType } from "../UILayer";
import UIData from "./UIData";
import { IPreload, IUI } from "./IUI";

const { ccclass, property } = cc._decorator;
/**
 * 界面基础类
 * @author slf
 */
@ccclass
export default class UIBase extends AComponent implements IUI,IPreload {
	public uiData:UIData;
	protected preloadCb:Function;

    /// <summary>
    /// 移除显示列表后
    /// </summary>
    public removeLayer():void
    {
        this.preloadCb = null;
        this.removeView();
    }
	
	public preload(cb:Function):void
	{
		this.preloadCb = cb;
        this.preloadComplete();
	}

	public preloadComplete():void
	{
		(this.preloadCb != null)
        {
            this.preloadCb.call(this);
            this.preloadCb = null;
        }
	}

	public preloadTimeout():void{
		// if(this.uiData.isSync){
		// 	LoadingManager.getInstance().hide(LoadingTypeEnum.Circle);
		// }
		this.preloadCb = null;
	}
	public initEvent():void{}
	public initView():void{}
	public removeView():void{}
	public destroyView():void{}

	/**关闭 */
	public onClose(): void {
		UIManager.getInstance().closeUI(this);
	}
}
