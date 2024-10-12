import { Asset, AssetManager, assetManager } from "cc";
import { Singleton } from "../common/Singleton";
import { BundleResData } from "./BundleResData";
import { ResTask } from "./ResTask";
import ObjPoolUtils from "../utils/ObjPoolUtils";

/**
 * 资源管理模块
 * 加载完成后会动态新增引用次数
 * @author slf
 */
export class ResManager extends Singleton {
    /**bundle数据 */
    private bundleResMap: Map<string, BundleResData> = new Map();
    /**使用的bundle */
    private useBundleMap: Map<string, string> = new Map();

    /**待执行任务列表 */
    private taskList: ResTask[] = [];
    /**执行中的任务 */
    private loadIn: ResTask[] = [];

    /**最大加载 */
    private MaxValue = 10;

    /**
     * 加载包数据
     * @param name 包名 
     * @param callback 完成回调
     */
    public loadBundle(name: string, callback: (bundle: AssetManager.Bundle) => void, target?: any): void {
        if (this.bundleResMap.has(name)) {
            callback.call(target, this.bundleResMap.get(name).bundle);
            return;
        }

        assetManager.loadBundle(name, (err, bundle: AssetManager.Bundle) => {
            if (err) {
                console.error(err)
                callback.call(target, err);
                return;
            }
            this.bundleResMap.set(name, new BundleResData(bundle));
            callback.call(target, bundle);
        })
    }

    /**
     * 销毁包数据
     * @param name 
     */
    public destroyBundle(name: string): void {
        if (!this.bundleResMap.has(name)) {
            console.error("destroyBundle none bundle data name=" + name);
            return;
        }
        this.bundleResMap.get(name).destroy();
        this.bundleResMap.delete(name);
    }


    /**
     * 取消加载
     * 未执行的任务，直接取消执行
     * 执行中的任务，执行完成不会回调
     * @param owner 持有者
     */
    public cancelLoad(owner: any): void {
        let id = owner.uuid;
        if (this.useBundleMap.has(id)) {
            for (let i = this.taskList.length - 1; i >= 0; i--) {
                if (this.taskList[i].target.uuid == id) {
                    this.recycleResTask(this.taskList.splice(i, 1)[0]);
                }
            }

            this.loadIn.forEach(task => {
                task.isCancel = task.target.uuid == id;
            });
        }
    }

    /**
    * 销毁已经动态加载的资源
     * @param owner 持有者
    */
    public destroy(owner: any): void {
        if (this.useBundleMap.has(owner.uuid)) {
            this.cancelLoad(owner);
            let bundle = this.useBundleMap.get(owner.uuid);
            this.useBundleMap.delete(owner.uuid);
            this.bundleResMap.get(bundle).deleteAsset(owner);
        }
    }

    /**
     * 预加载资源
     * @param url 资源路径
     * @param type 资源类型
     * @param bundleName 包名 默认resources
     */
    public preLoad(url: string | string[], bundleName: string = "resources"): void {
        let bundle = assetManager.getBundle(bundleName);
        if (!bundle) {
            console.error("none bundle data name=" + bundleName);
            return;
        }
        bundle.preload(url)
    }

    /**
     * 加载资源
     * @param url 资源路径
     * @param type 资源类型
     * @param owner 持有者 用于储存资源和删除资源的引用计数
     * @param callback 完成回调
     * @param target 调用回调的目标
     * @param bundleName 包名 默认resources
     */
    public load<T>(url: string, type: Asset | any, owner: any, callback: (asset: T) => void, target?: unknown, bundleName: string = "resources"): void {
        let task: ResTask = this.getResTask(url, type, owner, callback, target, bundleName);
        this.taskList.push(task);
        this.startLoad();
    }


    private startLoad(): void {
        if (this.loadIn.length >= this.MaxValue || this.taskList.length == 0) {
            return;
        }

        let task: ResTask = this.taskList.shift();
        let bRes: BundleResData = this.bundleResMap.get(task.bundleName);
        //获取缓存的资源
        if (bRes) {
            let asset = bRes.getCacheAsset(task);
            if (asset != null) {
                this.loadComplete(task, asset);
                return;
            }
        }

        this.loadIn.push(task);
        let reg = /http.?:\/\//;
        if (reg.test(task.url)) {
            assetManager.loadRemote(task.url, this.parseAsset.bind(this, task));
        } else {
            if (!bRes) {
                this.loadBundle(task.bundleName, bundle => {
                    bundle?.load(task.url, task.type, this.parseAsset.bind(this, task));
                });
                return;
            }
            bRes.bundle.load(task.url, task.type, this.parseAsset.bind(this, task));
        }
    }

    /**
     * 解析资源
     * @param task 
     * @param error 
     * @param asset 
     * @returns 
     */
    private parseAsset(task: ResTask, error: Error, asset: Asset): void {
        if (error || task.isCancel) {
            error && console.error("parseAsset error = ", error);
            this.recycleResTask(task);
            return;
        }
        this.loadComplete(task, asset);
    }

    /**
     * 加载完成
     * @param task 
     * @param asset 
     */
    private loadComplete(task: ResTask, asset: Asset): void {
        this.bundleResMap.get(task.bundleName).cacheAsset(task, asset);
        task.complete(asset);
        this.recycleResTask(task);

        this.startLoad();
    }


    /**获取资源任务 */
    private getResTask(url: string, type: Asset, owner: any, callback: Function, target: any, bundleName: string): ResTask {
        let task: ResTask = ObjPoolUtils.getObj(ResTask)
        task.init(url, type, owner, callback, target, bundleName);

        if (!this.bundleResMap.get(bundleName)) {
            let bundle = assetManager.getBundle(bundleName);
            if (!bundle) {
                console.error("none bundle data name=" + bundleName);
                return;
            }
            this.bundleResMap.set(bundleName, new BundleResData(bundle));
        }

        if (!this.useBundleMap.get(task.owner.uuid)) {
            this.useBundleMap.set(task.owner.uuid, bundleName);
        }
        return task;
    }

    /**回收任务 */
    private recycleResTask(task: ResTask): void {
        let idx = this.loadIn.indexOf(task);
        if (idx != -1) {
            this.loadIn.splice(idx, 1);
        }
        task.recycle();
        ObjPoolUtils.recycleObj(task);
    }
}