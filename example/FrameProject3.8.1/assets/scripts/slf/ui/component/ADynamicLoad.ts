import { _decorator, Asset, Component, Enum, instantiate, isValid, Node, Prefab, sp, Sprite, SpriteFrame, UIRenderer } from 'cc';
import { ResManager } from '../../res/ResManager';
import AComponent from './AComponent';
const { ccclass, property } = _decorator;

/**加载类型 */
enum ALoadType {
    /**图片精灵 */
    SpriteFrame,
    /**预制体 会添加到当前节点下 */
    Prefab,
    /**spine数据源 */
    SkeletonData,
}
/**
 * 动态加载资源组件
 * onLoad的时候会加载资源并赋值
 * 减少预制体初始化的时候，加载大量资源造成卡顿、加载慢问题
 * @author slf
*/
@ccclass('ADynamicLoad')
export class ADynamicLoad extends AComponent {
    @property({ type: Enum(ALoadType), tooltip: "资源类型" })
    assetType: ALoadType;
    @property({ tooltip: "资源路径" })
    private assetPath: string = "";
    @property({ tooltip: "包名" })
    private bundleName: string = "resources";
    @property({ type: Sprite, tooltip: "目标Sprite", visible() { return this.assetType == ALoadType.SpriteFrame } })
    private sprite: Sprite;
    @property({ type: sp.Skeleton, tooltip: "目标spine", visible() { return this.assetType == ALoadType.SkeletonData } })
    private spine: sp.Skeleton;
    //目标预制体Node
    private prefab: Node;

    resetInEditor(didResetToDefault?: boolean): void {
        !this.sprite && (this.sprite = this.getComponent(Sprite));
        !this.spine && (this.spine = this.getComponent(sp.Skeleton));
    }

    /**是否加载资源完成 */
    public loadFinish: boolean;
    private cb: Function;
    private cbTarget: any;
    /**
     * 资源加载完成回调
     * @param cb target实例化目标 asset加载源文件
     * @param target 
     */
    public setComplete<T extends Component>(cb: (target?: T, asset?: Asset) => void, target: any) {
        this.cb = cb;
        this.cbTarget = target;
    }

    /**获取目标 */
    public target<T extends Component>(): T {
        switch (this.assetType) {
            case ALoadType.SpriteFrame:
                return <any>this.sprite;
            case ALoadType.Prefab:
                return <any>this.prefab;
        }
        return <any>this.spine;
    }

    protected onLoad(): void {
        if (this.assetPath == "") {
            return;
        }

        switch (this.assetType) {
            case ALoadType.SpriteFrame:
                this.loadAsset(SpriteFrame);
                break;
            case ALoadType.Prefab:
                this.loadAsset(Prefab);
                break;
            case ALoadType.SkeletonData:
                this.loadAsset(sp.SkeletonData);
                break;
        }
    }

    private loadAsset(type: Asset | any): void {
        ResManager.Instance().load(this.assetPath, type, this, this.loadComplete, this, this.bundleName);
    }

    private loadComplete(asset: any): void {
        if (!isValid(this.node)) {
            return;
        }
        switch (this.assetType) {
            case ALoadType.SpriteFrame:
                this.target<Sprite>().spriteFrame = asset;
                break;
            case ALoadType.Prefab:
                this.prefab = instantiate(asset);
                this.prefab.parent = this.node;
                break;
            case ALoadType.SkeletonData:
                this.target<sp.Skeleton>().skeletonData = asset;
                break;
        }
        this.loadFinish = true;
        this.cb?.call(this.cbTarget, this.target(), asset);
    }

    protected onDestroy(): void {
        this.cb = null;
        this.cbTarget = null;
        this.prefab = null;
    }
}