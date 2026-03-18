import { Singleton } from "../common/Singleton";
import { Logger } from "../Logger";
import { IWebSocketData, WebSocketBase, WebSocketState } from "./WebSocketBase";

/**
 * WebSocket管理器
 * 管理多个WebSocket连接实例
 * @author slf
 */
export class WebSocketManager extends Singleton {
	/**WebSocket实例映射表 key: id, value: WebSocketBase*/
	private wsMap: { [key: string]: WebSocketBase } = {};
	/**ID计数器*/
	private idCounter: number = 0;

	protected init(): void {
		this.wsMap = {};
		this.idCounter = 0;
	}

	/**
	 * 创建WebSocket连接
	 * @param id 连接标识符，不传则自动生成
	 * @param config 连接配置
	 * @returns 连接ID
	 */
	public create(id: string | null, config: IWebSocketData): string {
		let wsId: string = id || ("ws_" + (++this.idCounter));

		if (this.wsMap[wsId]) {
			Logger.warn("WebSocket连接ID已存在: " + wsId);
			return wsId;
		}

		let wsBase = new WebSocketBase(wsId);
		this.wsMap[wsId] = wsBase;
		wsBase.connect(config);

		Logger.log("创建WebSocket连接 ID: " + wsId);
		return wsId;
	}

	/**
	 * 获取WebSocket实例
	 * @param id 连接ID
	 * @returns WebSocket实例
	 */
	public get(id: string): WebSocketBase | null {
		return this.wsMap[id] || null;
	}

	/**
	 * 发送消息
	 * @param id 连接ID
	 * @param data 消息内容
	 */
	public send(id: string, data: string | ArrayBuffer): void {
		let wsBase = this.wsMap[id];
		if (!wsBase) {
			Logger.warn("WebSocket连接不存在: " + id);
			return;
		}
		wsBase.send(data);
	}

	/**
	 * 关闭连接
	 * @param id 连接ID
	 * @param code 关闭码
	 * @param reason 关闭原因
	 */
	public close(id: string, code?: number, reason?: string): void {
		let wsBase = this.wsMap[id];
		if (!wsBase) {
			Logger.warn("WebSocket连接不存在: " + id);
			return;
		}
		wsBase.close(code, reason);
	}

	/**
	 * 关闭所有连接
	 */
	public closeAll(): void {
		for (let key in this.wsMap) {
			this.wsMap[key].close();
		}
	}

	/**
	 * 移除连接
	 * @param id 连接ID
	 */
	public remove(id: string): void {
		let wsBase = this.wsMap[id];
		if (wsBase) {
			wsBase.destroy();
			delete this.wsMap[id];
			Logger.log("移除WebSocket连接 ID: " + id);
		}
	}

	/**
	 * 移除所有连接
	 */
	public removeAll(): void {
		for (let key in this.wsMap) {
			this.wsMap[key].destroy();
		}
		this.wsMap = {};
		Logger.log("移除所有WebSocket连接");
	}

	/**
	 * 获取连接状态
	 * @param id 连接ID
	 * @returns 连接状态
	 */
	public getState(id: string): WebSocketState | null {
		let wsBase = this.wsMap[id];
		return wsBase ? wsBase.getState() : null;
	}

	/**
	 * 是否已连接
	 * @param id 连接ID
	 * @returns 是否已连接
	 */
	public isConnected(id: string): boolean {
		let wsBase = this.wsMap[id];
		return wsBase ? wsBase.isConnected() : false;
	}

	/**
	 * 清空消息队列
	 * @param id 连接ID
	 */
	public clearMessageQueue(id: string): void {
		let wsBase = this.wsMap[id];
		if (wsBase) {
			wsBase.clearMessageQueue();
		}
	}

	/**
	 * 获取所有连接ID
	 * @returns 连接ID列表
	 */
	public getIds(): string[] {
		let ids: string[] = [];
		for (let id in this.wsMap) {
			ids.push(id);
		}
		return ids;
	}

	/**
	 * 获取连接数量
	 * @returns 连接数量
	 */
	public getCount(): number {
		let count = 0;
		for (let key in this.wsMap) {
			count++;
		}
		return count;
	}
}
