import { _decorator, CCString, Component, Label, Node, RichText } from 'cc';
import { I18nComponentBase } from './I18nComponentBase';
import { I18nManager } from '../I18nManager';
const { ccclass, property , requireComponent,menu} = _decorator;

/**
 * 多语言文本
 * @author slf
 */
@ccclass('I18nLabel')
@menu('I18n/I18nLabel')
export class I18nLabel extends I18nComponentBase {
    @property
    private _key:string = "";
    @property({tooltip:"多语言key"})
    public get key() : string { return this._key;}
    public set key(v : string) {this._key = v;this.refresh();}
    private lbl:Label|RichText;

    public refresh(): void {
        if(!this.lbl){
            this.lbl = this.getComponent(Label) || this.getComponent(RichText);
            if(!this.lbl){
                console.error("none Label Or RichText Component");
                return;
            }
        }
        this.lbl.string = I18nManager.Instance().getLanguage(this.key);
    }
}


