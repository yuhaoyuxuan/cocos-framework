import { AudioClip, AudioSource } from "cc";
import { SingletonComponent } from "../common/SingletonComponent";
/**
 * 音频播放管理
 * @author slf
 */
export class AudioManager extends SingletonComponent {
    /**音效播放源组件 */
    private audioSource: AudioSource;
    /**音量 */
    private volumeScale: number = 1;

    private isOpen: boolean;

    protected init(): void {
        this.audioSource = this.node.getComponent(AudioSource);
    }

    /**
     * 音频开关
     * @param isOpen 
     */
    public onOff(isOpen: boolean): void {
        this.isOpen = isOpen;
        if (!this.isOpen) {
            this.audioSource.pause();
        } else {
            this.audioSource.play();
        }
    }

    /**播放音效 */
    public play(clip: string | AudioClip): void {

    }

    /**播放背景音乐 */
    public playBg(clip: string | AudioClip, loop: boolean): void {
        
    }
}


