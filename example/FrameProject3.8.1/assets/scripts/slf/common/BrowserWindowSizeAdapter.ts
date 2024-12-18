import { sys } from "cc";
import { Size } from "cc";
import { settings, Settings, screen } from "cc";
import { EDITOR } from "cc/env";

/**
 * pc浏览器窗口大小适配
 * 项目设置改为适配屏幕高度
 * 发布web-mobile包后 根据浏览器窗口大小 修改当前窗口的物理像素尺寸
 */
class BrowserWindowSizeAdapter {
    private oldSize: Size;
    private newSize: Size;
    private timer: any;
    constructor() {
        if (!sys.isNative && !sys.isMobile && sys.isBrowser) {
            this.newSize = new Size();
            settings.overrideSettings(Settings.Category.SCREEN, 'exactFitScreen', false);
            screen.init();
            this.oldSize = new Size(0, 0);
            window.addEventListener('resize', this.delayUpdate.bind(this));
            this.delayUpdate();
        }
    }

    /**延迟50ms刷新 */
    private delayUpdate(): void {
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(this.updateWindowSize.bind(this), 50);
    }

    /**
     * 更新窗口大小
     */
    public updateWindowSize() {
        let resultWidth = window.innerWidth;
        let resultHeight = window.innerHeight;
        if (resultWidth == this.oldSize.width && resultHeight == this.oldSize.height) {
            return;
        }
        this.oldSize.width = resultWidth;
        this.oldSize.height = resultHeight;


        let ratio = resultHeight / resultWidth;
        if (ratio > 2.2) {
            resultHeight = resultWidth * 2.2;
        }
        if (ratio < 1.5) {
            resultWidth = resultHeight / 1.5;
        }
        this.newSize.width = resultWidth * screen.devicePixelRatio;
        this.newSize.height = resultHeight * screen.devicePixelRatio;
        screen.windowSize = this.newSize;
    }
}
!EDITOR && new BrowserWindowSizeAdapter();


