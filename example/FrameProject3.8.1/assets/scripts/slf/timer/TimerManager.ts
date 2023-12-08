import { SingletonComponent } from "../common/SingletonComponent";
import ObjIdGeneraterUtils from "../utils/ObjIdGeneraterUtils";
import ObjPoolUtils from "../utils/ObjPoolUtils";
import { TimerData } from "./TimerData";

/**
 * 定时器管理 单位s
 * @author slf
 */
export class TimerManager extends SingletonComponent {
    /**注册定时器列表 */
    private timerEventList: TimerData[] = [];
    /**id对应的定时器数量 */
    private idToCount: { [key: string]: number } = {};

    /**
    * 注册1次定时器回调
    * @param interval 间隔时间单位s
    * @param callback 回调函数
    * @param target 回调目标
    * @param param 透传参数 回调的时候会携带
    */
    public once(interval: number, callback: Function, target: any, param?: any): void {
        this.on(interval, callback, target, param, 1);
    }

    /**
     * 注册循环定时器回调
     * @param interval 间隔时间单位s
     * @param callback 回调函数
     * @param target 回调目标
     * @param param 透传参数 回调的时候会携带
     * @param loop 循环次数 默认-1 循环调用
     */
    public on(interval: number, callback: Function, target: any, param?: any, loop: number = -1): void {
        this.register(interval, callback, target, param, loop);
    }

    /**
     * 取消单个定时器
     * @param callback 回调函数
     * @param target 回调函数目标
     */
    public off(callback: Function, target: any): void {
        this.unRegister(target, callback);
    }
    /**
     * 取消目标所有定时器
     * @param target 目标
     */
    public targetOff(target: any): void {
        this.unRegister(target);
    }

    /**
     * 刷新定时器
     * @param deltaTime 上帧间隔 s 
     */
    update(deltaTime: number) {
        if (this.timerEventList.length == 0) {
            return;
        }

        let closeList: TimerData[] = this.timerEventList.filter(timer => {
            timer.currInterval -= deltaTime;
            if (timer.currInterval <= 0) {
                if (timer.loop > 0) {
                    timer.loop--;
                }
                timer.currInterval = timer.interval;
                timer.callback.call(timer.target, timer.param);
            }
            return timer.loop == 0;
        });

        closeList.forEach(timer => {
            this.unRegister(timer.target, timer.callback);
        });
    }

    /**
    * 注册定时器回调
    * @param interval  间隔时间 s
    * @param callback  回调函数
    * @param target    作用域目标
    * @param param     回调携带参数
    * @param loop      循环次数 -1无线循环 >0 循环次数 =0后移除定时器
    */
    private register(interval: number, callback: Function, target: any, param?: any, loop: number = 1): void {
        let timer = ObjPoolUtils.getObj(TimerData);
        timer.init(interval, callback, target, param, loop);

        //防止重复添加
        this.unRegister(timer.target, timer.callback);

        let id = timer.target.uuid;
        if (!id) {
            id = ObjIdGeneraterUtils.getId;
            timer.target.uuid = id;
        }

        if (!this.idToCount[id]) {
            this.idToCount[id] = 1;
        } else {
            this.idToCount[id]++;
        }
        this.timerEventList.push(timer);
    }

    /**
     * 移除注册 如果未传入回调方法，移除全部
     * @param target 作用域目标
     * @param callback 回调方法
     */
    private unRegister(target: any, callback?: Function): void {
        if (!this.isHave(target)) {
            return;
        }

        let all = callback == null;
        let len = this.timerEventList.length - 1;
        let timer: TimerData;
        if (all) {
            for (let i = len; i >= 0; i--) {
                timer = this.timerEventList[i];
                if (timer.target == target) {
                    this.removeTimer(i);
                    if (!this.isHave(target)) {
                        return;
                    }
                }
            }
        } else {
            for (let i = len; i >= 0; i--) {
                timer = this.timerEventList[i];
                if (timer.target == target && callback == timer.callback) {
                    this.removeTimer(i);
                    return;
                }
            }
        }
    }


    private removeTimer(index: number): void {
        let timer: TimerData = this.timerEventList.splice(index, 1)[0];
        this.idToCount[timer.target.uuid]--;
        timer.recycle();
    }

    private isHave(target: any): boolean {
        if (target && this.idToCount[target.uuid] && this.idToCount[target.uuid] > 0) {
            return true;
        }
        return false;
    }
}


