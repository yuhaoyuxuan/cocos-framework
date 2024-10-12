import { TimerManager } from "../timer/TimerManager";
import { IState } from "./IState";
import { IFiniteStateMachine } from "./IFiniteStateMachine";

/**
 * 有限状态机控制器
 * Finite State Machine(FSM)
 * @author slf
 */
export class FSMController<T> implements IFiniteStateMachine {
    /**
     * 状态集合
     */
    protected stateMap: Map<number | string | any, IState> = new Map();
    currentState: IState;
    currentStateName: T;

    constructor() {
        TimerManager.Instance().on(0, this.update, this);
    }
    /**
     * 注册状态
     * @param name 状态名 
     * @param state 状态类
     */
    public register(name: T | number, state: IState): void {
        if (this.stateMap.has(name)) {
            console.error("register duplicate state " + name);
            return;
        }
        this.stateMap.set(name, state);
    }

    /**
     * 改变状态
     * @param name 状态名
     */
    public changeState(name: T): void {
        if (this.currentStateName == name) {
            console.error("changeState same name " + name)
            return;
        }


        this.currentState?.exit();
        if (!this.stateMap.has(name)) {
            console.error("change none state " + name);
            return;
        }
        this.currentStateName = name;
        this.currentState = this.stateMap.get(name);
        this.currentState.entry();
    }

    /**
     * 持续更新状态机执行中状态
     */
    public update(dt: any): void {
        this.currentState?.update(dt);
    }

    /**销毁状态机 */
    public onDestroy(): void {
        TimerManager.Instance().off(this.update, this);
        this.currentState = null;
        this.stateMap.forEach(v => {
            v.onDestroyState && v.onDestroyState();
        })
        this.stateMap.clear();
    }
}


