import { _decorator, Component, Node, SpriteFrame } from 'cc';
import UIBase from '../../../slf/ui/base/UIBase';
import { AButton } from '../../../slf/ui/component/AButton';
import ComponentFindUtils from '../../../slf/utils/ComponentFindUtils';
import UIManager from '../../../slf/ui/UIManager';
import { UIMainId } from '../config/UIConfigMain';
import { ResManager } from '../../../slf/res/ResManager';
const { ccclass, property } = _decorator;

/**
 * 对话框
 */
@ccclass('Dialog')
export class Dialog extends UIBase {
    private get btnClose(): AButton { return ComponentFindUtils.find<AButton>("btnClose", AButton, this); }
    private get btnLoading(): AButton { return ComponentFindUtils.find<AButton>("btnLoading", AButton, this); }


    public initEvent(): void {
        this.btnClose.setClickCallback(this.onClose, this);

        this.btnLoading.setClickCallback(this.onLoading, this);
    }

    private onLoading(): void {
        UIManager.Instance().openUI(UIMainId.Loading);
    }
}


