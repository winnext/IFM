"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassificationSchema = exports.Classification = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const uuid_1 = require("uuid");
class Classification {
    constructor() {
        this.key = generateUuid();
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.hasParent = true;
    }
}
exports.Classification = Classification;
function generateUuid() {
    return (0, uuid_1.v4)();
}
exports.ClassificationSchema = mongoose_1.SchemaFactory.createForClass(Classification);
//# sourceMappingURL=classification.entity.js.map