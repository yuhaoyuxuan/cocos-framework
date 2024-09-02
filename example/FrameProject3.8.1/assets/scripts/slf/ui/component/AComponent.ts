import EventManager from "../../event/EventManager";
import { ResManager } from "../../res/ResManager";
import { TimerManager } from "../../timer/TimerManager";
import ComponentFindUtils from "../../utils/ComponentFindUtils";
import { Asset, Component, _decorator } from "cc";

/**
 * cc.Component组件扩展 框架内所有ui组件的基类
 * 销毁后 销毁动态添加的资源
 * 销毁事件注册
 * 销毁定时器注册
 * 销毁组件缓存
 * @author slf
 */
const { ccclass } = _decorator;
@ccclass
export default abstract class AComponent extends Component {
    protected onLoad(): void {
        this.initEvent();
    }
    /**
     * 加载资源
     * @param url 
     * @param type 
     * @param callback 
     * @param bundleName 
     */
    protected loadRes(url: string, type: Asset, callback: (asset) => void, bundleName: string = "resources"): void {
        ResManager.Instance().load(url, type, this, callback, this, bundleName);
    }

    /**todo 子类重写后记得 suepr */
    public preDestroy(): void {
        this.destroyView();
        ResManager.Instance().destroy(this);
        EventManager.Instance().targetOff(this);
        TimerManager.Instance().targetOff(this);
        ComponentFindUtils.destroy(this);
    }
    /**初始化事件 */
    protected initEvent(): void { }
    /**销毁*/
    protected destroyView(): void { }
}

