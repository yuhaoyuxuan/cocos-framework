/**
 * sprite 模块 动态给 node 或 sprite设置图片
 * @author slf
 * example  
 *         SpriteManager.setRes(cc.Node | cc.Sprite,imgUrl,ownerId)
 *         SpriteManager.setRes(cc.Node | cc.Sprite,[atlas,imgName],ownerId)
*/
export module SpriteManager {
    /**对象池 */
    var spritePool: any[] = [];
    /**纹理数据 Map*/
    var sfMap: { string?: cc.SpriteFrame[] } = {};
    /**
     * 设置图片
     * @param target node节点 或 sprite组件
     * @param url 资源路径 或 图集路径,资源名
     * @param ownerId 拥有目标的管理id 删除资源引用用的
     */
    export function setRes(target: cc.Node | cc.Sprite, url: string | string[], ownerId: string): void {
        let sprite = getSprite();
        sprite.init(target, url, ownerId);
    };

    /**
     * 销毁资源的引用计数
     * @param id 拥有者的id
     */
    export function destroySF(id: number | string): void {
        let list: cc.SpriteFrame[] = sfMap[id];
        list && list.forEach(sf => {
            sf.decRef();
        })
        sfMap[id] = null;
    }

    /**回收对象 */
    function recycle(sprite: Sprite): void {
        spritePool.push(sprite);
    }

    /**销毁对象池 */
    function destroy(): void {
        spritePool = [];
    }

    /**获取精灵纹理赋值实例 */
    function getSprite(): Sprite {
        let sprite: Sprite;
        if (spritePool.length) {
            sprite = spritePool.shift();
        } else {
            sprite = new Sprite();
        }
        return sprite;
    }

    /**注册资源的引用计数 */
    function regiseter(key, value: cc.SpriteFrame, atlas?: cc.SpriteAtlas): void {
        let list = sfMap[key] || [];
        value.addRef();
        list.push(value);
        if (atlas) {
            atlas.addRef();
            list.push(atlas);
        }
        sfMap[key] = list;
    }


    /**加载赋值纹理数据 */
    class Sprite {
        private ownerId: number | string;       //拥有者的id
        private target: any;                    //目标对象

        /**
         * 初始化
         * @param target node节点||sprite组件
         * @param url 资源路径 或 图集路径,资源名
         * @param ownerId 拥有者的id
         */
        public init(target: cc.Node | cc.Sprite, url: string | string[], ownerId?: number | string): void {
            this.target = target;
            this.ownerId = ownerId;
            let fileName: string;
            if (Array.isArray(url)) {
                fileName = url[1];
                url = url[0];
            }

            let reg = /http.?:\/\//;
            if (reg.test(url)) {    //是否远程图片
                this.loadRemote(url);
            } else {
                this.load(url, fileName);
            }
        };

        private load(atlas, res?): void {
            cc.resources.load(atlas, res ? cc.SpriteAtlas : cc.SpriteFrame, function (err, atlas) {
                if (res) {
                    this.setSprite(atlas.getSpriteFrame(res), atlas);
                } else {
                    this.setSprite(atlas);
                }
            }.bind(this));
        }

        private loadRemote(url): void {
            cc.assetManager.loadRemote(url, function (err, texture: cc.Texture2D) {
                let sp: any = new cc.SpriteFrame(texture)
                sp._uuid = url;
                !err && this.setSprite(sp);
            }.bind(this));
        }

        /**赋值资源 */
        private setSprite(frame: cc.SpriteFrame, atlas?: cc.SpriteAtlas): void {
            let sprite: cc.Sprite = this.target;

            if (this.target instanceof cc.Node) {
                this.target['_components'] && (sprite = this.target.getComponent('cc.Sprite'));
            }

            if (sprite) {
                regiseter(this.ownerId, frame, atlas);
                sprite.spriteFrame = frame;
            }

            this.target = null;
            this.ownerId = null;
            recycle(this);
        }
    }
}

