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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.methods = void 0;
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
/**压缩预设id */
const PRESET_ID = "beOn76N3VKL7cRubDb/ogF";
/**预设压缩开关 */
const PERSET_SWITCH = true;
/**
 * @en Registration method for the main process of Extension
 * @zh 为扩展的主进程的注册方法
 */
exports.methods = {
    /**
     * @en A method that can be triggered by message
     * @zh 通过 message 触发的方法
     */
    presetId() {
        console.log(`纹理压缩预设开关:${PERSET_SWITCH}   预设ID:${PRESET_ID}`);
        changeTexturePreset(Editor.Project.path);
    }
};
/**
* 递归目录检测所有纹理的meta文件 修改压缩预设id
*/
function changeTexturePreset(dir) {
    var _a, _b;
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
        filePath = path_1.default.join(dir, filePaths[i]);
        stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            changeTexturePreset(filePath);
        }
        else if (stat.isFile()) {
            var metastr = filePath.substring(filePath.length - 5, filePath.length);
            if ((filePath.indexOf(".png.") != -1 || filePath.indexOf(".jpg.") != -1 || filePath.indexOf(".pac.") != -1) && metastr == ".meta") {
                var jstr = fs.readFileSync(filePath, "utf-8");
                var json = JSON.parse(jstr);
                let isChange = false;
                if (PERSET_SWITCH) {
                    if (!((_a = json.userData.compressSettings) === null || _a === void 0 ? void 0 : _a.useCompressTexture)) {
                        isChange = true;
                    }
                }
                else {
                    if ((_b = json.userData.compressSettings) === null || _b === void 0 ? void 0 : _b.useCompressTexture) {
                        isChange = true;
                    }
                }
                if (isChange) {
                    json.userData.compressSettings = {
                        "useCompressTexture": PERSET_SWITCH,
                        "presetId": PRESET_ID
                    };
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
function load() { }
exports.load = load;
/**
 * @en Method triggered when uninstalling the extension
 * @zh 卸载扩展时触发的方法
 */
function unload() { }
exports.unload = unload;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NvdXJjZS9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsZ0RBQW1DO0FBQ25DLHVDQUF5QjtBQUV6QixZQUFZO0FBQ1osTUFBTSxTQUFTLEdBQVcsd0JBQXdCLENBQUM7QUFDbkQsWUFBWTtBQUNaLE1BQU0sYUFBYSxHQUFZLElBQUksQ0FBQztBQUNwQzs7O0dBR0c7QUFDVSxRQUFBLE9BQU8sR0FBNEM7SUFDNUQ7OztPQUdHO0lBQ0gsUUFBUTtRQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxhQUFhLFdBQVcsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUM3RCxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzVDLENBQUM7Q0FDSixDQUFDO0FBRUY7O0VBRUU7QUFDRixTQUFTLG1CQUFtQixDQUFDLEdBQVc7O0lBQ3BDLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDO1FBQ3RCLE9BQU87SUFDWCxDQUFDO0lBRUQsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNwQyxJQUFJLFFBQVEsQ0FBQztJQUNiLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFDeEMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDMUIsU0FBUztRQUNiLENBQUM7UUFDRCxRQUFRLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDN0IsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQztZQUNyQixtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNsQyxDQUFDO2FBQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQztZQUN2QixJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN2RSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLElBQUksT0FBTyxFQUFFLENBQUM7Z0JBQ2hJLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUM5QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUM1QixJQUFJLFFBQVEsR0FBWSxLQUFLLENBQUM7Z0JBQzlCLElBQUksYUFBYSxFQUFFLENBQUM7b0JBQ2hCLElBQUksQ0FBQyxDQUFBLE1BQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsMENBQUUsa0JBQWtCLENBQUEsRUFBRSxDQUFDO3dCQUN0RCxRQUFRLEdBQUcsSUFBSSxDQUFDO29CQUNwQixDQUFDO2dCQUNMLENBQUM7cUJBQU0sQ0FBQztvQkFDSixJQUFJLE1BQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsMENBQUUsa0JBQWtCLEVBQUUsQ0FBQzt3QkFDckQsUUFBUSxHQUFHLElBQUksQ0FBQztvQkFDcEIsQ0FBQztnQkFDTCxDQUFDO2dCQUNELElBQUksUUFBUSxFQUFFLENBQUM7b0JBQ1gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsR0FBRzt3QkFDN0Isb0JBQW9CLEVBQUUsYUFBYTt3QkFDbkMsVUFBVSxFQUFFLFNBQVM7cUJBQ3hCLENBQUE7b0JBQ0QsRUFBRSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlELENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7QUFDTCxDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsU0FBZ0IsSUFBSSxLQUFLLENBQUM7QUFBMUIsb0JBQTBCO0FBRTFCOzs7R0FHRztBQUNILFNBQWdCLE1BQU0sS0FBSyxDQUFDO0FBQTVCLHdCQUE0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoLCAqIGFzIFBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xyXG5cclxuLyoq5Y6L57yp6aKE6K6+aWQgKi9cclxuY29uc3QgUFJFU0VUX0lEOiBzdHJpbmcgPSBcImJlT243Nk4zVktMN2NSdWJEYi9vZ0ZcIjtcclxuLyoq6aKE6K6+5Y6L57yp5byA5YWzICovXHJcbmNvbnN0IFBFUlNFVF9TV0lUQ0g6IGJvb2xlYW4gPSB0cnVlO1xyXG4vKipcclxuICogQGVuIFJlZ2lzdHJhdGlvbiBtZXRob2QgZm9yIHRoZSBtYWluIHByb2Nlc3Mgb2YgRXh0ZW5zaW9uXHJcbiAqIEB6aCDkuLrmianlsZXnmoTkuLvov5vnqIvnmoTms6jlhozmlrnms5VcclxuICovXHJcbmV4cG9ydCBjb25zdCBtZXRob2RzOiB7IFtrZXk6IHN0cmluZ106ICguLi5hbnk6IGFueSkgPT4gYW55IH0gPSB7XHJcbiAgICAvKipcclxuICAgICAqIEBlbiBBIG1ldGhvZCB0aGF0IGNhbiBiZSB0cmlnZ2VyZWQgYnkgbWVzc2FnZVxyXG4gICAgICogQHpoIOmAmui/hyBtZXNzYWdlIOinpuWPkeeahOaWueazlVxyXG4gICAgICovXHJcbiAgICBwcmVzZXRJZCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhg57q555CG5Y6L57yp6aKE6K6+5byA5YWzOiR7UEVSU0VUX1NXSVRDSH0gICDpooTorr5JRDoke1BSRVNFVF9JRH1gKTtcclxuICAgICAgICBjaGFuZ2VUZXh0dXJlUHJlc2V0KEVkaXRvci5Qcm9qZWN0LnBhdGgpXHJcbiAgICB9XHJcbn07XHJcblxyXG4vKipcclxuKiDpgJLlvZLnm67lvZXmo4DmtYvmiYDmnInnurnnkIbnmoRtZXRh5paH5Lu2IOS/ruaUueWOi+e8qemihOiuvmlkXHJcbiovXHJcbmZ1bmN0aW9uIGNoYW5nZVRleHR1cmVQcmVzZXQoZGlyOiBzdHJpbmcpIHtcclxuICAgIHZhciBzdGF0ID0gZnMuc3RhdFN5bmMoZGlyKTtcclxuICAgIGlmICghc3RhdC5pc0RpcmVjdG9yeSgpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBmaWxlUGF0aHMgPSBmcy5yZWFkZGlyU3luYyhkaXIpO1xyXG4gICAgbGV0IGZpbGVQYXRoO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWxlUGF0aHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICBpZiAoZmlsZVBhdGhzW2ldWzBdID09PSBcIi5cIikge1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmlsZVBhdGggPSBwYXRoLmpvaW4oZGlyLCBmaWxlUGF0aHNbaV0pO1xyXG4gICAgICAgIHN0YXQgPSBmcy5zdGF0U3luYyhmaWxlUGF0aCk7XHJcbiAgICAgICAgaWYgKHN0YXQuaXNEaXJlY3RvcnkoKSkge1xyXG4gICAgICAgICAgICBjaGFuZ2VUZXh0dXJlUHJlc2V0KGZpbGVQYXRoKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXQuaXNGaWxlKCkpIHtcclxuICAgICAgICAgICAgdmFyIG1ldGFzdHIgPSBmaWxlUGF0aC5zdWJzdHJpbmcoZmlsZVBhdGgubGVuZ3RoIC0gNSwgZmlsZVBhdGgubGVuZ3RoKTtcclxuICAgICAgICAgICAgaWYgKChmaWxlUGF0aC5pbmRleE9mKFwiLnBuZy5cIikgIT0gLTEgfHwgZmlsZVBhdGguaW5kZXhPZihcIi5qcGcuXCIpICE9IC0xIHx8IGZpbGVQYXRoLmluZGV4T2YoXCIucGFjLlwiKSAhPSAtMSkgJiYgbWV0YXN0ciA9PSBcIi5tZXRhXCIpIHtcclxuICAgICAgICAgICAgICAgIHZhciBqc3RyID0gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoLCBcInV0Zi04XCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGpzb24gPSBKU09OLnBhcnNlKGpzdHIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGlzQ2hhbmdlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBpZiAoUEVSU0VUX1NXSVRDSCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghanNvbi51c2VyRGF0YS5jb21wcmVzc1NldHRpbmdzPy51c2VDb21wcmVzc1RleHR1cmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDaGFuZ2UgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGpzb24udXNlckRhdGEuY29tcHJlc3NTZXR0aW5ncz8udXNlQ29tcHJlc3NUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQ2hhbmdlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNDaGFuZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBqc29uLnVzZXJEYXRhLmNvbXByZXNzU2V0dGluZ3MgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXNlQ29tcHJlc3NUZXh0dXJlXCI6IFBFUlNFVF9TV0lUQ0gsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJlc2V0SWRcIjogUFJFU0VUX0lEXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMoZmlsZVBhdGgsIEpTT04uc3RyaW5naWZ5KGpzb24sIG51bGwsIDIpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEBlbiBNZXRob2QgVHJpZ2dlcmVkIG9uIEV4dGVuc2lvbiBTdGFydHVwXHJcbiAqIEB6aCDmianlsZXlkK/liqjml7bop6blj5HnmoTmlrnms5VcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2FkKCkgeyB9XHJcblxyXG4vKipcclxuICogQGVuIE1ldGhvZCB0cmlnZ2VyZWQgd2hlbiB1bmluc3RhbGxpbmcgdGhlIGV4dGVuc2lvblxyXG4gKiBAemgg5Y246L295omp5bGV5pe26Kem5Y+R55qE5pa55rOVXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gdW5sb2FkKCkgeyB9XHJcbiJdfQ==