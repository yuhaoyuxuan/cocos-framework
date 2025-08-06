import { DesignResolutionType, DynamicDesignResolution } from "./DynamicDesignResolution";


let dr:DynamicDesignResolution = new DynamicDesignResolution();
/**
 * @en Registration method for the main process of Extension
 * @zh 为扩展的主进程的注册方法
 * 动态修改项目设计分辨率和适配模式
 */
export const methods: { [key: string]: (...any: any) => any } = {
   Mobile: ()=>{
      dr.setDesignResolution(DesignResolutionType.Mobile);
   },
   PC: ()=>{
      dr.setDesignResolution(DesignResolutionType.PC);
   },
   PC_Game: ()=>{
      dr.setDesignResolution(DesignResolutionType.PC_Game);
   }
};

/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
export function load() {
   console.log("DynamicDesignResolution load");
}

/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
export function unload() { }
