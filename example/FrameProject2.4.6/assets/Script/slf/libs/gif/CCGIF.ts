import { Logger } from "../../Logger";
import { GIFCache } from "./GIF";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CCGIF extends cc.Component {
    @property({visible:false})
     _path:string = "";
    @property()
    get path():string{return this._path};
    set path(value:string){
        if(CC_EDITOR){
            this._path = value;
        }else{
            if(value == ""){
                this.clear();
                return;
            }
            if(value == this._path){
                this.play(true);
                return;
            }
            this.clear();
            this._path = value;
            this.loadGif();
        }
    };
    /**渲染gif 精灵 */
    private gifSp: cc.Sprite;
    /**gif纹理 数组 */
    private frames: cc.SpriteFrame[];
    /**gif纹理 每帧的延迟时间 */
    private delays = [];
    /**当前播放的帧 */
    private frameIdx = 0;

    onLoad() {
        this.gifSp = this.node.getComponent(cc.Sprite);
        if(this._path != ""){
            this.loadGif();
        }
    }

    onDestroy(): void {
        this.clear();
    }

    /**加载gif */
    private loadGif():void{
        GIFCache.getInstance();
        let reg = /http.?:\/\//;
        let url = this._path;
        if (reg.test(url)) {    //是否远程资源
            cc.assetManager.loadAny({url: url}, (err, data: any) => {
                if (err) {
                    Logger.error(err);
                    return;
                }
                this.loadComplete(data.spriteFrames,data.delays);
            })
        } else {
            cc.resources.load(url,(err, data: any) => {
                if (err) {
                    Logger.error(err);
                    return;
                }
                this.loadComplete(data._nativeAsset.spriteFrames,data._nativeAsset.delays);
            })
        }
    }
    /**加载完成 */
    private loadComplete(fs,ds):void
    {
        //动画纹理、帧率
        this.frames = fs;
        this.delays = ds.map(v => v / 1e2);

        //计算宽高
        let textureRect = this.frames[0].getRect();

        if(this.node.width == 0 || this.node.height == 0){
            this.node.width = textureRect.width;
            this.node.height = textureRect.height;
        }else{
            let scaleX:number =this.node.width / textureRect.width;
            let scaleY:number = this.node.height / textureRect.height;
            this.node.scaleX = scaleX;
            this.node.scaleY = scaleY;
        }
        

        this.play(true);
    }

    private play(loop = false, playNext = false) {
        if (!playNext) {
            this.stop();
        }
        if (this.frames && this.frames.length) {
            if (this.frameIdx >= this.frames.length) {
                this.frameIdx = 0;
                if (!loop) {
                    return;
                }
            }
            this.gifSp.spriteFrame = this.frames[this.frameIdx];
            this.scheduleOnce(() => {
                this.play(loop, true);
            }, this.delays[this.frameIdx]);
            this.frameIdx++;
        }
    }

    public stop() {
        this.frameIdx = 0;
        this.unscheduleAllCallbacks();
    }

     /**
     * 清空数据
     */
    public clear() {
        this.stop();

        //复原宽高
        if(this.gifSp && this.gifSp.spriteFrame){
            this.node.width = this.node.scaleX * this.node.width;
            this.node.height = this.node.scaleY * this.node.height;
        }
        this.gifSp && (this.gifSp.spriteFrame = null);
        this.frames = null;
        this.delays = null;
        this._path = "";
    }
}