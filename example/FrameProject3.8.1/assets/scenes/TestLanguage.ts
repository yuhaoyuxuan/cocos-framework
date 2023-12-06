import { _decorator, Color, Component, find, game, Graphics, InstanceMaterialType, Node, UIOpacity, view } from 'cc';
import { I18nManager } from '../scripts/slf/i18n/I18nManager';
import { ResManager } from '../scripts/slf/res/ResManager';
import ObjPoolUtils from '../scripts/slf/utils/ObjPoolUtils';
import { ResTask } from '../scripts/slf/res/ResTask';
const { ccclass, property } = _decorator;

@ccclass('TestLanguage')
export class TestLanguage extends Component {

    private t;
    public onEn(): void {
        I18nManager.Instance().changeLanguage("en");

        this.t = ObjPoolUtils.getObj(ResTask);
        InstanceMaterialType.GRAYSCALE
    }
    public onEs(): void {
        I18nManager.Instance().changeLanguage("es");
        
        ObjPoolUtils.recycleObj(this.t);
    }
    public onPT(): void {
        I18nManager.Instance().changeLanguage("pt");
    }
}


