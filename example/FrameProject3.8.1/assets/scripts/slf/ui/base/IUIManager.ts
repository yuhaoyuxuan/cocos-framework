import { IUI } from "./IUI";
import { Node } from "cc";

/**ui管理接口 */
export interface IUIManager {
    /**
     * 初始化根容器
     * @param uiRoot 根节点
     */
    initRoot(uiRoot: Node): void
    /**
     * 打开ui界面
     * @param uiId id 
     * @param data 透传数据
     */
    openUI(uiId: number, data?: any): void
    /**
     * 关闭ui界面
     * @param uiId id或ui数据 
     */
    closeUI(uiId: number | IUI): void
    /**
     * 关闭所有ui界面
     */
    closeAllUI(): void
}


