import { _decorator, Component, director, Node } from 'cc';
import { EDITOR, EDITOR_NOT_IN_PREVIEW } from 'cc/env';
const { ccclass, property } = _decorator;

/**
 * 单例组件基类
 * @author slf
 */
@ccclass('SingletonComponent')
export abstract class SingletonComponent extends Component {
    private instance: any;
    public static Instance<T>(this: new () => T): T {
        if (!EDITOR || !EDITOR_NOT_IN_PREVIEW) {
            if (!(<any>this).instance) {
                let node = new Node(this.name.toString());
                director.addPersistRootNode(node);
                (<any>this).instance = node.addComponent(<any>this);
                (<any>this).instance.init();
            }
            return (<any>this).instance;
        }
    }
    protected init() { }
}


