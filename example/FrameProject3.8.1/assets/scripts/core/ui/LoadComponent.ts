import { _decorator, AssetManager, assetManager, resources, Sprite, tween, Vec2 } from 'cc';
import AComponent from '../../slf/ui/component/AComponent';
import ComponentFindUtils from '../../slf/utils/ComponentFindUtils';
import { ResManager } from '../../slf/res/ResManager';
import UIManager from '../../slf/ui/UIManager';
import { UIMainId } from './config/UIConfigMain';
import { AudioManager } from '../../slf/audio/AudioManager';
import { Button } from 'cc';
const { ccclass, property } = _decorator;
/**
 * 初始化加载
 */
@ccclass('Loading')
export class LoadComponent extends AComponent {
    private get imgProgress(): Sprite { return ComponentFindUtils.find<Sprite>("imgProgress", Sprite, this); }
    private get btnConfirm(): Button { return ComponentFindUtils.find<Button>("btnConfirm", Button, this); }

    private callback: Function;
    private target: any;
    protected initEvent(): void {
        this.btnConfirm.onClickCallback(this.onTap, this);
        this.btnConfirm.node.active = false;
    }

    /**
     * 初始化加载相关配置
     * @param callback 加载完成回调函数
     * @param target 回调目标
     */
    public startLoad(callback: Function, target: any): void {
        this.callback = callback;
        this.target = target;

        //加载主包预加载资源
        resources.loadDir("preload", (finished: number, total: number, item: AssetManager.RequestItem) => {
            this.progress(finished / total * 0.3);
        }, () => {
            //加载依赖包
            ResManager.Instance().loadBundle("testBundle", this.preload, this);
        })
    }

    /**加载包内预加载资源 */
    private preload(bundle: AssetManager.Bundle): void {
        bundle.loadDir("preload", (finished: number, total: number, item: AssetManager.RequestItem) => {
            this.progress(finished / total * 0.4 + 0.3);
        }, () => {
            tween(this.imgProgress).to(1, { fillRange: 1 }).call(this.preloadComplete.bind(this)).start();
        })
    }

    private preloadComplete(): void {
        this.progress(1);
        this.btnConfirm.node.active = true;
        this.callback.call(this.target);
    }

    /**加载进度 0-1 */
    public progress(value: number): void {
        this.imgProgress.fillRange = value;
    }

    private onTap(): void {
        this.node.destroy();
        AudioManager.Instance().play("preload/audios/button_click");
        AudioManager.Instance().playBg("preload/audios/bgm");
    }
}


