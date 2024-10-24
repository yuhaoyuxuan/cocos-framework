import path, * as Path from "path";
import * as fs from 'fs';

/**压缩预设id */
const PRESET_ID: string = "beOn76N3VKL7cRubDb/ogF";
/**预设压缩开关 */
const PERSET_SWITCH: boolean = true;
/**
 * @en Registration method for the main process of Extension
 * @zh 为扩展的主进程的注册方法
 */
export const methods: { [key: string]: (...any: any) => any } = {
    /**
     * @en A method that can be triggered by message
     * @zh 通过 message 触发的方法
     */
    presetId() {
        console.log(`纹理压缩预设开关:${PERSET_SWITCH}   预设ID:${PRESET_ID}`);
        changeTexturePreset(Editor.Project.path)
    }
};

/**
* 递归目录检测所有纹理的meta文件 修改压缩预设id
*/
function changeTexturePreset(dir: string) {
    var stat = fs.statSync(dir);
    if (!stat.isDirectory()) {
        return;
    }

    let filePaths = fs.readdirSync(dir);
    let filePath;
    for (var i = 0; i < filePaths.length; ++i) {
        if (filePaths[i][0] === ".") {
            continue;
        }
        filePath = path.join(dir, filePaths[i]);
        stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            changeTexturePreset(filePath);
        } else if (stat.isFile()) {
            var metastr = filePath.substring(filePath.length - 5, filePath.length);
            if ((filePath.indexOf(".png.") != -1 || filePath.indexOf(".jpg.") != -1 || filePath.indexOf(".pac.") != -1) && metastr == ".meta") {
                var jstr = fs.readFileSync(filePath, "utf-8");
                var json = JSON.parse(jstr);
                let isChange: boolean = false;
                if (PERSET_SWITCH) {
                    if (!json.userData.compressSettings?.useCompressTexture) {
                        isChange = true;
                    }
                } else {
                    if (json.userData.compressSettings?.useCompressTexture) {
                        isChange = true;
                    }
                }
                if (isChange) {
                    json.userData.compressSettings = {
                        "useCompressTexture": PERSET_SWITCH,
                        "presetId": PRESET_ID
                    }
                    fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
                }
            }
        }
    }
}

/**
 * @en Method Triggered on Extension Startup
 * @zh 扩展启动时触发的方法
 */
export function load() { }

/**
 * @en Method triggered when uninstalling the extension
 * @zh 卸载扩展时触发的方法
 */
export function unload() { }
