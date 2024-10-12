import { Tween, Node, Vec3, tween, ITweenOption, UITransform } from "cc";
/**
 * 扩展Node原型
 * @author slf
 */
declare module 'cc' {
    interface Node {
        /**uiTransform */
        get uiTransform(): UITransform
        /**node uiTransform 宽 */
        get uiWidth(): number
        set uiWidth(value: number)
        /**node uiTransform 高 */
        get uiHeight(): number
        set uiHeight(value: number)


        /**node本地坐标x */
        get x(): number
        set x(value: number)
        /**node本地坐标y */
        get y(): number
        set y(value: number)
        /**node本地坐标z */
        get z(): number
        set z(value: number)
        /**node世界坐标x */
        get worldX(): number
        set worldX(value: number)
        /**node世界坐标y */
        get worldY(): number
        set worldY(value: number)
        /**node世界坐标z */
        get worldZ(): number
        set worldZ(value: number)

        /**
         * 缩放
         * @param duration 持续时间
         * @param target 目标 数字或Vec3
         */
        toScale(duration: number, target: number | Vec3, opts?: ITweenOption): Tween<Node>;
        /**
         * 缩放X
         * @param duration 持续时间
         * @param target 目标
         */
        toScaleX(duration: number, target: number, opts?: ITweenOption): Tween<Node>;
        /**
         * 缩放Y
         * @param duration 持续时间
         * @param target 目标
         */
        toScaleY(duration: number, target: number, opts?: ITweenOption): Tween<Node>;
        /**
         * 缩放Z
         * @param duration 持续时间
         * @param target 目标
         */
        toScaleZ(duration: number, targetZ: number, opts?: ITweenOption): Tween<Node>;

        /**
         * 移动到目标位置
         * @param duration 持续时间
         * @param target 目标位置
         */
        toPosition(duration: number, target: Vec3, opts?: ITweenOption): Tween<Node>;
        /**
         * 移动到目标位置X
         * @param duration 持续时间
         * @param target 目标位置
         */
        toPositionX(duration: number, target: number, opts?: ITweenOption): Tween<Node>;
        /**
         * 移动到目标位置Y
         * @param duration 持续时间
         * @param target 目标位置
         */
        toPositionY(duration: number, target: number, opts?: ITweenOption): Tween<Node>;
        /**
         * 移动到目标位置Z
         * @param duration 持续时间
         * @param target 目标位置
         */
        toPositionZ(duration: number, targetZ: number, opts?: ITweenOption): Tween<Node>;
        /**
         * 移动到目标位置(世界坐标)
         * @param duration 持续时间
         * @param target 目标位置
         */
        toWorldPosition(duration: number, target: Vec3, opts?: ITweenOption): Tween<Node>;
        /**
         * 移动到目标位置X(世界坐标)
         * @param duration 持续时间
         * @param target 目标位置
         */
        toWorldPositionX(duration: number, target: number, opts?: ITweenOption): Tween<Node>;
        /**
         * 移动到目标位置Y(世界坐标)
         * @param duration 持续时间
         * @param target 目标位置
         */
        toWorldPositionY(duration: number, target: number, opts?: ITweenOption): Tween<Node>;
        /**
         * 移动到目标位置Z(世界坐标)
         * @param duration 持续时间
         * @param target 目标位置
         */
        toWorldPositionZ(duration: number, targetZ: number, opts?: ITweenOption): Tween<Node>;
    }
}
Node.prototype.toScale = function (duration: number, target: number | Vec3, opts?: ITweenOption): Tween<Node> {
    if (!(target instanceof Vec3)) {
        target = new Vec3(target, target, target);
    }
    return tween(this).to(duration, { scale: target }, opts);
}
Node.prototype.toScaleX = function (duration: number, target: number, opts?: ITweenOption): Tween<Node> {
    return this.toScale(duration, new Vec3(target, this.scale.y, this.scale.z), opts);
}
Node.prototype.toScaleY = function (duration: number, target: number, opts?: ITweenOption): Tween<Node> {
    return this.toScale(duration, new Vec3(this.scale.x, target, this.scale.z), opts);
}
Node.prototype.toScaleZ = function (duration: number, target: number, opts?: ITweenOption): Tween<Node> {
    return this.toScale(duration, new Vec3(this.scale.x, this.scale.y, target), opts);
}

Node.prototype.toPosition = function (duration: number, target: Vec3, opts?: ITweenOption): Tween<Node> {
    return tween(this).to(duration, { position: target }, opts);
}
Node.prototype.toPositionX = function (duration: number, target: number, opts?: ITweenOption): Tween<Node> {
    return this.toPosition(duration, new Vec3(target, this.position.y, this.position.z), opts);
}
Node.prototype.toPositionY = function (duration: number, target: number, opts?: ITweenOption): Tween<Node> {
    return this.toPosition(duration, new Vec3(this.position.x, target, this.position.z), opts);
}
Node.prototype.toPositionZ = function (duration: number, target: number, opts?: ITweenOption): Tween<Node> {
    return this.toPosition(duration, new Vec3(this.position.x, this.position.y, target), opts);
}

Node.prototype.toWorldPosition = function (duration: number, target: Vec3, opts?: ITweenOption): Tween<Node> {
    return tween(this).to(duration, { wordPosition: target }, opts);
}
Node.prototype.toWorldPositionX = function (duration: number, target: number, opts?: ITweenOption): Tween<Node> {
    return this.toPosition(duration, new Vec3(target, this.worldPosition.y, this.worldPosition.z), opts);
}
Node.prototype.toWorldPositionY = function (duration: number, target: number, opts?: ITweenOption): Tween<Node> {
    return this.toPosition(duration, new Vec3(this.worldPosition.x, target, this.worldPosition.z), opts);
}
Node.prototype.toWorldPositionZ = function (duration: number, target: number, opts?: ITweenOption): Tween<Node> {
    return this.toPosition(duration, new Vec3(this.worldPosition.x, this.worldPosition.y, target), opts);
}

if (!Node.prototype.hasOwnProperty("uiTransform")) {
    Object.defineProperties(Node.prototype, {
        "uiTransform": {
            get(): Vec3 {
                return this.getComponent(UITransform);
            }
        },
        "uiWidth": {
            get(): number {
                return this.uiTransform.width;
            },
            set(value: number) {
                this.uiTransform.width = value;
            }
        },
        "uiHeight": {
            get(): number {
                return this.uiTransform.height;
            },
            set(value: number) {
                this.uiTransform.height = value;
            }
        },
        "x": {
            get(): number {
                return this.position.x;
            },
            set(value: number) {
                this.position = new Vec3(value, this.position.y, this.position.z)
            }
        },
        "y": {
            get(): number {
                return this.position.y;
            },
            set(value: number) {
                this.position = new Vec3(this.position.x, value, this.position.z)
            }
        },
        "z": {
            get(): number {
                return this.position.z;
            },
            set(value: number) {
                this.position = new Vec3(this.position.x, this.position.y, value)
            }
        },
        "worldX": {
            get(): number {
                return this.worldPosition.x;
            },
            set(value: number) {
                this.worldPosition = new Vec3(value, this.worldPosition.y, this.worldPosition.z)
            }
        },
        "worldY": {
            get(): number {
                return this.worldPosition.y;
            },
            set(value: number) {
                this.worldPosition = new Vec3(this.worldPosition.x, value, this.worldPosition.z)
            }
        },
        "worldZ": {
            get(): number {
                return this.worldPosition.z;
            },
            set(value: number) {
                this.worldPosition = new Vec3(this.worldPosition.x, this.worldPosition.y, value)
            }
        }
    });
}
