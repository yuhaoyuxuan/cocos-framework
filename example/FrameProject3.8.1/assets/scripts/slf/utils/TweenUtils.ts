import { _decorator, Component, Node, Tween, tween, UIOpacity, v3, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 缓动工具
 * @author slf
 */

@ccclass('TweenUtils')
export class TweenUtils {
    /**
     * 滚动数字
     * @param n1 当前值
     * @param n2 目标值
     * @param duration 持续时间
     * @param update 更新当前值
     * @param complete 完成回调
     * @returns 
     */
    public static toNumber(n1: number, n2: number, duration: number, update: (value: number) => void, complete?: Function): Tween<Object> {
        let obj = { value: n1 };
        return tween(obj).to(duration, { value: n2 }, {
            onUpdate: (target: { value: number }, ratio) => {
                update(target.value);
            },
        }).call(() => {
            complete && complete();
        }).start();
    }

    /**
     * 改变透明度
     * @param target 目标
     * @param duration 持续时间
     * @param opacity 值
     * @param complete 回调函数
     * @returns 
     */
    public static toOpacity(target: Node, duration: number, opacity: number, complete?: Function, delay: number = 0): Tween<UIOpacity> {
        let ui: UIOpacity = target.getComponent(UIOpacity);
        if (!ui) {
            ui = target.addComponent(UIOpacity);
        }
        return tween(ui).delay(delay).to(duration, { opacity: opacity }).call(() => {
            complete && complete();
        }).start();
    }

    /**
     * 二阶贝塞尔曲线运动 世界坐标
     * @param target 目标
     * @param duration 持续时间
     * @param startPos 开始位置
     * @param endPos 结束位置
     * @param callback 完成回调
     * @returns 
     */
    public static bezierToWorld(target: Node, duration: number, startPos: Vec3, endPos: Vec3, callback?: Function): Tween<any> {
        let middlePos: Vec3 = new Vec3();
        if (startPos.x < endPos.x) {
            middlePos.x = startPos.x - (endPos.x - startPos.x) / 4;
        } else {
            middlePos.x = startPos.x + (startPos.x - endPos.x) / 4;
        }

        if (startPos.y < endPos.y) {
            middlePos.y = startPos.y + (endPos.y - startPos.y) / 1.3;
        } else {
            middlePos.y = endPos.y + (startPos.y - endPos.y) / 1.3;
        }
        return tween(target).to(duration, {}, {
            onUpdate: (arg, ratio) => {
                target.setWorldPosition(TweenUtils.bezier(startPos, middlePos, endPos, ratio));
            }
        }).call(() => {
            callback && callback();
        }).start();
    }

    /**贝塞尔计算 */
    private static bezier(start: Vec3, middle: Vec3, end: Vec3, t: number): Vec3 {
        let x = (1 - t) * (1 - t) * start.x + 2 * t * (1 - t) * middle.x + t * t * end.x;
        let y = (1 - t) * (1 - t) * start.y + 2 * t * (1 - t) * middle.y + t * t * end.y;
        return v3(x, y, 0);
    }
}