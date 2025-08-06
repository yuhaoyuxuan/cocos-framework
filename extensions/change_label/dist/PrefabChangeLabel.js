"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prefabChangeLabel = exports.PrefabChangeLabel = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const includesFile = [".scene", ".prefab"];
/**如果字体<=此值才修改 */
const FontSize = 18;
/**放大倍率 */
const RATIO = 2;
/**
 * 修改预制体文本
 */
class PrefabChangeLabel {
    constructor() {
        this.changeStr = "";
    }
    start(filePath) {
        this.changeStr = "";
        let filePaths = [];
        this.getAllPrefabs(filePath, filePaths);
        this.changeLabel(filePaths);
        Editor.Message.request("asset-db", "refresh-asset", filePath).then(async () => {
            console.warn(this.changeStr);
        });
    }
    /**
     * 获取路径下的所有预制体和场景文件
     * @param filePath 文件路径
     * @param list
     */
    getAllPrefabs(filePath, list) {
        let extname = path.extname(filePath);
        if (extname == "") { //文件夹
            let files = fs.readdirSync(filePath);
            files.forEach(file => {
                this.getAllPrefabs(path.join(filePath, file), list);
            });
        }
        else if (includesFile.includes(extname)) {
            list.push(filePath);
        }
    }
    /**获取节点组件 */
    getNodeComponent(objs, nowNode, type = "cc.UITransform") {
        let uiTransform;
        nowNode._components.forEach((comp) => {
            if (objs[comp.__id__].__type__ == type) {
                uiTransform = objs[comp.__id__];
            }
        });
        return uiTransform;
    }
    /**获取节点的大小 */
    getUITransformSize(objs, nowNode) {
        var _a, _b;
        let size = (_b = (_a = this.getNodeComponent(objs, nowNode)) === null || _a === void 0 ? void 0 : _a._contentSize) !== null && _b !== void 0 ? _b : {
            "width": 0,
            "height": 0
        };
        return size;
    }
    /**
     * 修改文本大小
     * @param filePath 文件路径
     */
    changeLabel(filePath) {
        if (Array.isArray(filePath)) {
            filePath.forEach(file => {
                this.changeLabel(file);
            });
            return;
        }
        try {
            let nowNode, parentNode;
            let isChanged = false;
            /**修改了Label的widget 需要自己复查确认一下 防止出错 */
            let changeWidgetLabel = "";
            /**Label有子项 需要自己复查确认一下 防止出错 */
            let subNodeLabel = "";
            let content = fs.readFileSync(filePath, "utf8");
            let objs = JSON.parse(content);
            objs.forEach(item => {
                if (item.__type__ == "cc.Label" && item.node && item._fontSize <= FontSize) {
                    isChanged = true;
                    //修改字体大小
                    item._fontSize = item._fontSize * RATIO;
                    nowNode = objs[item.node.__id__];
                    /**字体行高小于字体大小 会显示不全 */
                    if (item._lineHeight < item._fontSize) {
                        item._lineHeight = item._fontSize;
                    }
                    //使用了排版模式 需要把宽也修改
                    if (item._overflow > 0) {
                        this.getNodeComponent(objs, nowNode)._contentSize.width = this.getUITransformSize(objs, nowNode).width * RATIO;
                        if (this.getNodeComponent(objs, nowNode)._contentSize.height < item._fontSize) {
                            this.getNodeComponent(objs, nowNode)._contentSize.height = item._fontSize;
                        }
                    }
                    //修改字体节点缩放
                    nowNode._lscale.x /= RATIO;
                    nowNode._lscale.y /= RATIO;
                    //修改子项节点放大 父节点缩放倍数
                    if (nowNode._children) {
                        let subNode;
                        if (nowNode._children.length) {
                            subNodeLabel += nowNode._name + " ";
                        }
                        nowNode._children.forEach((sub) => {
                            subNode = objs[sub.__id__];
                            if (subNode) {
                                if (!subNode._lscale) {
                                    console.error(`path:${filePath} ${nowNode._name} 的子项有预制体 需要用户手动操作 缩放`);
                                    return;
                                }
                                subNode._lscale.x *= RATIO;
                                subNode._lscale.y *= RATIO;
                                let widget = this.getNodeComponent(objs, subNode, "cc.Widget");
                                const _alignFlags = 0;
                                if (widget) {
                                    const _alignFlags = widget._alignFlags;
                                    //左右*缩放值
                                    if (_alignFlags & 8) { //位值 8
                                        widget._left *= RATIO;
                                    }
                                    if (_alignFlags & 32) { //位值 32
                                        widget._right *= RATIO;
                                    }
                                    //单独的上下的话 需要修改值
                                    if (_alignFlags & 1) { //位值 1
                                        const offsetV = Math.abs(subNode._lpos.y + this.getUITransformSize(objs, subNode).height / RATIO);
                                        if (widget._top < 0) {
                                            widget._top += -offsetV;
                                        }
                                        else {
                                            widget._top += offsetV;
                                        }
                                    }
                                    if (_alignFlags & 4) { //位值 4
                                        const offsetV = Math.abs(subNode._lpos.y - this.getUITransformSize(objs, subNode).height / RATIO);
                                        if (widget._bottom < 0) {
                                            widget._bottom += -offsetV;
                                        }
                                        else {
                                            widget._bottom += offsetV;
                                        }
                                    }
                                }
                                //如果子节点没有widget 直接修改坐标
                                if (!(_alignFlags & 8 || _alignFlags & 32)) {
                                    subNode._lpos.x *= RATIO;
                                }
                                if (!(_alignFlags & 1 || _alignFlags & 4)) {
                                    subNode._lpos.y *= RATIO;
                                }
                            }
                        });
                    }
                    //如果本身节点有widget 需要锁定 防止位置错误
                    nowNode._components.forEach((comp) => {
                        if (objs[comp.__id__].__type__ == "cc.Widget") {
                            const widget = objs[comp.__id__];
                            const _alignFlags = widget._alignFlags;
                            let _lockFlags = widget._lockFlags;
                            //左右加锁就行
                            if (_alignFlags & 8) { //位值 8
                                _lockFlags = _lockFlags | 8;
                            }
                            if (_alignFlags & 32) { //位值 32
                                _lockFlags = _lockFlags | 32;
                            }
                            //单独的上下的话 需要修改值
                            if (_alignFlags & 1) { //位值 1
                                widget._top += this.getUITransformSize(objs, nowNode).height / 2 / 2;
                                _lockFlags = _lockFlags | 1;
                            }
                            if (_alignFlags & 4) { //位值 4
                                widget._bottom += this.getUITransformSize(objs, nowNode).height / 2 / 2;
                                _lockFlags = _lockFlags | 4;
                            }
                            if (widget._lockFlags != _lockFlags) {
                                widget._lockFlags = _lockFlags;
                                changeWidgetLabel += nowNode._name + " ";
                            }
                        }
                    });
                    //文本父节点
                    if (nowNode._parent) {
                        parentNode = objs[nowNode._parent.__id__];
                        parentNode._components.forEach((comp) => {
                            //父节点是否有 layout组件  子节点缩放影响布局 打开
                            if (objs[comp.__id__].__type__ == "cc.Layout") {
                                objs[comp.__id__]._affectedByScale = true;
                            }
                        });
                    }
                }
            });
            if (isChanged) {
                fs.writeFileSync(filePath, JSON.stringify(objs), "utf8");
                let str = filePath;
                if (changeWidgetLabel) {
                    str += "\n    need check Label Widget: " + changeWidgetLabel;
                }
                if (subNodeLabel) {
                    str += "\n    need check Label Children: " + subNodeLabel;
                }
                this.changeStr += `${str}\n`;
            }
        }
        catch (e) {
            console.error(`Error path:${filePath}`);
        }
    }
}
exports.PrefabChangeLabel = PrefabChangeLabel;
exports.prefabChangeLabel = new PrefabChangeLabel();
