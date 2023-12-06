import ObjPoolUtils from "../utils/ObjPoolUtils";

/**
 * 订阅者数据
 * @author slf
 */
export class EventData {
    /**订阅的消息 */
    public message: string;
    /**发布回调 */
    public callback: Function;
    /**回调目标 */
    public target: any;
    /**是否执行一次 移出订阅 */
    public once: boolean;

    public init(message: string, callback: Function, target: any, once: boolean): void {
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

