import UIData from "./UIData";

/**
* 界面接口
* @author slf
*/
export interface IUI {
    /** 
     * ui数据 ui动态加载资源的持有者
     * 加载ui预制体的时候ui组件还未初始化，引用持有者采用uiData
     * 销毁资源的时候传入uiData
     */
    uiData: UIData;
    /**初始化事件 只会调用一次 */
    initEvent();
    /**初始化视图 每次打开都会调用 */
    initView();
    /**移除面板 每次移除都会调用 */
    removeView();
    /**销毁面板 只会调用一次 */
    destroyView();
}



