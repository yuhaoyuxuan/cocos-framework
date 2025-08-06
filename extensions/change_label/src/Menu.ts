import { AssetInfo } from "../@types/packages/asset-db/@types/public";
import { prefabChangeLabel } from "./PrefabChangeLabel";

export function Menu(info: AssetInfo) {
    return [
        {
            label: '字体高清',
            enabled: info.isDirectory || ['cc.SceneAsset', 'cc.Prefab'].includes(info.type),
            click() {
                prefabChangeLabel.start(info.file);
            },
        }
    ];
}