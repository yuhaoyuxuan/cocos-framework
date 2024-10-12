import { _decorator, Component, Label, Node } from 'cc';
import UIBase from '../../../../scripts/slf/ui/base/UIBase';
import ComponentFindUtils from '../../../../scripts/slf/utils/ComponentFindUtils';
import UIManager from '../../../../scripts/slf/ui/UIManager';
import { UIMainId } from '../../../../scripts/core/ui/config/UIConfigMain';
import { Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TestPrefab')
export class TestPrefab extends UIBase {
    private get lblDesc(): Label { return ComponentFindUtils.find<Label>("lblDesc", Label, this); }
    private get btnConfirm(): Button { return ComponentFindUtils.find<Button>("btnConfirm", Button, this); }
    private get btnClose(): Button { return ComponentFindUtils.find<Button>("btnClose", Button, this); }

    public onLoad(): void {
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


