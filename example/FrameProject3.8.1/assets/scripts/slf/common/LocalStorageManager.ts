import { sys } from "cc";
import { Singleton } from "./Singleton";
/**
 * 本地缓存管理
 * @author slf
 */
export class LocalStorageManager extends Singleton {
    /**设置缓存*/
    public set(key: string, value: string) {
        sys.localStorage.setItem(key, value);
    }

    /**获取缓存 */
    public get(key: string): string {
        return sys.localStorage.getItem(key) || "";
    }

    /**删除缓存 */
    public clear(key: string): void {
        sys.localStorage.removeItem(key);
    }
}


