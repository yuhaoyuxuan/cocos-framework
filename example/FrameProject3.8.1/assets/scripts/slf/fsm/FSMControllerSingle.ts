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
export class FSMControllerSingle extends FSMController {
    public register(name: string, stateComponent: any): void {
        let state = {
            entry: this.getFunction(stateComponent, "entry", name),
            update: this.getFunction(stateComponent, "update", name),
            exit: this.getFunction(stateComponent, "exit", name)
        };

        if (this.stateMap.has(name)) {
            console.error("register duplicate state " + name);
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
    public getFunction(action: any, actionName: string, stateName: any,): any {
        let funName:string = actionName + "_" + stateName?.toString();
        let fun: Function = action[funName];
        if (!fun) {
            console.warn("register none function name=" + funName)
        }
        return fun;
    }

}