/**
 * 有限状态机 状态接口
 * @author slf
 */
export interface IState {
    /**进入状态 */
    entry(): void
    /**
     * 状态执行中
     * @param dt 上帧间隔 s 
     */
    update(dt: number): void
    /**退出状态 */
    exit(): void
}


