"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Menu = void 0;
const PrefabChangeLabel_1 = require("./PrefabChangeLabel");
function Menu(info) {
    return [
        {
            label: '字体高清',
            enabled: info.isDirectory || ['cc.SceneAsset', 'cc.Prefab'].includes(info.type),
            click() {
                PrefabChangeLabel_1.prefabChangeLabel.start(info.file);
            },
        }
    ];
}
exports.Menu = Menu;
