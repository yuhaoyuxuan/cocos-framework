import { _decorator, assetManager, Component, Node, Prefab, repeat, resources } from 'cc';
import { ResManager } from '../scripts/slf/res/ResManager';
import UIManager from '../scripts/slf/ui/UIManager';
import UIData from '../scripts/slf/ui/base/UIData';
import { TimerManager } from '../scripts/slf/timer/TimerManager';
const { ccclass, property } = _decorator;

@ccclass('TestUI')
export class TestUI extends Component {

    protected start(): void {
        UIManager.Instance().controller.register(new UIData(1, "prefabs/bag/BagUI"));
        UIManager.Instance().initRoot(this.node);
        TimerManager.Instance().on(1, (v) => {
            console.log(v);
        }, this, 5,5);

        TimerManager.Instance().once(1, (v) => {
            console.log(v);
        }, this, 456);

        TimerManager.Instance().on(1, (v) => {
            console.log(v);
        }, this, 6);
    }


    openBag(): void {
        //打开预制体
        UIManager.Instance().openUI(1);
        let str = "测试数据{0},{1}";
        let str1 = str.format(1, 2);
        console.log(str1);
        TimerManager.Instance().targetOff(this);
    }
}


