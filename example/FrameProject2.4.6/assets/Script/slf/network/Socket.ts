
export default class Socket {
    private ws: WebSocket = null;
    /**连接 */
    public connect(url: string): void {

    }

    public close(): void {
        this.ws.close();
    }

    public disConnect
}