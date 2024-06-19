import { _decorator, Component, Node, SpriteFrame } from 'cc';
import UIBase from '../../../slf/ui/base/UIBase';
import ComponentFindUtils from '../../../slf/utils/ComponentFindUtils';
import UIManager from '../../../slf/ui/UIManager';
import { UIMainId } from '../config/UIConfigMain';
import { ResManager } from '../../../slf/res/ResManager';
import { Button } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 对话框
 */
@ccclass('Dialog')
export class Dialog extends UIBase {
    private get btnClose(): Button { return ComponentFindUtils.find<Button>("btnClose", Button, this); }
    private get btnLoading(): Button { return ComponentFindUtils.find<Button>("btnLoading", Button, this); }


    public initEvent(): void {
        this.btnClose.onClickCallback(this.onClose, this);
        this.btnLoading.onClickCallback(this.onLoading, this);
    }

    private onLoading(): void {
        UIManager.Instance().openUI(UIMainId.Loading);
    }
}


