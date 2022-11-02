import UIData from "./UIData";

/**
* 界面接口
* @author slf
*/
export interface IUI
{
    /**ui数据 */
    uiData:UIData;
    /**初始化事件 只会调用一次 */
    initEvent();
    /**初始化视图 每次打开都会调用 */ 
    initView();
    /**移除面板 每次移除都会调用 */
    removeView();
    /**销毁面板 只会调用一次 */
    destroyView();
}

/**
* 预加载接口
* @author slf
*/
export interface IPreload
{
    /**预加载 、数据通信 准备工作 子类 重写 */
    preload(cb:Function);
    /**预加载完成 */
    preloadComplete();
    /**预加载超时 */
    preloadTimeout();
}


