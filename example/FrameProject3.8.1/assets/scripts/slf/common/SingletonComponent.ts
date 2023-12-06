import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 单例组件基类
 * @author slf
 */
@ccclass('SingletonComponent')
export abstract class SingletonComponent extends Component {
    private instance:any;
    public static Instance<T>(this: new () => T): T {
        if (!(<any>this).instance) {
            let node = new Node(this.name.toString());
            director.addPersistRootNode(node);
            (<any>this).instance = node.addComponent(<any>this);
            (<any>this).instance.init();
        }
        return (<any>this).instance;
    }
    protected init() {}
}


