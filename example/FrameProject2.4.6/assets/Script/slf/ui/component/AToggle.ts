// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Logger } from "../../Logger";
import CommonUtils from "../../utils/CommonUtils";

const {ccclass, property} = cc._decorator;
/**
 * toggle扩展
 * @author slf
 */
@ccclass
export default class AToggle extends cc.Toggle {
    protected callback: Function;       //回调函数
    protected cbThis: any;              //回调作用域
    protected cbParam: any;             //回调参数

    @property({displayName:"未选中是否变灰"})
    public isGray:boolean = false;
    /**
     * 设置被选中回调
     * @param cb 回调函数
     * @param cbT 回调作用域
     * @param param 回调参数
     * @returns cb.call(cbT,param)
     */
    public setTouchCallback(cb?: Function, cbT?: any, param?: any): void {
        this.callback = cb;
        this.cbThis = cbT;
        this.cbParam = param;
    }

    _updateCheckMark():void
    {
        super["_updateCheckMark"]();
        if(this.isChecked){
            this.callback && this.callback.call(this.cbThis,this.cbParam);
        }
        if(this.isGray){
            CommonUtils.setGray(this.node,!this.isChecked,true);
            this.node.opacity =  this.isChecked ? 255 : 180;
        }
    }
}
