import { _decorator, Sprite, SpriteFrame } from 'cc';
import { I18nComponentBase } from './I18nComponentBase';
import { I18nManager } from '../I18nManager';
const { ccclass, property,requireComponent ,menu} = _decorator;

@ccclass("I18nSpriteData")
export class I18nSpriteData{
    @property({tooltip:"语言代码"})
    languageCode:string="";
    @property({type:SpriteFrame,tooltip:"当前语言对应的图片精灵"})
    spriteFrame:SpriteFrame = null;
}

/**
 * 多语言精灵图片
 */
@ccclass('I18nSprite')
@requireComponent(Sprite)
@menu('I18n/I18nSprite')
export class I18nSprite extends I18nComponentBase {
    @property({type:[I18nSpriteData],tooltip:"多语言精灵图片列表"})
    public list:I18nSpriteData[] = [];
    private sp:Sprite;

    public refresh(): void {
        if(!this.sp){
            this.sp = this.getComponent(Sprite);
        }

        let lgCode = I18nManager.Instance().lgCode;
        this.list.forEach(v=>{
            if(v.languageCode == lgCode){
                this.sp.spriteFrame = v.spriteFrame;
            }
        })
    }
}


