/**
 * 通用回调接口
 * @author slf
 */
export interface ICallback {
    /**回调函数 */
    callback(...args): void;
    /**回调目标 */
    thisArg?: any;
    /**透传参数 */
    args?: any;
}

