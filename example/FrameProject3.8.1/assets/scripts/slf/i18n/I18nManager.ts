import { Singleton } from '../common/Singleton';
import { I18nComponentBase } from './component/I18nComponentBase';
/**
 * 多语言管理
 * @author slf
 */
export class I18nManager extends Singleton {
    /**当前语言代码 */
    private languageCode: string = "en";
    /**当前语言配置表 */
    private languageConfig: { [key: string]: string } = {};
    /**子项列表 */
    private list: I18nComponentBase[] = [];
    protected init(): void {
        this.changeLanguage(this.languageCode);
    }
    /**获取多语言code */
    public get lgCode():string{
        return this.languageCode;
    }

    /**
     * 改变语言
     * @param languageCode 语言代码 
     */
    public changeLanguage(languageCode: string): void {
        if (!this.checkLanguageCode(languageCode)) {
            return;
        }
        this.languageCode = languageCode;
        this.languageConfig = globalThis.i18nConfig[languageCode];
        this.refresh();
    }

    /**
     * 获取多语言
     * @param key key
     * @param def 未取到默认值 没有默认值返回key
     * @returns 
     */
    public getLg(key: string, def: string = ""): string {
        if (this.languageConfig[key]) {
            return this.languageConfig[key];
        }
        if (def != "") {
            return def;
        }
        return key;
    }

    /**
     * 检测多语言key
     */
    private checkLanguageCode(code: string): boolean {
        if (!globalThis.i18nConfig[code]) {
            console.error("none language code=" + code);
            return false;
        }
        return true;
    }

    /**刷新多语言 */
    private refresh(): void {
        this.list.forEach(v => v.refresh());
    }

    /**注册多语言变化 */
    public on(i18n: I18nComponentBase): void {
        this.list.push(i18n);
    }
    /**移除注册 */
    public off(i18n: I18nComponentBase): void {
        let idx = this.list.indexOf(i18n);
        if (idx != -1) {
            this.list.splice(idx, 1);
        }
    }
}


