import { _decorator, Component, Node } from 'cc';
import UIBase from '../../../../scripts/slf/ui/base/UIBase';
import ComponentFindUtils from '../../../../scripts/slf/utils/ComponentFindUtils';
import UIManager from '../../../../scripts/slf/ui/UIManager';
import { UITestId } from './config/UIConfigTest';
import { Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TestMain')
export class TestMain extends UIBase {
    private get btnJump(): Button { return ComponentFindUtils.find<Button>("btnJump", Button, this); }

    public onLoad(): void {
        this.btnJump.setClickCallback(this.onTap, this);
    }

    private onTap(): void {
        UIManager.Instance().openUI(UITestId.TestPrefab, 123);
    }
}


