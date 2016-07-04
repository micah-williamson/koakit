"use strict";
const router_1 = require('./router');
class KoaRouter extends router_1.ExpresskitRouter {
    bindSelf(parent) {
        if (parent.mount) {
            console.log(this.mount);
            parent.router.use(this.mount, this.router.routes());
        }
        else {
            parent.use(this.router.routes());
        }
    }
    use(...args) {
        return this.router.use.apply(this.router, args);
    }
    static(...args) {
        return this.router.static.apply(this.router, args);
    }
    get(...args) {
        return this.router.get.apply(this.router, args);
    }
    put(...args) {
        return this.router.put.apply(this.router, args);
    }
    post(...args) {
        return this.router.post.apply(this.router, args);
    }
    delete(...args) {
        return this.router.delete.apply(this.router, args);
    }
}
exports.KoaRouter = KoaRouter;