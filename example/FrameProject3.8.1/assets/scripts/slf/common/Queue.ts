/**
 * 队列 采用对象池
 * @author slf
 */
export class Queue<T> {
    private list: T[] = [];
    public dequeue(target: new () => T): T {
        if (this.list.length == 0) {
            return new target();
        }
        return this.list.shift();
    }

    public enqueue(target: T): void {
        this.list.push(target);
    }

    public destroy(): void {
        this.list.slice(0);
        this.list = null;
    }
}


