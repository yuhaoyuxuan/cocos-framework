"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.methods = void 0;
const DynamicDesignResolution_1 = require("./DynamicDesignResolution");
let dr = new DynamicDesignResolution_1.DynamicDesignResolution();
/**
 * @en Registration method for the main process of Extension
 * @zh 为扩展的主进程的注册方法
 * 动态修改项目设计分辨率和适配模式
 */
exports.methods = {
    Mobile: () => {
        dr.setDesignResolution(DynamicDesignResolution_1.DesignResolutionType.Mobile);
    },
    PC: () => {
        dr.setDesignResolution(DynamicDesignResolution_1.DesignResolutionType.PC);
    },
    PC_Game: () => {
        dr.setDesignResolution(DynamicDesignResolution_1.DesignResolutionType.PC_Game);
    }
};
/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
function load() {
    console.log("DynamicDesignResolution load");
}
exports.load = load;
/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
function unload() { }
exports.unload = unload;
