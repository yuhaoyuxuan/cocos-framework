import ObjIdGeneraterUtils from "../utils/ObjIdGeneraterUtils";
import ObjPoolUtils from "../utils/ObjPoolUtils";

/**订阅数据 */
export class SubscribeData{
    /**订阅的消息 */
    public message:string;
    /**发布回调 */
    public callback:Function;
    /**回调目标 */
    public target:any;
    /**是否执行一次 移出订阅 */
    public once:boolean;

    public init(message,callback,target,once):void
    {
        this.message = message;
        this.callback = callback;
        this.target = target;
        this.once = once;
    }

    public recycle() {
        this.callback = null;
        this.target = null;
        ObjPoolUtils.recycleObj(this);
    }
}

/**
 * 消息事件 采用发布订阅模式
 */
export default class PubSub{
    private static _messageToSubMap:Map<string,SubscribeData[]> = new Map();
    private static _idToMessageMap:Map<string,string[]> = new Map();
    
    /**
	 * 注册订阅
	 * @param message 订阅的消息
	 * @param callback 回调方法
	 * @param target 回调作用域
	 * @param once 是否执行一次后移除订阅，默认false
	 */
	public static register(message:string,callback:Function,target:any,once?:boolean):void
	{
        let id = target.uuid;
        if(!id){
            id = ObjIdGeneraterUtils.getId;
            target.uuid = id;
        }
        this.unRegister(target,message);


        let data = ObjPoolUtils.getObj(SubscribeData);
        data.init(message,callback,target,once);

        let subList:SubscribeData[];
        if(this._messageToSubMap.has(message)){
            subList = this._messageToSubMap.get(message);
        }else{
            subList = [];
            this._messageToSubMap.set(message,subList);
        }
        subList.push(data);
	}

	/**
	 * 取消注册 如果未传入订阅的消息，将取消目标的所有注册
	 * @param target 目标
	 * @param message 订阅的消息
	 */
	public static unRegister(target:any,message?:string):void
	{
        let messageList:string[];
        let subList:SubscribeData[];
        let subData:SubscribeData;
        if(message == null){
            if(this._idToMessageMap.has(target.uuid)){
                messageList = this._idToMessageMap.get(target.uuid);
                this._idToMessageMap.delete(target.uuid);
                for(var i=0;i<messageList.length;i++){
                    this.unRegister(target,message);
                }
            }
        }else if(this._messageToSubMap.has(message)){
            subList = this._messageToSubMap.get(message);
            for(var i=0;i<subList.length;i++){
                subData = subList[i];
                if(subData.message == message && subData.target == target){
                    subList.splice(i,1);
                    if(this._idToMessageMap.has(subData.target.uuid)){
                        messageList = this._idToMessageMap.get(subData.target.uuid);
                        let idx = messageList.indexOf(message);
                        if(idx!=-1){
                            messageList.splice(idx,1);
                        }
                    }
                    subData.recycle();
                    if(i>0){
                        i--;
                    }
                }
            }
        }
	}

    /**
     * 发布订阅消息
     */
	public static publish(message:string,...arg):void
	{
        if(this._messageToSubMap.has(message)){
            let subList:SubscribeData[] = this._messageToSubMap.get(message);
            let subData:SubscribeData;
            for(var i = 0;i<subList.length;i++){
                subData = subList[i];
                subData.callback.apply(subData.target,arg);

                if(subData.once){
                    subList.splice(i,1);
                    if(this._idToMessageMap.has(subData.target.uuid)){
                        let messageList:string[] = this._idToMessageMap.get(subData.target.uuid);
                        let idx = messageList.indexOf(message);
                        if(idx!=-1){
                            messageList.splice(idx,1);
                        }
                    }
                    subData.recycle();
                    if(i>0){
                        i--;
                    }
                }
            }
        }
	}
}