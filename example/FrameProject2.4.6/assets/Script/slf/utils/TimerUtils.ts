import ObjIdGeneraterUtils from "./ObjIdGeneraterUtils";
import ObjPoolUtils from "./ObjPoolUtils";

export class TimerData {
    delay?: number;       //延迟时间 秒
    callback?: Function;  //回调函数
    target?: any;         //作用域目标
    param?: any;          //透传参数
    loop?: boolean;       //是否循环 默认false

    tempDelay?: number;   //临时的 用来计算是否到达延迟时间

    public init(delay,callback,target,param,loop):void
    {
        this.delay = delay;
        this.callback = callback;
        this.target = target;
        this.param = param;
        this.loop = loop;

        this.tempDelay = delay;
    }

    public recycle():void
    {
        this.callback = null;
        this.target = null;
        this.param = null;
        ObjPoolUtils.recycleObj(this);
    }
}

/**
 * 定时器工具 秒为单位
 * @author slf
 */
export default class TimerUtils {
    private static _instance: TimerUtils = new TimerUtils();
    /**注册定时器列表 */
    private timerEventList: TimerData[] = [];
    private registerMap:Object = {};

    static intervalS:number = 1/30;    //间隔时间秒
    private time:number;

    /**
     * 注册定时器回调
     * @param dealy     延迟调用时间秒
     * @param callback  回调函数
     * @param target    作用域目标
     * @param param     回调携带参数
     * @param loop      是否循环，默认false 执行过后移除 
     */
    public static register(delay: number, callback: Function, target: any, param?: any, loop?: boolean): void {
        let data = ObjPoolUtils.getObj(TimerData);
        data.init(delay,callback,target,param,loop);
        this._instance.add(data);
    }

    /**
     * 移除注册 如果未传入回调方法，移除全部
     * @param target 作用域目标
     * @param callback 回调方法
     */
    public static unRegister(target: any, callback?: Function): void {
        this._instance.remove(target,callback);
    }

    /**
     * 添加
     * @param data 
     */
    private add(timer: TimerData): void {
        this.remove(timer.target,timer.callback);

        let id = timer.target.uuid;
        if(!id){
            id = ObjIdGeneraterUtils.getId;
            timer.target.uuid = id;
        }
        if(!this.registerMap[id]){
            this.registerMap[id] = 1;
        }else{
            this.registerMap[id] ++;
        }
        this.timerEventList.push(timer);

        if (!this.time) {
            this.time = setInterval(this.updateList.bind(this),TimerUtils.intervalS*1000);
        }
    }

    /**
     * 移除
     * @param data 
     */
    private remove(target: any, callback: Function): void {
        let timer;
        let all = callback == null;
        if(!this.isHave(target)){
            return;
        }

        if (all) {
            for(var i = 0;i<this.timerEventList.length;i++){
                timer = this.timerEventList[i];
                if(timer.target == target){
                    this.removeTimer(i);
                    if(i>0){
                        i--;
                    }
                    if(!this.isHave(target)){
                        return;
                    }
                }
            }
        } else {
            for(var i = 0;i<this.timerEventList.length;i++){
                timer = this.timerEventList[i];
                if(timer.target == target && callback == timer.callback){
                    this.removeTimer(i);
                    return;
                }
            }
        }
    }

    private removeTimer(idx:number):void
    {
        let timer:TimerData = this.timerEventList.splice(idx,1)[0];
        this.registerMap[timer.target.uuid]--;

        timer.recycle();
    }

    private isHave(target:any):boolean
    {
        if(this.registerMap[target.uuid] && this.registerMap[target.uuid]>0){
            return true;
        }
        return false;
    }

    /**更新间隔 */
    private updateList(dt: number): void {
        let timer;
        let intervalS = TimerUtils.intervalS;
        for(var i = 0;i<this.timerEventList.length;i++){
            timer = this.timerEventList[i];
            timer.tempDelay -= intervalS;

            if (timer.tempDelay <= 0) {
                let {callback,target,param} = timer;
                if (!timer.loop) {
                    this.removeTimer(i);
                    if(i>0){
                        i--;
                    }
                } else {
                    timer.tempDelay = timer.delay;
                }
                callback.call(target, param);
            }
        }

        if (this.timerEventList.length == 0 && this.time) {
            clearInterval(this.time);
            this.time = null;
        }
    }
}
