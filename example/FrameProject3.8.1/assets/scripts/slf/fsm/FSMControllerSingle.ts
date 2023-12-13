import { _decorator } from 'cc';
import { IState } from './IState';
import { FSMController } from './FSMController';
const { ccclass, property } = _decorator;

/**
 * 有限状态机控制器 单一执行者
 * Finite State Machine(FSM)
 * @author slf
 */

@ccclass('FSMControllerSingle')
export class FSMControllerSingle<T> extends FSMController<T> {
    private action: any;
    constructor(action: any) {
        super();
        this.action = action;
    }

    public register(name: T | any): void {
        let state = {
            entry: this.getFunction("entry", name),
            update: this.getFunction("update", name),
            exit: this.getFunction("exit", name)
        };

        if (this.stateMap.has(name)) {
            console.error("FSM register duplicate state " + name);
            return;
        }
        this.stateMap.set(name, state);
    }

    /**
     * 获取方法   entry_xxxx
     * @param stateName 状态名 
     * @param actionName 方法名
     * @param param 参数
     */
    public getFunction(actionName: string, stateName: any): any {
        let funName: string = actionName + "_" + stateName?.toString();
        let fun: Function = this.action[funName];
        if (!fun) {
            console.log("FSM register none function name=" + funName);
            return () => { };
        }
        return fun.bind(this.action);
    }

}