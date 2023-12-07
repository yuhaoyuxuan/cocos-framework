import { _decorator, Component, Node, Sprite, tween } from 'cc';
import UIBase from '../../../slf/ui/base/UIBase';
import ComponentFindUtils from '../../../slf/utils/ComponentFindUtils';
const { ccclass, property } = _decorator;

/**
 * 加载转圈
 */
@ccclass('Loading')
export class Loading extends UIBase {
    private get nodeLogo(): Node { return ComponentFindUtils.findNode("nodeLogo", this); }

    public initEvent(): void {
        tween(this.nodeLogo).by(2, { angle: -360 }).repeatForever().start();
    }
    
}


