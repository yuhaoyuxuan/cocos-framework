import { Asset, assetManager } from "cc";
import { Singleton } from "../common/Singleton";
import { BundleResData } from "./BundleResData";
import { ResTask } from "./ResTask";

/**
 * 资源管理模块
 * 加载完成后会动态新增引用次数
 * @author slf
 */
export class ResManager extends Singleton {
    /**bundle数据 */
    private resMap: Map<string, BundleResData> = new Map();
    /**使用的bundle */
    private useBundleMap: Map<string, string> = new Map();

    /**任务池 */
    private taskPool: ResTask[] = [];
    /**任务列表 */
    private taskList: ResTask[] = [];
    /**执行中的任务 用于取消加载 */
    private loadIn: ResTask[] = [];

    /**最大加载 */
    private MaxValue = 10;

    /**
     * 取消加载
     * 未执行的任务，直接取消执行
     * 执行中的任务，执行完成不会回调
     */
    public cancelLoad(owner: any): void {
        let id = owner.uuid;
        if (this.useBundleMap.has(id)) {
            this.taskList.filter((task) => {
                task.target.uuid != id;
            });

            this.loadIn.forEach((task) => {
                task.isCancel = task.target.uuid == id;
            });
        }
    }

    /**
    * 销毁已经动态加载的资源
    */
    public destroy(target: any): void {
        if (this.useBundleMap.has(target.uuid)) {
            this.cancelLoad(target);
            let bundle = this.useBundleMap.get(target.uuid);
            this.useBundleMap.delete(target.uuid);
            this.resMap.get(bundle).deleteAsset(target);
        }
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
        //获取缓存的资源
        if (this.resMap.has(task.bundleName)) {
            let asset = this.resMap.get(task.bundleName).getCacheAsset(task);
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
            assetManager.getBundle(task.bundleName).load(task.url, this.parseAsset.bind(this, task));
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
        this.resMap.get(task.bundleName).cacheAsset(task, asset);
        task.complete(asset);
        this.recycleResTask(task);

        this.startLoad();
    }


    /**获取资源任务 */
    private getResTask(url: string, type: Asset, owner: any, callback: Function, target: any, bundleName: string): ResTask {
        let task: ResTask;
        if (this.taskPool.length) {
            task = this.taskPool.shift();
        } else {
            task = new ResTask();
        }
        task.init(url, type, owner, callback, target, bundleName);

        if (!this.resMap.get(bundleName)) {
            this.resMap.set(bundleName, new BundleResData());
        }

        if (!this.useBundleMap.get(task.target.uuid)) {
            this.useBundleMap.set(task.target.uuid, bundleName);
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
        this.taskPool.push(task);
    }
}