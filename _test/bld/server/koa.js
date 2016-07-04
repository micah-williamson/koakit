"use strict";
const reflect_1 = require('../reflect');
const server_1 = require('./server');
const router_1 = require('../router');
const route_1 = require('../route');
const service_1 = require('../rule/service');
const service_2 = require('../injector/service');
const dto_1 = require('../dto');
class KoaServer extends server_1.ExpresskitServer {
    constructor(koa, routerPackage) {
        super();
        this.package = koa;
        this.application = new koa();
        this.routerPackage = routerPackage;
        this.router = this.createRouter('/');
    }
    createRouter(mount) {
        let router = this.routerPackage();
        return new router_1.KoaRouter(mount, router);
    }
    use(...args) {
        return this.application.use.apply(this.application, args);
    }
    listen(...args) {
        return this.listenHandle = this.application.listen.apply(this.application, args);
    }
    stop(...args) {
        return this.listenHandle.stop.apply(this.application, args);
    }
    getHeader(request, name) {
        return request.header[name.toLowerCase()];
    }
    getQuery(request, name) {
        return request.query[name];
    }
    getParam(request, name) {
        return request.params[name];
    }
    getBody(request) {
        return request.request.body;
    }
    getRequestHandler(route) {
        let self = this;
        return function (ctx) {
            let rules = reflect_1.Reflect.getMetadata('Rules', route.object, route.key) || [];
            return service_1.RuleService.runRules(self, rules, ctx).then(() => {
                return service_2.InjectorService.run(self, route.object, route.key, ctx).then((response) => {
                    return self.sendResponse(route, ctx, route_1.ResponseService.convertSuccessResponse(response));
                }).catch((response) => {
                    return self.sendResponse(route, ctx, route_1.ResponseService.convertErrorResponse(response));
                });
            }).catch((response) => {
                return self.sendResponse(route, ctx, route_1.ResponseService.convertErrorResponse(response));
            });
        };
    }
    sendResponse(route, ctx, response) {
        let object = route.object;
        let key = route.key;
        let responseType = reflect_1.Reflect.getMetadata('ResponseType', object, key);
        if (responseType) {
            dto_1.DTOManager.scrubOut(response.data, responseType);
        }
        ctx.body = response.data;
        ctx.status = response.httpCode;
    }
}
exports.KoaServer = KoaServer;