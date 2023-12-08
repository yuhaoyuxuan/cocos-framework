import { AudioClip, AudioSource } from "cc";
import { SingletonComponent } from "../common/SingletonComponent";
import { LocalStorageManager } from "../common/LocalStorageManager";
import { ResManager } from "../res/ResManager";
/**
 * 音频播放管理
 * @author slf
 */
export class AudioManager extends SingletonComponent {
    private AUDIO_ON_OFF: string = "AUDIO_ON_OFF";


    /**音效播放源组件 */
    private audioSource: AudioSource;
    /**音量 */
    private volumeScale: number = 1;

    private isOpen: boolean = false;

    protected init(): void {
        this.audioSource = this.node.addComponent(AudioSource);
        this.onOff(!(LocalStorageManager.Instance().get(this.AUDIO_ON_OFF) == "0"))
    }

    /**
     * 音频开关
     * @param isOpen 
     */
    public onOff(isOpen: boolean): void {
        if (this.isOpen == isOpen) {
            return;
        }

        this.isOpen = isOpen;
        if (!this.isOpen) {
            this.audioSource.pause();
        } else {
            this.audioSource.play();
        }
        LocalStorageManager.Instance().set(this.AUDIO_ON_OFF, isOpen ? "1" : "0");
    }

    /**
     * 播放音效
     * @param clip 路径或音频片段资源
     * @param owner 持有者，未传入用AudioManager ,ResManager销毁持有者的时候销毁资源
     * @param bundleName 包名 默认resources
     * @returns 
     */
    public play(clip: string | AudioClip, owner?: any, bundleName: string = "resources"): void {
        if (!this.isOpen) {
            return;
        }

        if (typeof (clip) != 'string') {
            this.audioSource.playOneShot(clip, this.volumeScale);
            return;
        }
        owner = owner || this;
        ResManager.Instance().load<AudioClip>(clip, AudioClip, owner, asset => {
            this.playBg(asset, owner)
        }, this, bundleName);
    }

    /**
    * 播放背景音乐
    * @param clip 路径或音频片段资源
    * @param owner 持有者，未传入用AudioManager ,ResManager销毁持有者的时候销毁资源
    * @param loop 是否循环播放
    * @param bundleName 包名 默认resources
    * @returns 
    */
    public playBg(clip: string | AudioClip, owner?: any, loop: boolean = true, bundleName: string = "resources"): void {
        if (typeof (clip) != 'string') {
            if (this.audioSource.clip) {
                this.audioSource.stop();
            }

            this.audioSource.clip = clip;
            this.audioSource.loop = loop;
            if (this.isOpen) {
                this.audioSource.play();
            } else {
                this.audioSource.stop();
            }
            return;
        }
        owner = owner || this;
        ResManager.Instance().load<AudioClip>(clip, AudioClip, owner, asset => {
            this.playBg(asset, owner, loop)
        }, this, bundleName);
    }
}


