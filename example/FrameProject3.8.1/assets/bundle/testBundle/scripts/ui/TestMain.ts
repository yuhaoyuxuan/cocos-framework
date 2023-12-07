import { _decorator, Component, Node } from 'cc';
import UIBase from '../../../../scripts/slf/ui/base/UIBase';
import { AButton } from '../../../../scripts/slf/ui/component/AButton';
import ComponentFindUtils from '../../../../scripts/slf/utils/ComponentFindUtils';
import UIManager from '../../../../scripts/slf/ui/UIManager';
import { UITestId } from './config/UIConfigTest';
const { ccclass, property } = _decorator;

@ccclass('TestMain')
export class TestMain extends UIBase {
    private get btnJump(): AButton { return ComponentFindUtils.find<AButton>("btnJump", AButton, this); }

    public initEvent(): void {
        this.btnJump.setClickCallback(this.onTap, this);
    }

    private onTap(): void {
        UIManager.Instance().openUI(UITestId.TestPrefab, 123);
    }
}


