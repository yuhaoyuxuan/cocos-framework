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

    protected init(): void {
        this.audioSource = this.node.getComponent(AudioSource);

        this.audioSource
    }

    /**播放音效 */
    public play(clip: string | AudioClip): void {
    }

    /**播放背景音乐 */
    public playBg(clip: string | AudioClip, loop: boolean): void {

    }
}


