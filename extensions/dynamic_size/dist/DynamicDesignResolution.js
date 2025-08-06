"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicDesignResolution = exports.DesignResolution = exports.DesignResolutionType = void 0;
const fs_1 = __importDefault(require("fs"));
/**设计分辨率类型 */
var DesignResolutionType;
(function (DesignResolutionType) {
    /**H5移动端分辨率 */
    DesignResolutionType["Mobile"] = "Mobile";
    /**电脑端分辨率 */
    DesignResolutionType["PC"] = "PC";
    /**电脑端游戏内分辨率 */
    DesignResolutionType["PC_Game"] = "PC_Game";
})(DesignResolutionType = exports.DesignResolutionType || (exports.DesignResolutionType = {}));
exports.DesignResolution = {
    /**H5移动端分辨率 */
    "Mobile": { width: 750, height: 1624, fitHeight: true, fitWidth: false },
    /**电脑端分辨率 */
    "PC": { width: 1366, height: 956, fitHeight: false, fitWidth: true },
    /**电脑端游戏内分辨率 */
    "PC_Game": { width: 1024, height: 717, fitHeight: false, fitWidth: true },
};
/**
 * 动态修改项目设计分辨率和适配模式
 */
class DynamicDesignResolution {
    init() {
        // Editor.Message.addBroadcastListener("scene:ready", (uuid: string) => {
        //     if (!uuid) {
        //         return;
        //     }
        //     Editor.Message.request('asset-db', 'query-asset-info', uuid).then(async info => {
        //         if (info && info.type === 'cc.Prefab') {
        //             let isPC = info.name.toLowerCase().indexOf("_pc.prefab") != -1;
        //             let size = isPC ? PC_designResolution : Mobile_designResolution;
        //             let path = Editor.Project.path + "/settings/v2/packages/project.json";
        //             let files = fs.readFileSync(path, "utf8");
        //             let content = JSON.parse(files);
        //             if (content.general.designResolution.width != size.width || content.general.designResolution.height != size.height) {
        //                 //修改完成后，刷新分辨率
        //                 Editor.Profile.setProject("project", "general.designResolution.width", size.width);
        //                 Editor.Profile.setProject("project", "general.designResolution.height", size.height);
        //                 Editor.Profile.setProject("project", "general.designResolution.fitWidth", size.fitWidth);
        //                 Editor.Profile.setProject("project", "general.designResolution.fitHeight", size.fitHeight);
        //                 console.log("————change designResolution", size.width, size.height);
        //             }
        //         }
        //     });
        // });
    }
    /**
     * 设置设计分辨率
     * @param type 设计分辨率类型
     * @returns
     */
    setDesignResolution(type) {
        let size = exports.DesignResolution[type];
        if (!size) {
            console.error("DynamicDesignResolution setDesignResolution error: ", type);
            return;
        }
        this.changeDesignResolution(size);
    }
    changeDesignResolution(size) {
        let path = Editor.Project.path + "/settings/v2/packages/project.json";
        let files = fs_1.default.readFileSync(path, "utf8");
        let content = JSON.parse(files);
        if (content.general.designResolution.width != size.width || content.general.designResolution.height != size.height) {
            //修改完成后，刷新分辨率
            Editor.Profile.setProject("project", "general.designResolution.width", size.width);
            Editor.Profile.setProject("project", "general.designResolution.height", size.height);
            Editor.Profile.setProject("project", "general.designResolution.fitWidth", size.fitWidth);
            Editor.Profile.setProject("project", "general.designResolution.fitHeight", size.fitHeight);
            console.log("————change designResolution", size.width, size.height);
        }
    }
}
exports.DynamicDesignResolution = DynamicDesignResolution;
