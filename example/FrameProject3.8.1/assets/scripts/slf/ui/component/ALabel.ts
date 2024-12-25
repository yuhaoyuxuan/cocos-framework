
import { Enum } from 'cc';
import { Overflow } from 'cc';
import { NodeEventType } from 'cc';
import { UITransform } from 'cc';
import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { EDITOR } from 'cc/env';
const { ccclass, property } = _decorator;

/**
 * @en Enum for Overflow.
 *
 * @zh 文本类型。
 */
export enum LabelType {
    NONE,
    /**
     * 自适应宽 根据文本宽显示
     */
    ADAPTIVE_WIDTH = 1,
    /**
     * 固定字节长度（中文2个字节 英文1个字节）
     */
    FIX_BYTE = 2,
    /**
     * 固定字符长度
     */
    FIX_LENGTH = 3
}

/**
 *  Label扩展 超出限制后剩余显示省略符号
 *  1 ADAPTIVE_WIDTH  自适应宽 根据文本宽显示
 *  2 FIX_BYTE 固定字节长度（中文2个字节 英文1个字节）
 *  3 FIX_LENGTH 固定字符长度
 */
@ccclass('ALabel')
export class ALabel extends Label {
    @property({
        type: Enum(LabelType),
        tooltip: `文本类型
        1 ADAPTIVE_WIDTH  自适应宽 根据文本宽显示
        2 FIX_BYTE 固定字节长度（中文2个字节 英文1个字节）
        3 FIX_LENGTH 固定字符长度` })
    private labelType: LabelType = LabelType.NONE;
    @property({
        tooltip: `文本类型 限制值 
        FIX_BYTE 固定字节长度（中文2个字节 英文1个字节）
        FIX_LENGTH 固定字符长度`,
        visible() {
            {
                return this.labelType >= LabelType.FIX_BYTE;
            }
        },
    })
    private labelLimit: number = 5;
    @property({
        tooltip: `超出限制后省略号`,
        visible() {
            {
                return this.labelType > LabelType.NONE;
            }
        },
    })
    private labelEllipsis: string = "...";

    /**
     * 真实的字符串，防止字符串类型限制后转换后，获取不到真实的字符串内容
    */
    public realString: string = "";
    public get string(): string {
        return this._string ?? "";
    }

    public set string(value: string) {
        if (value === null || value === undefined) {
            value = '';
        } else {
            value = value.toString();
        }

        if (this._string === value || this.realString === value) {
            return;
        }
        this.refreshLabel(value);
    }

    private refreshLabel(value: string): void {
        this.realString = value;
        this._string = this.transformString(value);
        this.markForUpdateRenderData();
    }

    /**
    * 编辑器方法
    * 当离开文本热点的时候，设置适配宽  改为自适应高度，要不无法设置文本宽度
    */
    onLostFocusInEditor(): void {
        if (!EDITOR) {
            return;
        }
        if (this.labelType == LabelType.ADAPTIVE_WIDTH) {
            this.overflow = Overflow.RESIZE_HEIGHT;
        } else {
            this.overflow = Overflow.NONE;
        }
    }

    public onLoad(): void {
        super.onLoad && super.onLoad();
        this.realString = this._string;
        this.node.on(NodeEventType.SIZE_CHANGED, this.onSizeChanged, this);
    }

    onDestroy(): void {
        this.node.off(NodeEventType.SIZE_CHANGED, this.onSizeChanged, this);
        super.onDestroy();
    }

    private onSizeChanged(): void {
        if (this.labelType != LabelType.ADAPTIVE_WIDTH || !this.realString) {
            return;
        }
        this.refreshLabel(this.realString);
    }

    /**转换字符串 */
    private transformString(value: string): string {
        let maxSize = this.node.getComponent(UITransform).contentSize;
        let valueLength = this.safeMeasureText(value);
        if (valueLength == -100) {
            return value;
        }

        let tempValue: string = "";
        let tempLength: number = 0;
        switch (this.labelType) {
            case LabelType.NONE:
                return value;
            case LabelType.ADAPTIVE_WIDTH:
                tempLength = value.length;
                if (valueLength > maxSize.x) {
                    while (--tempLength > 0) {
                        tempValue = value.substring(0, tempLength) + this.labelEllipsis;
                        if (this.safeMeasureText(tempValue) <= maxSize.x) {
                            return tempValue;
                        }
                    }
                }
                return value;
            case LabelType.FIX_BYTE:
                for (let i = 0; i < value.length; i++) {
                    tempLength += value.charCodeAt(i) > 255 ? 2 : 1;
                    if (tempLength > this.labelLimit) {
                        return tempValue + this.labelEllipsis;
                    }
                    tempValue += value.charAt(i);
                }
                return tempValue
            case LabelType.FIX_LENGTH:
                if (value.length <= this.labelLimit) {
                    return value;
                }
                return value.substring(0, this.labelLimit) + this.labelEllipsis;
        }
        return value;
    }

    /**获取文本宽度 */
    private safeMeasureText(string: string): number {
        if (this.assemblerData && this.assemblerData.context) {
            this.assemblerData.context.font = this.getFontDesc();
            const metric = this.assemblerData.context.measureText(string);
            const width = metric && metric.width || 0;
            return width;
        }
        return -100;
    }

    private getFontDesc() {
        let fontDesc = `${this.fontSize.toString()}px `;
        fontDesc += this._fontFamilys();
        if (this.isBold) {
            fontDesc = `bold ${fontDesc}`;
        }

        if (this.isItalic) {
            fontDesc = `italic ${fontDesc}`;
        }

        return fontDesc;
    }

    private _fontFamilys(): string {
        if (!this.useSystemFont) {
            if (this.font) {
                return this.font?._nativeAsset || 'Arial';
            } else {
                return 'Arial';
            }
        }
        return this.fontFamily || 'Arial';
    }

}
