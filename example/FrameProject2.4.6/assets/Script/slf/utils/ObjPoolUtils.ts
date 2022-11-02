/**
 * 对象池
 * @author slf
 */
export default class ObjPoolUtils {
    /**单个池最大长度 */
    public static MAX_LENGTH: number = 200;
    /**对象散列表 */
    private static objMap: any = {};
    /**
     * 获取对象实例
     * @param classA 传入具体类
     * @returns 返回类实例 || new class
     */
    public static getObj<T>(classA: { prototype: T }): T {
        let className = this.getQualifiedClassName(classA);
        let objList: any[] = this.objMap[className]
        if (!objList) {
            this.objMap[className] = objList = [];
        }
        if (!objList.length) {
            var cl: any = classA;
            objList.push(new cl());
        }
        return objList.shift();
    }
    /**
     * 回收对象
     * @param classA 传入具体类
     */
    public static recycleObj(classA: any): void {
        let name = this.getQualifiedClassName(classA);
        let objList: any[] = this.objMap[name]
        if (objList.length < this.MAX_LENGTH) {
            objList.push(classA);
        }
    }
    /**
     * 销毁对象池
     * @param classA 传入具体类
     */
    public static destroy(classA: any): void {
        let name = this.getQualifiedClassName(classA);
        this.objMap[name] = null;
    }

    /**
     * 返回对象的完全限定类名。
     * @param value 需要完全限定类名称的对象，可以将任何 JavaScript 值传递给此方法，包括所有可用的 JavaScript 类型、对象实例、原始类型
     * （如number)和类对象
     * @returns 包含完全限定类名称的字符串。
     */
    private static getQualifiedClassName(value) {
        var type = typeof value;
        if (!value || (type != "object" && !value.prototype)) {
            return type;
        }
        var prototype = value.prototype ? value.prototype : Object.getPrototypeOf(value);
        if (prototype.hasOwnProperty("__class__")) {
            return prototype["__class__"];
        }
        var constructorString = prototype.constructor.toString().trim();
        var index = constructorString.indexOf("(");
        var className = constructorString.substring(9, index);
        Object.defineProperty(prototype, "__class__", {
            value: className,
            enumerable: false,
            writable: true
        });
        return className;
    }
}