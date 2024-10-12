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

    /**子类不可重写 销毁需要清理 请重写onDestroy */
    public preDestroy(): void {
        ResManager.Instance().destroy(this);
        EventManager.Instance().targetOff(this);
        TimerManager.Instance().targetOff(this);
        ComponentFindUtils.destroy(this);
    }

    /**初始化只会调用一次 */
    protected onLoad(): void { }
    /**销毁只会调用一次 */
    protected onDestroy(): void { }
}

