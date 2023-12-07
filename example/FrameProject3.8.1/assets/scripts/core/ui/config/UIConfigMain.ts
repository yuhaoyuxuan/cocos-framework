import UIManager from "../../../slf/ui/UIManager";
import UIData from "../../../slf/ui/base/UIData";

/**
 * ui主包界面id
 */
export enum UIMainId {
    /**对话框 */
    Dialog = 1,
    /**加载转圈 */
    Loading,
}

/**
 * 主包ui配置列表
 */
export class UIConfigMain {
    private bundleName: string = "resources";
    private uiDataList: UIData[] = [
        new UIData(UIMainId.Dialog, "preload/Dialog", this.bundleName),
        new UIData(UIMainId.Loading, "preload/Loading", this.bundleName),
    ];

    public init(): void {
        UIManager.Instance().controller.register(this.uiDataList);
    }
}



