const { performance } = require('perf_hooks');
class Queue {
    constructor() { this._items = []; }
    enqueue(item) { this._items.push(item); }
    dequeue()     { return this._items.shift(); }
    get size()    { return this._items.length; }
  }
  
class AutoQueue extends Queue {
    constructor() {
        super();
        this._pendingPromise = false;
        this.MinTimeBetweenRequest = 1000;
    }
    enqueue(action) {
        return new Promise((resolve, reject) => {
            super.enqueue({ action, resolve, reject });
            this.dequeue();
        });
    }

    async dequeue() {
        if (this._pendingPromise) return false;
        let item = super.dequeue();

        if (!item) return false;

        try {
            this._pendingPromise = true;
            var beforeRequest = performance.now();
            let payload = await item.action(this);
            var afterRequest = performance.now();

            if(beforeRequest + this.MinTimeBetweenRequest > afterRequest){
                await this.Wait((beforeRequest + this.MinTimeBetweenRequest) - afterRequest);//ensure we wait the rest of the MinTimeBetweenRequest, to ensure it have past sins we started the call.
            }
            this._pendingPromise = false;
            item.resolve(payload);
        } catch (e) {
            this._pendingPromise = false;
            item.reject(e);
        } finally {
            this.dequeue();
        }

        return true;
    }
    Wait(time) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), time)
        });
    }
}
const aQueue = new AutoQueue();
module.exports = aQueue;
