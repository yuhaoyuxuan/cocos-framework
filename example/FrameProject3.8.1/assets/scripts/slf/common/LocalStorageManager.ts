import { sys } from "cc";
import { Singleton } from "./Singleton";
/**
 * 本地缓存管理
 * @author slf
 */
export class LocalStorageManager extends Singleton {
    private only: string = "ONLY";

    /**
     * 设置key前缀 防止缓存key重复
     */
    public setOnly(only: string): void {
        this.only = only;
    }

    /**设置缓存*/
    public set(key: string, value: string) {
        sys.localStorage.setItem(this.transformKey(key), value);
    }

    /**获取缓存 */
    public get(key: string): string {
        return sys.localStorage.getItem(this.transformKey(key)) || "";
    }

    /**删除缓存 */
    public clear(key: string): void {
        sys.localStorage.removeItem(this.transformKey(key));
    }


    private transformKey(key: string): string {
        return `${this.only}_${key}`
    }
}


