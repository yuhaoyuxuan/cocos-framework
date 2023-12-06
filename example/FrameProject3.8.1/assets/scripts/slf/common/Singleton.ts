/**
 * 单例基类
 * @author slf
 */
export abstract class Singleton{
    private instance:any;
    public static Instance<T>(this: new () => T): T {
        if (!(<any>this).instance) {
            (<any>this).instance = new this();
            (<any>this).instance.init();
        }
        return (<any>this).instance;
    }
    protected init() {}
}


