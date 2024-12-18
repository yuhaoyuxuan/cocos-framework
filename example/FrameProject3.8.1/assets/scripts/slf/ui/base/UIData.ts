/**
 * ui数据
 * @author slf
 */
export default class UIData {
    /**界面id */
    public id: number;
    /**预制体路径 */
    public prefabPath: string;
    /**是否同步 */
    public isSync: boolean;
    /**包名 默认 resources */
    public bundleName: string;
    /**透传数据*/
    public data: any;
    /**防止加载中 关闭失败  加载成功后检测  为true关闭页面*/
    public closeFailed: boolean;
    /**父容器节点，默认未空，添加到layer层，如果有只会使用此节点为父节点 */
    public parentNode: any;

    /**
     * 初始化数据
     * @param id 界面唯一id
     * @param prefabPath 界面预制体路径 相对路径（bundle包内）
     * @param bundleName 包名 默认resources包
     * @param isSync 是否同步加载
     */
    constructor(id: number, prefabPath: string, isSync?: boolean) {
        this.id = id;
        this.prefabPath = prefabPath;
        this.isSync = isSync;
    }
}
