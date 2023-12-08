/**http请求类型 */
export enum HTTP_TYPE {
	GET = 1,
	POST
}

/**http请求头类型 */
export enum HTTP_HEADER {
	JSON = 1,	//"application/json; charset=utf-8"
	FORM		//"application/x-www-form-urlencoded"
}

/**http数据结构 */
export interface IHttpData {
	url?: string				//地址
	type?: HTTP_TYPE;			//请求类型 默认get
	headerType?: HTTP_HEADER	//请求头类型 默认json
	data?: any;					//传输的数据
	sync?: boolean;				//是否同步 默认异步
	cb?: Function;				//完成回调
	errCb?: Function;			//异常回调
	cbT?: any;					//回调作用域
}

/**
 * Http通信
 * @author slf
 */
export default class Http {
	private static httpQueue: Http[] = [];		//http队列 重复使用
	protected data: IHttpData;					//数据结构
	protected xhr: XMLHttpRequest;

	/**
	 * 发送http请求
	 * @param data 数据结构 
	 */
	private static send(data: IHttpData): void {
		let httpc: Http = this.httpQueue.length ? this.httpQueue.shift() : new Http();
		httpc.data = data;
		httpc.reqMsg();
	}

	/**
	 * get请求
	 * @param url 请求地址
	 * @param cb 完成回调
	 * @param target 回调作用域
	 * @param errCb 异常回调
	 * @param sync 是否同步
	 */
	public static get(url, cb?: Function, target?: any, errCb?: Function, sync?: boolean): void {
		let http: Http = this.httpQueue.length ? this.httpQueue.shift() : new Http();
		let data: IHttpData = {
			url: url,
			type: HTTP_TYPE.GET,
			cb: cb,
			cbT: target,
			errCb: errCb,
			sync: sync
		};
		http.data = data;
		http.reqMsg();
	}


	/**
	 * post请求
	 * @param url 请求地址
	 * @param data 参数
	 * @param cb 完成回调
	 * @param target 回调作用域
	 * @param errCb 异常回调
	 */
	public static post(url, data, cb?: Function, target?: any, errCb?: Function, sync?: boolean): void {
		let http: Http = this.httpQueue.length ? this.httpQueue.shift() : new Http();
		let datas: IHttpData = {
			url: url,
			data: data,
			type: HTTP_TYPE.POST,
			cb: cb,
			cbT: target,
			errCb: errCb,
			sync: sync
		};
		http.data = datas;
		http.reqMsg();
	}

	/**发送请求 */
	private reqMsg(): void {
		if (!this.xhr) {
			this.xhr = XMLHttpRequest ? new XMLHttpRequest() : new Window['ActiveXObject']("MSXML2.XMLHTTP");
			this.xhr.addEventListener("load", this.onComplete.bind(this));
			this.xhr.addEventListener("error", this.onIoError.bind(this));
		}
		var httpData = this.data;

		if (httpData.sync) {
			// LoadingManager.getInstance().show(LoadingTypeEnum.Circle,"通信中...");
			//显示loading
		}

		var url = httpData.url;
		var method = "GET";
		var header = httpData.headerType == HTTP_HEADER.FORM ? "application/x-www-form-urlencoded" : "application/json; charset=UTF-8";
		var data;
		if (httpData.type == HTTP_TYPE.POST) {
			method = "POST";
			data = JSON.stringify(httpData.data);
		}
		console.log("http request ==" + url + data);
		var xhr = this.xhr;
		xhr.open(method, url, true);
		xhr.setRequestHeader("Content-Type", header);

		xhr.send(data);
	}

	private onComplete(event) {
		var request = <any>event.currentTarget;
		if (!request) {
			request = event
		}
		request.data = request.response
		console.log("http response ==" + request.data);
		let temp = JSON.parse(request.data);
		var cb = this.data.cb;
		var cbT = this.data.cbT;
		this.reset();
		cb && cb.call(cbT, temp);
	}

	private onIoError(event) {
		var cb = this.data.errCb || this.data.cb;
		var cbT = this.data.cbT;
		this.reset();
		cb && cb.call(cbT);
	}

	private reset() {
		if (this.data.sync) {
			//隐藏loading
			// LoadingManager.getInstance().hide(LoadingTypeEnum.Circle);
		}

		this.data = null;
		Http.httpQueue.push(this);
	}
}