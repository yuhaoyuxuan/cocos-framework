import { Logger } from "../Logger";
import UIData from "./base/UIData";
import { LayerType } from "./UILayer";
import { PopupType } from "./UIPopup";


/**
 * 视图控制器  ui id绑定数据 
 * @author slf
 * */
 export default class UIController {
    private uiDataMap:Map<number,UIData> = new Map();
    private static _instance: UIController;
	public static getInstance(): UIController {
		return this._instance || (this._instance = new UIController());
	}
    public init():void
    {
        this.register(1, new UIData(1, "Home", "prefabs/home/Home", PopupType.None, LayerType.Scene, false, false, false));
        this.register(2, new UIData(2, "FactionDetail", "prefabs/detail/FactionDetail", PopupType.None, LayerType.Panel, true, true, true));
        this.register(3, new UIData(3, "FactionChange", "prefabs/detail/FactionChange", PopupType.MinToMax, LayerType.Panel, true, true, true));
        this.register(4, new UIData(4, "UserExploit", "prefabs/UserExploit", PopupType.MinToMax, LayerType.Panel, true, true, true));
        this.register(5, new UIData(5, "FactionHelp", "prefabs/FactionHelp", PopupType.None, LayerType.Panel, true, true, true));
        this.register(6, new UIData(6, "MapBlockInfo", "prefabs/home/MapBlockInfo", PopupType.MinToMax, LayerType.Panel, false, true, true));
        this.register(7, new UIData(7, "FactionAward", "prefabs/FactionAward", PopupType.MinToMax, LayerType.Panel, true, true, true));
        this.register(8, new UIData(8, "FactionDetailHelp", "prefabs/detail/FactionDetailHelp", PopupType.MinToMax, LayerType.Panel, true, true, true));
        this.register(9, new UIData(9, "Marquee", "prefabs/com/Marquee", PopupType.None, LayerType.Panel, false, false, false));
        this.register(10, new UIData(10, "LoadingCircle", "prefabs/loading/LoadingCircle", PopupType.None, LayerType.Loading, false, false, false));
        this.register(11, new UIData(11, "LoadingProgress", "prefabs/loading/LoadingProgress", PopupType.None, LayerType.Loading, true, false, false));
        this.register(12, new UIData(12, "MessageTips", "prefabs/com/MessageTips", PopupType.None, LayerType.Loading, false, false, false));
        this.register(13, new UIData(13, "Dialog", "prefabs/com/Dialog", PopupType.MinToMax, LayerType.Panel, false, true, false));
        this.register(14, new UIData(14, "ExplainTips", "prefabs/com/ExplainTips", PopupType.None, LayerType.Loading, false, false, false));
    }
	
    /// <summary>
    /// 注册ui数据
    /// </summary>
    /// <param name="uiId">id</param>
    /// <param name="data">数据</param>
    public register(uiId:number,data:UIData):void
    {
        if (this.uiDataMap.has(uiId))
        {
            Logger.error("注册相同uiId=="+uiId);
        }
        else
        {
            this.uiDataMap.set(uiId,data);
        }
    }

    /// <summary>
    /// 获取ui数据
    /// </summary>
    /// <param name="uiId">id</param>
    /// <returns>ui数据</returns>
    public getUIData(uiId:number):UIData
    {
        if(this.uiDataMap.has(uiId)){
            return this.uiDataMap.get(uiId);
        }
        Logger.error("没有此uiId==" + uiId);
        return null;
    }
}