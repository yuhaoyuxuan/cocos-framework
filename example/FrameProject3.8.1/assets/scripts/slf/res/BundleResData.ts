import { Asset } from "cc";
import { ResTask } from "./ResTask";
/**包数据记录 */
export class BundleResData {
    /**id对应资源数组 */
    private idToAssetsMap: Map<string, Asset[]> = new Map();
    /**缓存的资源 */
    private urlToAssetMap: Map<string, Asset> = new Map();

    public destroy(): void {
        this.idToAssetsMap.clear();
        this.urlToAssetMap.clear();
    }

    /**
     * 缓存资源，添加资源引用次数
     * @param task 任务
     * @param asset 资源
     */
    public cacheAsset(task: ResTask, asset: Asset) {
        if (asset['resUrl'] != task.url) {
            asset['resUrl'] = task.url;
        }
        if (!this.urlToAssetMap.has(asset['resUrl'])) {
            this.urlToAssetMap.set(asset['resUrl'], asset);
        }

        let assets: Asset[];
        let uuid: string = task.owner.uuid;
        if (this.idToAssetsMap.has(uuid)) {
            assets = this.idToAssetsMap.get(uuid);
        } else {
            assets = [];
            this.idToAssetsMap.set(uuid, assets);
        }

        //同一个id 多次加载同一个资源，只会增加一次引用
        if (assets.indexOf(asset) == -1) {
            assets.push(asset);
            asset.addRef();
        }
    }

    /**
     * 获取缓存的资源
     * @param task 
     * @returns 
     */
    public getCacheAsset(task: ResTask): Asset {
        if (this.urlToAssetMap.has(task.url)) {
            return this.urlToAssetMap.get(task.url);
        }
        return null;
    }


    /**
     * 删除缓存资源，去除资源引用次数 
     * @param owner 资源持有者
     */
    public deleteAsset(owner: any): void {
        if (this.idToAssetsMap.has(owner.uuid)) {
            let assets: Asset[] = this.idToAssetsMap.get(owner.uuid);
            this.idToAssetsMap.delete(owner.uuid);
            let asset: Asset;
            for (var i = 0; i < assets.length; i++) {
                asset = assets[i];
                if (asset.refCount == 1) {
                    this.urlToAssetMap.delete(asset['resUrl']);
                }
                asset.decRef();
            }
        }
    }
}

