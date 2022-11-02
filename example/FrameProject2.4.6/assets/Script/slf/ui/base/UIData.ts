import { LayerType } from "../UILayer";
import { PopupType } from "../UIPopup";

/**
 * ui数据
 * @author slf
 */
export default  class UIData 
{
    /**界面id */
    public id:number;
    /**className */
    public className:any;
    /**预制体路径 */
    public prefabPath:string;
    /**弹出效果 */
    public popupType:PopupType;
    /**层级类型*/
    public layerType:LayerType;
    /**关闭面板是否销毁*/
    public isDestroy:boolean;
    /**是否显示半透黑底*/
    public isDarkRect:boolean;
    /**是否同步显示加载loading  addLayer后移除loading */
    public isSync:boolean;
    /**透传数据*/
    public data:any;

    /**防止加载中 关闭失败  加载成功后检测 是否为true 为true关闭页面*/
    public closeFailed;

    public constructor(...arg)
    {
        if(arguments.length == 0)
        {
            return;
        }
        this.id = arguments[0];
        this.className = arguments[1];
        this.prefabPath = arguments[2];
        this.popupType = arguments[3];
        this.layerType = arguments[4];
        this.isDestroy = arguments[5];
        this.isDarkRect = arguments[6];
        this.isSync = arguments[7];

    }
}
