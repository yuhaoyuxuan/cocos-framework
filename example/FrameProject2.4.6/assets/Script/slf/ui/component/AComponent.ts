import { SpriteManager } from "../../common/SpriteManager";
import PubSub from "../../event/PubSub";
import { ResManager } from "../../res/ResManager";
import TimerUtils from "../../utils/TimerUtils";

/**
 * cc.Component组件扩展
 * @author slf
 */
const { ccclass, property } = cc._decorator;
@ccclass
export default class AComponent extends cc.Component {
    /**预制体文件 */
    public prefab: cc.Prefab;

    public onDestroy(): void {
        this.destroyView();
        this.prefab && this.prefab.decRef();
        this.prefab = null;
        ResManager.destroy(this);
        TimerUtils.unRegister(this);
        PubSub.unRegister(this);
    }
    
    public onLoad(): void {
        this.initEvent();
    }
    /**初始化事件 */
    public initEvent(): void { }
    /**销毁*/
    public destroyView(): void { }
}

