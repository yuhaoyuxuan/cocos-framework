import { _decorator, Component, Node, Sprite, tween } from 'cc';
import UIBase from '../../../slf/ui/base/UIBase';
import ComponentFindUtils from '../../../slf/utils/ComponentFindUtils';
import { TimerManager } from '../../../slf/timer/TimerManager';
const { ccclass, property } = _decorator;

/**
 * 加载转圈
 */
@ccclass('Loading')
export class Loading extends UIBase {
    private get nodeLogo(): Node { return ComponentFindUtils.findNode("nodeLogo", this); }

    public onLoad(): void {
        tween(this.nodeLogo).by(2, { angle: -360 }).repeatForever().start();
    }

    public initView(): void {
        TimerManager.Instance().once(5, this.onClose, this);
    }

    public removeView(): void {
        TimerManager.Instance().off(this.onClose, this);
    }
}


