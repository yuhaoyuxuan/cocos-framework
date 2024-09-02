import { Component } from "cc"
/**
 * 扩展cc.Component(组件基类)原型
 */
declare module "cc" {
    interface Component {
        /**重写销毁前调用方法 */
        overridePreDestroy(): void
        /**销毁前调用 执行onDestroy前调用 子类可以重写 实现一些销毁方法 */
        preDestroy(): void
    }
}
Component.prototype.preDestroy = function () { };
/**重写销毁方法 */
Component.prototype.overridePreDestroy = Component.prototype._onPreDestroy;
Component.prototype._onPreDestroy = function () {
    this.preDestroy();
    this.overridePreDestroy();
};