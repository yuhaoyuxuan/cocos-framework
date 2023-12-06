import { _decorator, Button, Component, Label, Node } from 'cc';
import UIBase from '../../../scripts/slf/ui/base/UIBase';
import ComponentFindUtils from '../../../scripts/slf/utils/ComponentFindUtils';
import { AButton } from '../../../scripts/slf/ui/component/AButton';
const { ccclass, property } = _decorator;
/**
 * 测试ui界面
 * @author slf
 */
@ccclass('BagUI')
export class BagUI extends UIBase {
    private get lblDesc(): Label { return ComponentFindUtils.find<Label>("lblDesc", Label, this); }
    private get btnClose(): AButton { return ComponentFindUtils.find<AButton>("btnClose", AButton, this); }


    protected start(): void {
        this.btnClose.setClickCallback(this.onClose, this);
    }

}


