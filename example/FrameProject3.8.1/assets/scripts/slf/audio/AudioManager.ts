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
    private AUDIO_MUSIC_ON_OFF: string = "AUDIO_MUSIC_ON_OFF";
    private AUDIO_SOUND_ON_OFF: string = "AUDIO_SOUND_ON_OFF";
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
    /**背景音乐 */
    private _isMusicOpen: boolean = false;
    /**音效 */
    private _isSoundOpen: boolean = false;



    protected init(): void {
        this.oneShotAudioSource = this.node.addComponent(AudioSource);
        this.bgAudioSource = new AudioTask(this.node).aSource;
        this._isMusicOpen = !(LocalStorageManager.Instance().get(this.AUDIO_MUSIC_ON_OFF) == "0");
        this._isSoundOpen = !(LocalStorageManager.Instance().get(this.AUDIO_SOUND_ON_OFF) == "0");
        this.list = [];
        for (let i = 0; i < 5; i++) {
            this.list.push(new AudioTask(this.node));
        }

    }

    /**
  * 音效开关
  * @param isOpen 
  */
    public get isSoundOpen(): boolean {
        return this._isSoundOpen;
    }

    public set isSoundOpen(isOpen: boolean) {
        if (this._isSoundOpen == isOpen) {
            return;
        }
        this._isSoundOpen = isOpen;
        LocalStorageManager.Instance().set(this.AUDIO_SOUND_ON_OFF, isOpen ? "1" : "0");
    }

    /**
    * 背景音乐开关
    * @param isOpen 
    */
    public get isMusicOpen(): boolean {
        return this._isMusicOpen;
    }
    public set isMusicOpen(isOpen: boolean) {
        if (this._isMusicOpen == isOpen) {
            return;
        }
        this._isMusicOpen = isOpen;
        if (!this._isMusicOpen) {
            this.bgAudioSource.pause();
            this.stopAllLoop();
        } else {
            this.bgAudioSource.play();
        }
        LocalStorageManager.Instance().set(this.AUDIO_MUSIC_ON_OFF, isOpen ? "1" : "0");
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
        if (!this.isSoundOpen) {
            return;
        }

        ResManager.Instance().load<AudioClip>(path, AudioClip, owner || this, asset => {
            if (this.isSoundOpen) {
                this.oneShotAudioSource.playOneShot(asset, volume * this.volumeScale);
            }
        }, this, bundleName);
    }


    /**播放循环音效 */
    public playLoop(path: string, owner?: any, volume: number = 1, bundleName: string = "resources"): void {
        if (!this.isSoundOpen) {
            return;
        }

        ResManager.Instance().load<AudioClip>(path, AudioClip, owner || this, asset => {
            this.isSoundOpen && this.getAudioTask().play(asset, path, volume * this.volumeScale);
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
            if (this.isMusicOpen) {
                this.bgAudioSource.play();
            } else {
                this.bgAudioSource.stop();
            }
            return;
        }
        owner = owner || this;
        if (clip == this.bgPath) {
            // this.isPauseBg(false);
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
        } else if (this.isMusicOpen) {
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


