import { UITransform, Vec2, Vec3, tween } from "cc";
import UIBase from "./base/UIBase";

/**弹出类型 */
export enum PopupType {
	/**没有效果 */
	None = 0,
	/**从小到大 */
	MinToMax,
	/**从大到小 */
	MaxToMin,
	/**从左到右 */
	LeftToRight,
	/**从右到左 */
	RightToLeft,
	/**从上到下 */
	TopToBottom,
	/**从下到上 */
	BottomToTop,
}

/**
  * 弹出管理类
  * @author slf
  */
export default class UIPopup {
	/**
	 * 弹出
	 * @param uiBase 
	 * @returns 
	 */
	public popup(uiBase: UIBase): void {
		let type = uiBase.popupType;
		if (type == PopupType.None) {
			return;
		}
		let node = uiBase.node;
		let vA: Vec3 = new Vec3(0, 0, 1);
		let vB: Vec3 = new Vec3(0, 0, 1);
		let duration = 0.4;
		let uiTransform = node.getComponent(UITransform);
		tween(node).stop();
		switch (type) {
			case PopupType.MinToMax:
				vA.x = vA.y = 0;
				vB.x = vB.y = 1;
				tween(node)
					.set({ scale: vA })
					.to(duration, { scale: vB }, { easing: 'backOut' })
					.start();
				break;
			case PopupType.MaxToMin:
				vA.x = vA.y = 2;
				vB.x = vB.y = 1;
				tween(node)
					.set({ scale: vA })
					.to(duration, { scale: vB }, { easing: "backIn" })
					.start();
				break;
			case PopupType.LeftToRight:
				vA.x = -uiTransform.width;
				tween(node)
					.set({ position: vA })
					.to(duration, { position: vB }, { easing: "expoOut" })
					.start();
				break;
			case PopupType.RightToLeft:
				vA.x = uiTransform.width;
				tween(node)
					.set({ position: vA })
					.to(duration, { position: vB }, { easing: "expoOut" })
					.start();
				break;
			case PopupType.TopToBottom:
				vA.y = uiTransform.width;
				tween(node)
					.set({ position: vA })
					.to(duration, { position: vB }, { easing: "expoOut" })
					.start();
				break;
			case PopupType.BottomToTop:
				vA.y = -uiTransform.width;
				tween(node)
					.set({ position: vA })
					.to(duration, { position: vB }, { easing: "expoOut" })
					.start();
				break;
		}
	}
}


