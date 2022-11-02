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
export default class UIPopup{
	/**
	 * 添加弹出
	 * @param uiBase 目标类
	 */
	public addPopup(uiBase: UIBase): void {
		let type = uiBase.uiData.popupType;
		if(type == PopupType.None){
			return;
		}

		let view = uiBase.node;
		let duration = 0.4;
		let scaleX: number = view.scaleX;
		let scaleY: number = view.scaleY;
		let pos: cc.Vec2 = view.getPosition();
		view.stopAllActions();
		switch (type) {
			case PopupType.MinToMax:
				cc.tween(view)
					.set({ scaleX: 0, scaleY: 0 })
					.to(duration, { scaleX: scaleX, scaleY: scaleY }, { easing: 'backOut' })
					.call(() => {
					}).start();
				break;
			case PopupType.MaxToMin:
				cc.tween(view)
					.set({ scaleX: 2, scaleY: 2 })
					.to(duration, { scaleX: scaleX, scaleY: scaleY }, { easing: "backIn" })
					.call(() => {
					}).start();
				break;
			case PopupType.LeftToRight:
				cc.tween(view)
					.set({ x: -view.width })
					.to(duration, { x: pos.x }, { easing: "expoOut" })
					.call(() => {
					}).start();
				break;
			case PopupType.RightToLeft:
				cc.tween(view)
					.set({ x: view.width })
					.to(duration, { x: pos.x }, { easing: "expoOut" })
					.call(() => {
					}).start();
				break;
			case PopupType.TopToBottom:
				cc.tween(view)
					.set({ y: view.height })
					.to(duration, { y: pos.y }, { easing: "expoOut" })
					.call(() => {
					}).start();
				break;
			case PopupType.BottomToTop:
				cc.tween(view)
					.set({ y: -view.height })
					.to(duration, { y: pos.y }, { easing: "expoOut" })
					.call(() => {
					}).start();
				break;
		}
	}
}


