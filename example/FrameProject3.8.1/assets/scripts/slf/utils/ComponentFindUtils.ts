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