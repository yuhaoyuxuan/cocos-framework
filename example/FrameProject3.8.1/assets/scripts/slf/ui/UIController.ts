import UIData from "./base/UIData";

/**
 * 视图控制器  ui id绑定数据 
 * @author slf
 * */
export default class UIController {
    private uiDataMap: Map<number, UIData> = new Map();
    // this.register(new UIData(1, "test/prefabs/testUI"))
    // this.register(new UIData(2, "test/prefabs/testUI1", "resources"))
    // this.register(new UIData(2, "test/prefabs/testUI1", "resources", false));
    
    /**
     * 注册ui数据
     * @param uiId ui唯一标识
     * @param data ui数据
     */
    public register(data: UIData): void {
        if (this.uiDataMap.has(data.id)) {
            console.error("register error id same =" + data.id);
        }
        else {
            this.uiDataMap.set(data.id, data);
        }
    }

    /**
     * 获取ui数据
     * @param uiId ui唯一标识
     * @returns 
     */
    public getUIData(uiId: number): UIData {
        if (this.uiDataMap.has(uiId)) {
            return this.uiDataMap.get(uiId);
        }
        console.error("none uiId Data " + uiId);
        return null;
    }
}