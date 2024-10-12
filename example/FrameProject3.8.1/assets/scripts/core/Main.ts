import { _decorator, Component, Node } from 'cc';
import { UIConfigMain, UIMainId } from './ui/config/UIConfigMain';
import UIManager from '../slf/ui/UIManager';
import { LoadComponent } from './ui/LoadComponent';
const { ccclass, property } = _decorator;

/**项目入口 */
@ccclass('Main')
export class Main extends Component {
    /**初始化加载 */
    @property({ type: LoadComponent })
    lc: LoadComponent = null;

    protected onLoad(): void {
        //初始化ui设置跟容器
        UIManager.Instance().initRoot(this.node);

        //初始化主包ui配置
        new UIConfigMain().init();
    }

    protected start(): void {
        //初始化加载资源
        this.lc.startLoad(this.loadComplete, this);
    }

    /**初始化加载完成 */
    private loadComplete(): void {
        UIManager.Instance().openUI(UIMainId.Dialog);
    }

}


