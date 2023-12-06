/**
* 预加载接口
* @author slf
*/
export interface IPreload {
    /**预加载 、数据通信 准备工作 子类 重写 */
    preload(cb: Function);
    /**预加载完成 */
    preloadComplete();
    /**预加载超时 */
    preloadTimeout();
}

