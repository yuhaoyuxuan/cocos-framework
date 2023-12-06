import { Singleton } from "../common/Singleton";
import ObjIdGeneraterUtils from "../utils/ObjIdGeneraterUtils";
import ObjPoolUtils from "../utils/ObjPoolUtils";
import { EventData } from "./EventData";

/**
 * 消息事件管理 采用发布订阅模式
 * @author slf
 */
export default class EventManager extends Singleton {
    /**消息对应的订阅者列表 */
    private _messageToSubMap: Map<string, EventData[]> = new Map();
    /**订阅者id持有的消息列表 */
    private _idToMessageMap: Map<string, string[]> = new Map();
    /**
     * 监听事件
     * @param message 事件消息
     * @param callback 回调函数
     * @param target 目标回调函数
     */
    public on(message: string, callback: Function, target: any): void {
        this.register(message, callback, target);
    }
    /**
     * 单次监听事件 执行一次后自动销毁
     * @param message 事件消息
     * @param callback 回调函数
     * @param target 目标回调函数
     */
    public once(message: string, callback: Function, target: any): void {
        this.register(message, callback, target, true);
    }
    /**
     * 取消监听
     * @param message 事件消息
     * @param target 目标
     */
    public off(message: string, target: any): void {
        this.unRegister(target, message);
    }
    /**
     * 取消目标所有事件监听
     * @param target 目标
     */
    public targetOff(target: any): void {
        this.unRegister(target);
    }

    /**
     * 派发事件
     * @param message 事件消息
     * @param arg 参数
     */
    public emit(message: string, ...arg): void {
        this.publish(message, arg);
    }


    /**
     * 注册订阅
     * @param message 订阅的消息
     * @param callback 回调方法
     * @param target 回调作用域
     * @param once 是否执行一次后移除订阅，默认false
     */
    private register(message: string, callback: Function, target: any, once?: boolean): void {
        let id = target.uuid;
        if (!id) {
            id = ObjIdGeneraterUtils.getId;
            target.uuid = id;
        }
        this.unRegister(target, message);


        let data = ObjPoolUtils.getObj(EventData);
        data.init(message, callback, target, once);

        let subList: EventData[];
        if (this._messageToSubMap.has(message)) {
            subList = this._messageToSubMap.get(message);
        } else {
            subList = [];
            this._messageToSubMap.set(message, subList);
        }
        subList.push(data);
    }

    /**
     * 取消注册 如果未传入订阅的消息，将取消目标的所有注册
     * @param target 目标
     * @param message 订阅的消息
     */
    private unRegister(target: any, message?: string): void {
        let messageList: string[];
        let subList: EventData[];
        let subData: EventData;
        if (message == null) {
            if (this._idToMessageMap.has(target.uuid)) {
                messageList = this._idToMessageMap.get(target.uuid);
                this._idToMessageMap.delete(target.uuid);
                for (var i = 0; i < messageList.length; i++) {
                    this.unRegister(target, message);
                }
            }
        } else if (this._messageToSubMap.has(message)) {
            subList = this._messageToSubMap.get(message);
            let len = subList.length - 1;
            for (let i = len; i >= 0; i--) {
                subData = subList[i];
                if (subData.message == message && subData.target == target) {
                    subList.splice(i, 1);
                    if (this._idToMessageMap.has(subData.target.uuid)) {
                        messageList = this._idToMessageMap.get(subData.target.uuid);
                        let idx = messageList.indexOf(message);
                        if (idx != -1) {
                            messageList.splice(idx, 1);
                        }
                    }
                    subData.recycle();
                }
            }
        }
    }

    /**
     * 发布订阅消息
     */
    private publish(message: string, ...arg): void {
        if (this._messageToSubMap.has(message)) {
            let subList: EventData[] = this._messageToSubMap.get(message);
            let subData: EventData;

            let len = subList.length - 1;

            for (let i = len; i >= 0; i--) {
                subData = subList[i];
                subData.callback.apply(subData.target, arg);

                if (subData.once) {
                    subList.splice(i, 1);
                    if (this._idToMessageMap.has(subData.target.uuid)) {
                        let messageList: string[] = this._idToMessageMap.get(subData.target.uuid);
                        let idx = messageList.indexOf(message);
                        if (idx != -1) {
                            messageList.splice(idx, 1);
                        }
                    }
                    subData.recycle();
                }
            }
        }
    }
}