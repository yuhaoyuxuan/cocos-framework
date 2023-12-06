
根据组件命名规则,复制预制体组件。
采用get方式，即用即查，查找后会缓存，减少二次请求查询，优化性能。
组件销毁的时候, 记得销毁组件缓存。
安装依赖
```bash
    npm install
```

使用：
1.打开预制体界面
2.复制预制体组件
3.复制完成后会粘贴到 粘贴板


规则：命名前缀 可以根据项目自定义 main.js - start()
node = cc.Node;
lbl = cc.Label;
rich = cc.RichText;
img = cc.Sprite;
tog = cc.Toggle;
eb = cc.Editbox;
item = 继承与cc.Component组件


案例
private get lbl1() : Label {return ComponentFindUtils.find<Label>("Canvas/lbl1",Label,this);}
private get img1() : Sprite {return ComponentFindUtils.find<Sprite>("Canvas/img1",Sprite,this);}

//使用
lbl1.string = "111";

//销毁
ComponentFindUtils.destroy(this);






//项目中添加此类
import { Component, find, Node } from "cc";

/**
 *查找预制体节点组件 并缓存
 * @author slf
 */
export default class ComponentFindUtils {
    private static _cacheMap: Map<string, Map<string, any>> = new Map();

    /**
     * 查找节点组件
     * @param path 查找节点组件
     * @param target 节点的父组件
     * @param type 组件类型
     * @returns 
     */
    static find<T extends Component>(path: string, type: any, target: Component): T {
        let key: string = path + type.name;
        let cache = this.getCache(key, target);
        if (cache) {
            return cache;
        }

        var tempNode: Node = find(path, target.node) as Node;
        if (tempNode != null) {
            var component = tempNode.getComponent<T>(type)
            if (component != null) {
                this.setCache(key, target, component);
                return component;
            }
        }
        return null as any;
    }

    /**
     * 查找节点
     * @param path 查找节点组件
     * @param target 节点的父组件
     * @returns 
     */
    static findNode(path: string, target: Component): Node {
        let cache = this.getCache(path, target);
        if (cache) {
            return cache;
        }

        var tempNode: Node = find(path, target.node) as Node;
        if (tempNode != null) {
            this.setCache(path, target, tempNode);
            return tempNode
        }
        return null as any;
    }

    /**
     * 销毁单个缓存map
     * @param target 节点的父组件 用与获取uuid
     */
    static destroy(target: Component): void {
        let id = target.uuid;
        if (this._cacheMap.has(id)) {
            this._cacheMap.delete(id);
        }
    }

    private static getCache(key: string, target: Component): any {
        let id = target.uuid;
        if (this._cacheMap.has(id)) {
            let tempMap: Map<string, any> = this._cacheMap.get(id) as Map<string, any>;
            if (tempMap.has(key)) {
                return tempMap.get(key);
            }
        }
        return null;
    }

    private static setCache(key: string, target: Component, component: any): void {
        let id = target.uuid;
        let tempMap: Map<string, any>;
        if (!this._cacheMap.has(id)) {
            tempMap = new Map();
            this._cacheMap.set(id, tempMap);
        } else {
            tempMap = this._cacheMap.get(id) as Map<string, any>;;
        }

        if (!tempMap.has(key)) {
            tempMap.set(key, component);
        }
    }

}