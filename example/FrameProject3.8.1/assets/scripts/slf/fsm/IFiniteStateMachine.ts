
/**
 * 状态机控制器接口
 * @author slf
 */

import { IState } from "./IState"
export interface IFiniteStateMachine {
    /**
     * 当前状态
     */
    currentState: any;

    /**
     * 注册状态
     * @param sName 状态名 
     * @param state 状态类
     */
    register(name: string, state: IState | any): void

    /**
     * 切换状态
     * @param state 
     */
    changeState(state: any): void

    /**
     * 持续执行
     * @param dt 上帧间隔 s
     */
    update(dt: any): void

    /**销毁 */
    onDestroy(): void
}