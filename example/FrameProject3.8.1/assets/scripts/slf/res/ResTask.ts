import { Asset } from "cc";
import ObjIdGeneraterUtils from "../utils/ObjIdGeneraterUtils";
import { ResManager } from "./ResManager";

/**资源任务 */
export class ResTask {
    /**资源地址 */
    url: string;
    /**资源类型 */
    type: Asset;
    /**加载资源的持有者 用于储存资源和删除资源的引用计数 */
    owner: any;
    /**回调 */
    callback: Function;
    /**调用回调的目标 */
    target: any;
    /**资源包名字 默认cc.resources */
    bundleName: string;
    /**是否取消加载 如果未加载取消加载。 如果加载中，直到加载完成，不会回调通知，直接销毁结果。 */
    isCancel: boolean;

    /**初始化 */
    public init(url: string, type: Asset, owner: any, callback: Function, target: any, bundleName: string): void {
        this.url = url;
        this.type = type;
        this.owner = owner;
        this.callback = callback;
        this.target = target;
        this.bundleName = bundleName;

        this.isCancel = false;
        if (owner.uuid == null) {
            owner.uuid = ObjIdGeneraterUtils.getId;
        }
    }

    /**
     * 完成资源加载
     * @param asset 
     */
    public complete(asset: Asset): void {
        this.callback?.call(this.target, asset);
    }

    /**回收 */
    public recycle(): void {
        this.owner = null;
        this.callback = null;
        this.target = null;
    }
}