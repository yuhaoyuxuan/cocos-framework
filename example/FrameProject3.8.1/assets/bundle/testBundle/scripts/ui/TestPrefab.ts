import { _decorator, Component, Label, Node } from 'cc';
import UIBase from '../../../../scripts/slf/ui/base/UIBase';
import ComponentFindUtils from '../../../../scripts/slf/utils/ComponentFindUtils';
import { AButton } from '../../../../scripts/slf/ui/component/AButton';
import UIManager from '../../../../scripts/slf/ui/UIManager';
import { UIMainId } from '../../../../scripts/core/ui/config/UIConfigMain';
const { ccclass, property } = _decorator;

@ccclass('TestPrefab')
export class TestPrefab extends UIBase {
    private get lblDesc(): Label { return ComponentFindUtils.find<Label>("lblDesc", Label, this); }
    private get btnConfirm(): AButton { return ComponentFindUtils.find<AButton>("btnConfirm", AButton, this); }
    private get btnClose(): AButton { return ComponentFindUtils.find<AButton>("btnClose", AButton, this); }

    public initEvent(): void {
        this.btnClose.setClickCallback(this.onClose, this);
        this.btnConfirm.setClickCallback(this.onTap, this);
    }

    public initView(): void {
        this.lblDesc.string = "测试预制体界面";
    }

    public onTap(): void {
        UIManager.Instance().openUI(UIMainId.Dialog);
    }
}


