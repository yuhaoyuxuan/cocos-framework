import ObjPoolUtils from "../utils/ObjPoolUtils";

/**
 * 定时器数据
 * @author slf
 */
export class TimerData {
    /**间隔调用时间 s */
    public interval: number;
    /**回调函数 */
    public callback: Function;
    /**回调函数目标 */
    public target: any;
    /**透传参数 */
    public param: any;
    /**循环次数 -1无线循环 */
    public loop: number;


    /**当前时间 随着时间而变化*/
    public currInterval;

    /**
     * 初始化
     * @param interval 间隔时间 s
     * @param callback 回调函数
     * @param target 回调目标
     * @param param 回调参数
     * @param loop 循环次数 -1无线循环
     */
    public init(interval: number, callback: Function, target: any, param: any, loop: number): void {
        this.interval = interval;
        this.callback = callback;
        this.target = target;
        this.param = param;
        this.loop = loop;

        this.currInterval = interval;
    }

    public recycle(): void {
        this.callback = null;
        this.target = null;
        this.param = null;

        ObjPoolUtils.recycleObj(this);
    }
}