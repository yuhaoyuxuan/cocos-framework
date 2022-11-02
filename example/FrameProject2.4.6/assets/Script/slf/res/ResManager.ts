import ObjIdGeneraterUtils from "../utils/ObjIdGeneraterUtils";
/**
 * 资源管理模块
 * 加载完成后会动态新增引用次数
 * @author slf
 */
export module ResManager {
    /**bundle数据 */
    var resMap:Map<string,BundleResData> = new Map();
    /**使用的bundle */
    var useBundleMap:Map<string,string> = new Map();

    /**任务池 */
    var taskPool:ResTask[] = [];
    /**任务列表 */
    var taskList:ResTask[] = [];
    /**执行中的任务 用于取消加载 */
    var loadIn:ResTask[] = [];

    /**最大执行数 */
    var MaxValue = 6;

    /**取消加载
     * 未执行的任务，直接取消执行
     * 执行中的任务，执行完成不会回调
     */
    export function cancelLoad(target:any):void
    {
        let id = target.uuid;
        if(useBundleMap.has(target.uuid)){
            taskList.filter((task)=>{
                task.target.uuid != id;
            });

            loadIn.forEach((task)=>{
                task.isCancel = task.target.uuid == id;
            });
        }
    }
   
    /**
    * 销毁已经动态加载的资源
    */
    export function destroy(target:any):void
    {
        if(useBundleMap.has(target.uuid)){
            cancelLoad(target);
            let bundle = useBundleMap.get(target.uuid);
            useBundleMap.delete(target.uuid);
            resMap.get(bundle).deleteAsset(target);
        }
    }

    export function loadPrefab(url:string,cb:Function,target:any,bundleName:string = "resources"):void
    {
        let task:ResTask = getResTask(url,cb,target,bundleName,cc.Prefab);
        addTask(task);
    }

    export function loadSpriteFrame(url:string,cb:Function,target:any,bundleName:string = "resources"):void
    {
        let task:ResTask = getResTask(url,cb,target,bundleName,cc.SpriteFrame);
        addTask(task);
    }

    export function loadSpriteAtlas(url:string,cb:Function,target:any,bundleName:string = "resources"):void
    {
        let task:ResTask = getResTask(url,cb,target,bundleName,cc.SpriteAtlas);
        addTask(task);
    }

    export function loadAudio(url:string,cb:Function,target:any,bundleName:string = "resources"):void
    {
        let task:ResTask = getResTask(url,cb,target,bundleName,cc.AudioClip);
        addTask(task);
    }


    function addTask(task:ResTask):void
    {
        taskList.push(task);
        if(loadIn.length<MaxValue){
            load();
        }
    }

    function load():void
    {
        let task:ResTask = taskList.shift();
        //缓存的资源
        if(resMap.has(task.bundleName)){
            let asset = resMap.get(task.bundleName).getCacheAsset(task);
            if(asset != null){
                loadComplete(task,asset);
                return;
            }
        }

        loadIn.push(task);
        let reg = /http.?:\/\//;
        if (reg.test(task.url)) {
            cc.assetManager.loadRemote(task.url,parseAsset.bind(this,task));
        } else {
            cc.assetManager.getBundle(task.bundleName).load(task.url,parseAsset.bind(this,task));
        }
    }

    function parseAsset(task:ResTask ,error: Error, asset: cc.Asset):void
    {
        if(error || task.isCancel){
            task.recycle();
            return;
        }

        if(task.type as cc.SpriteFrame){
            asset = new cc.SpriteFrame(asset as cc.Texture2D);
        }

        loadComplete(task,asset);
    }

    function loadComplete(task:ResTask , asset: cc.Asset):void
    {
        resMap.get(task.bundleName).cacheAsset(task,asset);
        task.callback.call(task.target,asset);
        task.recycle();
    }

    function getResTask(url:string,cb:Function,target:any,bundleName:string,type:typeof cc.Asset):ResTask
    {
        let task;
        if(taskPool.length){
            task = taskPool.shift();
        }else{
            task = new ResTask();
        }
        task.init(url,cb,target,bundleName,type);

        if(!resMap.get(bundleName)){
            resMap.set(bundleName,new BundleResData());
        }

        if(!useBundleMap.get(task.target.uuid)){
            useBundleMap.set(task.target.uuid,bundleName);
        }

        return task;
    }
    
    /**数据 */
    class BundleResData{
        /**id对应资源数组 */
        private idToAssetsMap:Map<string,cc.Asset[]> = new Map();
        /**缓存的资源 */
        private urlToAssetMap:Map<string,cc.Asset> = new Map();

        public destroy():void
        {
            this.idToAssetsMap.clear();
            this.urlToAssetMap.clear();
        }

        /**缓存资源，添加资源引用次数 */
        public cacheAsset(task:ResTask,asset:cc.Asset){
            if(asset['resUrl'] != task.url){
                asset['resUrl'] = task.url;
            }
            if(!this.urlToAssetMap.has(asset['resUrl'])){
                this.urlToAssetMap.set(asset['resUrl'],asset);
            }
    
            let assets:cc.Asset[];
            let uuid:string = task.target.uuid;
            if(this.idToAssetsMap.has(uuid)){
                assets = this.idToAssetsMap.get(uuid);
            }else{
                assets = [];
                this.idToAssetsMap.set(uuid,assets);
            }
    
            //同一个id 多次加载同一个资源，只会增加一次引用
            if(assets.indexOf(asset) == -1){
                assets.push(asset);
                asset.addRef();
            }
        }

        /**
         * 获取缓存的资源
         */
        public getCacheAsset(task:ResTask):cc.Asset{
            if(this.urlToAssetMap.has(task.url)){
                return this.urlToAssetMap.get(task.url);
            }
            return null;
        }

        /**删除缓存资源，去除资源引用次数 */
        public deleteAsset(target:any):void
        {
            if(this.idToAssetsMap.has(target.uuid)){
                let assets:cc.Asset[] = this.idToAssetsMap.get(target.uuid);
                this.idToAssetsMap.delete(target.uuid);
                let asset:cc.Asset;
                for(var i=0;i<assets.length;i++){
                    asset = assets[i];
                    if(asset.refCount == 1){
                        this.urlToAssetMap.delete(asset['resUrl']);
                    }
                    asset.decRef();
                }
            }
        }
    }




    /**资源任务 */
    class ResTask{
        /**资源地址 */
        url:string;       
        /**回调 */
        callback:Function;
        /**目标 用于储存资源和删除资源的引用计数 */ 
        target:any;
        /**资源包名字 默认cc.resources */
        bundleName:string; 
        /**资源加载类 */
        type:cc.Asset;
        /**是否取消加载 如果未加载取消加载。 如果加载中，直到加载完成，不会回调通知，直接销毁结果。 */
        isCancel:boolean; 

        /**初始化 */
        public init(url:string,callback:Function,target:any,bundleName:string,type:cc.Asset):void
        {
            this.url = url;
            this.callback = callback;
            this.target = target;
            this.bundleName = bundleName;
            this.type = type;
            this.isCancel = false;
            if(target.uuid == null){
                target.uuid = ObjIdGeneraterUtils.getId;
            }
        }

        /**回收 */
        public recycle():void
        {
            let idx = loadIn.indexOf(this);
            if(idx != -1){
                loadIn.splice(idx,1);
            }
            this.callback = null;
            this.target = null;
            taskPool.push(this);
        }
    }
}