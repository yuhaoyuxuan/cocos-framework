import { Logger } from "../../Logger";

const {ccclass, property} = cc._decorator;

/**
 * 滚动视图扩展
 * @author slf
 */
@ccclass
export default class AScrollView extends cc.ScrollView {
    private maxLen:number;
    private nodeOffset:number;
    private isHide:boolean;

    setContentPosition(position:cc.Vec2){
        super.setContentPosition(position);

        if(!this.maxLen && this.content.children.length>0){
            let layout:cc.Layout = this.content.getComponent(cc.Layout);
            if(this.vertical){
                this.nodeOffset = this.content.children[0].height+layout.spacingY;
                this.maxLen = Math.ceil(this.node.height/this.nodeOffset);

            }else{
                this.nodeOffset = this.content.children[0].width+layout.spacingX;
                this.maxLen = Math.ceil(this.node.width/this.nodeOffset);
            }
            this.isHide = this.content.children.length>this.maxLen;
        }
        this.isHide && this.refreshChild();
    }

    private refreshChild():void
    {
        let start = 0;
        let end = 0;
        if(this.vertical){
            start = Math.floor(this.getContentPosition().y/this.nodeOffset);
            end = start+this.maxLen;
        }else{
            start = Math.floor(this.getContentPosition().x/this.nodeOffset);
            end = start+this.maxLen;
        }

        this.content.children.forEach((value,idx)=>{
            value.opacity = idx>=start && idx<=end ? 255 : 0;
        })
    }
}
