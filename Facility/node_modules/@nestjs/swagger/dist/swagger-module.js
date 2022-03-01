"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerModule = void 0;
const load_package_util_1 = require("@nestjs/common/utils/load-package.util");
const swagger_scanner_1 = require("./swagger-scanner");
const assign_two_levels_deep_1 = require("./utils/assign-two-levels-deep");
const get_global_prefix_1 = require("./utils/get-global-prefix");
const validate_path_util_1 = require("./utils/validate-path.util");
class SwaggerModule {
    static createDocument(app, config, options = {}) {
        const swaggerScanner = new swagger_scanner_1.SwaggerScanner();
        const document = swaggerScanner.scanApplication(app, options);
        document.components = assign_two_levels_deep_1.assignTwoLevelsDeep({}, config.components, document.components);
        return Object.assign(Object.assign({ openapi: '3.0.0', paths: {} }, config), document);
    }
    static setup(path, app, document, options) {
        const httpAdapter = app.getHttpAdapter();
        const globalPrefix = get_global_prefix_1.getGlobalPrefix(app);
        const finalPath = validate_path_util_1.validatePath((options === null || options === void 0 ? void 0 : options.useGlobalPrefix) && globalPrefix && !globalPrefix.match(/^(\/?)$/)
            ? `${globalPrefix}${validate_path_util_1.validatePath(path)}`
            : path);
        if (httpAdapter && httpAdapter.getType() === 'fastify') {
            return this.setupFastify(finalPath, httpAdapter, document, options);
        }
        return this.setupExpress(finalPath, app, document, options);
    }
    static setupExpress(path, app, document, options) {
        const httpAdapter = app.getHttpAdapter();
        const swaggerUi = load_package_util_1.loadPackage('swagger-ui-express', 'SwaggerModule', () => require('swagger-ui-express'));
        const swaggerHtml = swaggerUi.generateHTML(document, options);
        app.use(path, swaggerUi.serveFiles(document, options));
        httpAdapter.get(path, (req, res) => res.send(swaggerHtml));
        httpAdapter.get(path + '-json', (req, res) => res.json(document));
    }
    static setupFastify(path, httpServer, document, options) {
        const hasParserGetterDefined = Object.getPrototypeOf(httpServer).hasOwnProperty('isParserRegistered');
        if (hasParserGetterDefined && !httpServer.isParserRegistered) {
            httpServer.registerParserMiddleware();
        }
        httpServer.register((httpServer) => __awaiter(this, void 0, void 0, function* () {
            httpServer.register(load_package_util_1.loadPackage('fastify-swagger', 'SwaggerModule', () => require('fastify-swagger')), {
                swagger: document,
                exposeRoute: true,
                routePrefix: path,
                mode: 'static',
                specification: {
                    document
                },
                uiConfig: options === null || options === void 0 ? void 0 : options.uiConfig,
                initOAuth: options === null || options === void 0 ? void 0 : options.initOAuth,
                staticCSP: options === null || options === void 0 ? void 0 : options.staticCSP,
                transformStaticCSP: options === null || options === void 0 ? void 0 : options.transformStaticCSP,
                uiHooks: options === null || options === void 0 ? void 0 : options.uiHooks
            });
        }));
    }
}
exports.SwaggerModule = SwaggerModule;
