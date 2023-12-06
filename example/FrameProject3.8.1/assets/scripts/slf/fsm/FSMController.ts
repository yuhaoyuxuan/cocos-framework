import { IState } from "./IState";

/**
 * 有限状态机控制器
 * @author slf
 */
export class FSMController {
    /**
     * 状态集合
     */
    private stateMap: Map<number | string, IState> = new Map();
    /**
     * 当前状态
     */
    private currentState: IState;

    /**
     * 注册状态
     * @param sName 状态名 
     * @param state 状态类
     */
    public register(sName: string | number, state: IState): void {
        if (this.stateMap.has(sName)) {
            console.error("register duplicate state " + sName);
            return;
        }
        this.stateMap.set(sName, state);
    }

    /**
     * 改变状态
     * @param sName 状态名
     */
    public changeState(sName: string): void {
        this.currentState?.exit();
        if (!this.stateMap.has(sName)) {
            console.error("change none state " + sName);
            return;
        }
        this.currentState = this.stateMap.get(sName);
        this.currentState.entry();
    }

    /**
     * 持续更新状态机执行中状态
     * @param dt 上帧间隔 s
     */
    public update(dt: number): void {
        this.currentState?.update(dt);
    }
}


