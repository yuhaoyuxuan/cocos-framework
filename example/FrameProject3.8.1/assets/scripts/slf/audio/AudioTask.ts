import { AudioClip, AudioSource, Node } from "cc";

/**
 * 音频组件管理
 * 只有播放多次的音频使用
 * @author slf
 */
export class AudioTask {
    /**是否使用中 */
    public use: boolean;
    /**路径 */
    public path: string;
    /**音频组件 */
    public aSource: AudioSource;
    constructor(parent: Node) {
        let node = new Node("AudioTask");
        this.aSource = node.addComponent(AudioSource);
        node.parent = parent;
    }

    public stop(): void {
        this.aSource.stop();
        this.use = false;
    }

    /**播放音效 */
    public play(clip: AudioClip, path: string, volume: number = 1): void {
        this.use = true;
        this.aSource.clip = clip;
        this.aSource.loop = true;
        this.aSource.volume = volume;
        this.path = path;
        this.aSource.play();
    }

}