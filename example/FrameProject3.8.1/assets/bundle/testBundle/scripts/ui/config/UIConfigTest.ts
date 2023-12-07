import UIManager from "../../../../../scripts/slf/ui/UIManager";
import UIData from "../../../../../scripts/slf/ui/base/UIData";

/**
 * ui主包界面id
 */
export enum UITestId {
    /**测试主界面 */
    TestMain = 100,
    /**测试预制体 */
    TestPrefab,
}

/**
 * 主包ui配置列表
 */
export class UIConfigTest {
    private bundleName: string = "testBundle";
    private uiDataList: UIData[] = [
        new UIData(UITestId.TestMain, "preload/TestMain", this.bundleName),
        new UIData(UITestId.TestPrefab, "prefabs/TestPrefab", this.bundleName),
    ];

    public init(): void {
        UIManager.Instance().controller.register(this.uiDataList);
    }
}

let ui = new UIConfigTest().init();



