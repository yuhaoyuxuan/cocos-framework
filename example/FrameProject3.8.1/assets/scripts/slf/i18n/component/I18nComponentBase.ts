import { _decorator, Component, Node } from 'cc';
import { I18nManager } from '../I18nManager';
const { ccclass, property } = _decorator;

/**
 * 多语言抽象组件基类
 */
@ccclass('I18nComponentBase')
export abstract class I18nComponentBase extends Component {
    protected onLoad(): void {
        I18nManager.Instance().on(this);
        this.refresh();
    }
    
    protected onDestroy(): void {
        I18nManager.Instance().off(this);
    }

    /**刷新多语言 */
    public abstract refresh():void
}


