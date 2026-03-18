import { Singleton } from "../common/Singleton";
import { Logger } from "../Logger";

/**
 * WebSocket连接状态
 * @author slf
 */
export enum WebSocketState {
	/**未连接*/
	CLOSED = 0,
	/**连接中*/
	CONNECTING = 1,
	/**已连接*/
	OPEN = 2,
	/**关闭中*/
	CLOSING = 3
}

/**
 * WebSocket数据结构
 * @author slf
 */
export interface IWebSocketData {
	/**服务器地址*/
	url: string;
	/**连接协议 ws 或 wss*/
	protocol?: string;
	/**连接完成回调*/
	onOpen?: Function;
	/**连接完成回调作用域*/
	onOpenTarget?: any;
	/**收到消息回调*/
	onMessage?: Function;
	/**收到消息回调作用域*/
	onMessageTarget?: any;
	/**连接关闭回调*/
	onClose?: Function;
	/**连接关闭回调作用域*/
	onCloseTarget?: any;
	/**连接错误回调*/
	onError?: Function;
	/**连接错误回调作用域*/
	onErrorTarget?: any;
	/**是否自动重连*/
	autoReconnect?: boolean;
	/**重连间隔时间(毫秒)*/
	reconnectInterval?: number;
	/**最大重连次数*/
	maxReconnectCount?: number;
	/**心跳间隔时间(毫秒) 0表示不开启心跳*/
	heartbeatInterval?: number;
	/**心跳数据*/
	heartbeatData?: string | ArrayBuffer;
}

/**
 * WebSocket通信基类
 * 支持自动重连、心跳检测、消息队列
 * @author slf
 */
export class WebSocketBase {
	/**WebSocket实例*/
	private ws: WebSocket | null = null;
	/**当前连接状态*/
	private state: WebSocketState = WebSocketState.CLOSED;
	/**当前连接配置*/
	private config: IWebSocketData | null = null;
	/**重连定时器*/
	private reconnectTimer: number | null = null;
	/**心跳定时器*/
	private heartbeatTimer: number | null = null;
	/**当前重连次数*/
	private reconnectCount: number = 0;
	/**消息队列(连接前发送的消息暂存)*/
	private messageQueue: (string | ArrayBuffer)[] = [];
	/**是否手动关闭*/
	private isManualClose: boolean = false;
	/**连接标识符*/
	private id: string = "";

	constructor(id: string) {
		this.id = id;
	}

	/**
	 * 连接WebSocket
	 * @param config 连接配置
	 */
	public connect(config: IWebSocketData): void {
		if (this.state == WebSocketState.OPEN || this.state == WebSocketState.CONNECTING) {
			Logger.warn("WebSocket已连接或正在连接中，无需重复连接");
			return;
		}

		this.config = config;
		this.isManualClose = false;
		this.reconnectCount = 0;

		let url = config.url;
		// 如果没有协议前缀，添加默认协议
		if (url.indexOf("ws://") != 0 && url.indexOf("wss://") != 0) {
			url = (config.protocol || "ws") + "://" + url;
		}

		Logger.log("WebSocket开始连接: " + url);
		this.state = WebSocketState.CONNECTING;

		try {
			this.ws = new WebSocket(url);
			this.setupEventHandlers();
		} catch (error) {
			Logger.error("WebSocket创建失败: " + error);
			this.handleConnectError(error);
		}
	}

	/**
	 * 设置事件处理器
	 */
	private setupEventHandlers(): void {
		if (!this.ws) return;

		this.ws.onopen = this.handleOpen.bind(this);
		this.ws.onmessage = this.handleMessage.bind(this);
		this.ws.onclose = this.handleClose.bind(this);
		this.ws.onerror = this.handleError.bind(this);
	}

	/**
	 * 连接成功处理
	 */
	private handleOpen(event: Event): void {
		Logger.log("WebSocket连接成功");
		this.state = WebSocketState.OPEN;
		this.reconnectCount = 0;

		// 清除重连定时器
		this.clearReconnectTimer();

		// 启动心跳检测
		this.startHeartbeat();

		// 发送队列中的消息
		this.sendQueuedMessages();

		// 触发回调
		if (this.config?.onOpen) {
			this.config.onOpen.call(this.config?.onOpenTarget, event);
		}
	}

	/**
	 * 收到消息处理
	 */
	private handleMessage(event: MessageEvent): void {
		Logger.log("WebSocket收到消息: " + event.data);

		// 重置心跳定时器
		this.resetHeartbeatTimer();

		// 触发回调
		if (this.config?.onMessage) {
			this.config.onMessage.call(this.config?.onMessageTarget, event.data);
		}
	}

	/**
	 * 连接关闭处理
	 */
	private handleClose(event: CloseEvent): void {
		Logger.log("WebSocket连接关闭: code=" + event.code + ", reason=" + event.reason);
		this.state = WebSocketState.CLOSED;

		// 清除定时器
		this.clearReconnectTimer();
		this.clearHeartbeatTimer();

		// 触发回调
		if (this.config?.onClose) {
			this.config.onClose.call(this.config?.onCloseTarget, event);
		}

		// 自动重连
		if (!this.isManualClose && this.config?.autoReconnect) {
			this.startReconnect();
		}
	}

