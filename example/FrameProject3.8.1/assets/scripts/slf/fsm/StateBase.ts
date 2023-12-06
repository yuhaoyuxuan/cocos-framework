import { IState } from "./IState";

/**
 * 有限状态机 抽象状态基类
 * @author slf
 */
export abstract class StateBase implements IState {
    public entry(): void { }
    public update(dt: number): void { }
    public exit(): void { }
}


