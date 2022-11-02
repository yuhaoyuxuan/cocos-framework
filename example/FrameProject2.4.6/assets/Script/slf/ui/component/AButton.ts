import CommonUtils from "../../utils/CommonUtils";

/**
 * 按钮扩展
 * @author slf
 */
const { ccclass, property } = cc._decorator;
@ccclass
export default class AButton extends cc.Button {
    protected callback: Function;       //回调函数
    protected cbThis: any;              //回调作用域
    protected cbParam: any;             //回调参数
    
    private gray:boolean;
    /**
    * 设置灰色滤镜
    * @param gray true变灰 
    */
    public setGray(gray: boolean = true): void {
        this.gray = gray;
        CommonUtils.setGray(this.node,gray,true);
    }

    /**
     * 设置点击回调
     * @param cb 回调函数
     * @param cbT 回调作用域
     * @param param 回调参数
     * @returns cb.call(cbT,param)
     */
     public setTouchCallback(cb?: Function, cbT?: any, param?: any): void {
        this.callback = cb;
        this.cbThis = cbT;
        this.cbParam = param;
        if (this.node) {
            if (this.node.hasEventListener(cc.Node.EventType.TOUCH_END)) {
                this.node.off(cc.Node.EventType.TOUCH_END, this.onTapHandler, this);
            }
            this.node.on(cc.Node.EventType.TOUCH_END, this.onTapHandler, this);
        }
    }

    protected onTapHandler(e: cc.Event): void {
        if(this.gray){
            return;
        }
        this.callback && this.callback.call(this.cbThis, this.cbParam);
    }
}
