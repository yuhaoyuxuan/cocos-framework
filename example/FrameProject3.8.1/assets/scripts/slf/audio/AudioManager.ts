import { AudioClip, AudioSource } from "cc";
import { SingletonComponent } from "../common/SingletonComponent";
import { LocalStorageManager } from "../common/LocalStorageManager";
import { ResManager } from "../res/ResManager";
import { AudioTask } from "./AudioTask";
/**
 * 音频播放管理
 * @author slf
 */
export class AudioManager extends SingletonComponent {
    private AUDIO_ON_OFF: string = "AUDIO_ON_OFF";
    /**音频管理队列 循环播放 */
    private list: AudioTask[];
    /**一次音效播放 */
    private oneShotAudioSource: AudioSource;
    /**背景音效 */
    private bgAudioSource: AudioSource;
    /**背景音效路径 */
    private bgPath: string;
    /**音量 */
    private volumeScale: number = 1;
    private isOpen: boolean = false;



    protected init(): void {
        this.oneShotAudioSource = this.node.addComponent(AudioSource);
        this.bgAudioSource = new AudioTask(this.node).aSource;
        this.onOff = !(LocalStorageManager.Instance().get(this.AUDIO_ON_OFF) == "0");
        this.list = [];
        for (let i = 0; i < 5; i++) {
            this.list.push(new AudioTask(this.node));
        }

    }

    public get onOff(): boolean {
        return this.isOpen;
    }

    /**
     * 音频开关
     * @param isOpen 
     */
    public set onOff(isOpen: boolean) {
        if (this.isOpen == isOpen) {
            return;
        }

        this.isOpen = isOpen;
        if (!this.isOpen) {
            this.bgAudioSource.pause();
            this.stopAllLoop();
        } else {
            this.bgAudioSource.play();
        }
        LocalStorageManager.Instance().set(this.AUDIO_ON_OFF, isOpen ? "1" : "0");
    }

    /**
     * 播放音效
     * @param path 路径 
     * @param owner 持有者
     * @param loop 循环播放
     * @param volume 播放音量0-1
     * @param bundleName 资源归属包名
     * @returns 
     */
    public play(path: string, owner?: any, volume: number = 1, bundleName: string = "resources"): void {
        if (!this.isOpen) {
            return;
        }

        ResManager.Instance().load<AudioClip>(path, AudioClip, owner || this, asset => {
            if (this.isOpen) {
                this.oneShotAudioSource.playOneShot(asset, volume * this.volumeScale);
            }
        }, this, bundleName);
    }


    /**播放循环音效 */
    public playLoop(path: string, owner?: any, volume: number = 1, bundleName: string = "resources"): void {
        if (!this.isOpen) {
            return;
        }

        ResManager.Instance().load<AudioClip>(path, AudioClip, owner || this, asset => {
            this.isOpen && this.getAudioTask().play(asset, path, volume * this.volumeScale);
        }, this, bundleName);
    }

    /**
    * 播放背景音乐
    * @param clip 路径
    * @param owner 持有者，未传入用AudioManager ,ResManager销毁持有者的时候销毁资源
    * @param volume 音量0-1
    * @param bundleName 包名 默认resources
    * @returns 
    */
    public playBg(clip: string | AudioClip, owner?: any, volume: number = 1, bundleName: string = "resources"): void {
        if (typeof (clip) != 'string') {
            if (this.bgAudioSource.clip) {
                this.bgAudioSource.stop();
            }
            this.bgAudioSource.volume = this.volumeScale * volume;
            this.bgAudioSource.clip = clip;
            this.bgAudioSource.loop = true;
            if (this.isOpen) {
                this.bgAudioSource.play();
            } else {
                this.bgAudioSource.stop();
            }
            return;
        }
        owner = owner || this;
        if (clip == this.bgPath) {
            this.isPauseBg(false);
            return;
        }
        this.bgPath = clip;
        ResManager.Instance().load<AudioClip>(clip, AudioClip, owner, asset => {
            this.playBg(asset, owner, volume * this.volumeScale)
        }, this, bundleName);
    }

    /**是否暂停背景音乐  */
    private isPauseBg(pause: boolean): void {
        if (pause) {
            this.bgAudioSource.pause();
        } else if (this.isOpen) {
            this.bgAudioSource.play();
        }
    }

    /**
     * 停止循环音效
     * @param path 音效路径 
     */
    public stopLoop(path: string): void {
        if (path == this.bgPath) {
            this.isPauseBg(true);
            return;
        }
        this.list.forEach(task => {
            if (task.use && task.path == path) {
                task.stop();
            }
        })
    }

    /**停止所有正在循环播放的音效 */
    private stopAllLoop(): void {
        this.list.forEach(task => {
            task.use && task.stop();
        })
    }

    private getAudioTask(): AudioTask {
        for (let i = 0; i < this.list.length; i++) {
            if (!this.list[i].use) {
                return this.list[i];
            }
        }
    }
}