	/**
	 * 连接错误处理
	 */
	private handleError(event: Event): void {
		Logger.error("WebSocket连接错误");
		this.handleConnectError(event);
	}

	/**
	 * 连接错误统一处理
	 */
	private handleConnectError(error: any): void {
		this.state = WebSocketState.CLOSED;

		// 清除定时器
		this.clearHeartbeatTimer();

		// 触发错误回调
		if (this.config?.onError) {
			this.config.onError.call(this.config?.onErrorTarget, error);
		}

		// 自动重连
		if (!this.isManualClose && this.config?.autoReconnect) {
			this.startReconnect();
		}
	}

	/**
	 * 发送消息
	 * @param data 消息内容
	 */
	public send(data: string | ArrayBuffer): void {
		if (this.state == WebSocketState.OPEN && this.ws) {
			try {
				this.ws.send(data);
				Logger.log("WebSocket发送消息: " + (typeof data == "string" ? data : "ArrayBuffer"));
			} catch (error) {
				Logger.error("WebSocket发送消息失败: " + error);
			}
		} else {
			Logger.warn("WebSocket未连接，消息加入队列");
			this.messageQueue.push(data);
		}
	}

	/**
	 * 发送队列中的消息
	 */
	private sendQueuedMessages(): void {
		while (this.messageQueue.length > 0) {
			let data = this.messageQueue.shift();
			if (data) {
				this.send(data);
			}
		}
	}

	/**
	 * 关闭连接
	 * @param code 关闭码
	 * @param reason 关闭原因
	 */
	public close(code?: number, reason?: string): void {
		this.isManualClose = true;
		this.clearReconnectTimer();
		this.clearHeartbeatTimer();

		if (this.ws && (this.state == WebSocketState.OPEN || this.state == WebSocketState.CONNECTING)) {
			this.state = WebSocketState.CLOSING;
			this.ws.close(code, reason);
		}
	}

	/**
	 * 开始重连
	 */
	private startReconnect(): void {
		let maxCount = this.config?.maxReconnectCount || 5;
		if (this.reconnectCount >= maxCount) {
			Logger.error("WebSocket重连次数已达上限: " + maxCount);
			return;
		}

		this.reconnectCount++;
		let interval = this.config?.reconnectInterval || 3000;

		Logger.log("WebSocket将在" + interval + "ms后进行第" + this.reconnectCount + "次重连");

		this.reconnectTimer = window.setTimeout(() => {
			Logger.log("WebSocket开始第" + this.reconnectCount + "次重连");
			this.connect(this.config!);
		}, interval);
	}

	/**
	 * 清除重连定时器
	 */
	private clearReconnectTimer(): void {
		if (this.reconnectTimer != null) {
			window.clearTimeout(this.reconnectTimer);
			this.reconnectTimer = null;
		}
	}

	/**
	 * 启动心跳检测
	 */
	private startHeartbeat(): void {
		this.clearHeartbeatTimer();

		let interval = this.config?.heartbeatInterval || 0;
		if (interval <= 0) {
			return; // 不开启心跳
		}

		this.heartbeatTimer = window.setInterval(() => {
			if (this.state == WebSocketState.OPEN && this.config?.heartbeatData) {
				this.send(this.config.heartbeatData);
				Logger.log("WebSocket发送心跳");
			}
		}, interval);
	}

	/**
	 * 重置心跳定时器
	 */
	private resetHeartbeatTimer(): void {
		if (this.heartbeatTimer != null && this.config?.heartbeatInterval) {
			this.clearHeartbeatTimer();
			this.heartbeatTimer = window.setInterval(() => {
				if (this.state == WebSocketState.OPEN && this.config?.heartbeatData) {
					this.send(this.config.heartbeatData);
					Logger.log("WebSocket发送心跳");
				}
			}, this.config.heartbeatInterval);
		}
	}

	/**
	 * 清除心跳定时器
	 */
	private clearHeartbeatTimer(): void {
		if (this.heartbeatTimer != null) {
			window.clearInterval(this.heartbeatTimer);
			this.heartbeatTimer = null;
		}
	}

	/**
	 * 获取当前连接状态
	 */
	public getState(): WebSocketState {
		return this.state;
	}

	/**
	 * 是否已连接
	 */
	public isConnected(): boolean {
		return this.state == WebSocketState.OPEN;
	}

	/**
	 * 清空消息队列
	 */
	public clearMessageQueue(): void {
		this.messageQueue = [];
	}

	/**
	 * 获取连接ID
	 */
	public getId(): string {
		return this.id;
	}

	/**
	 * 销毁WebSocket
	 */
	public destroy(): void {
		this.close();
		this.clearMessageQueue();
		this.config = null;
		this.ws = null;
	}
}
