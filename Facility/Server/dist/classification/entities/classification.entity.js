"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Classification_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassificationSchema = exports.Classification = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const uuid_1 = require("uuid");
let Classification = Classification_1 = class Classification extends mongoose_2.Document {
};
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        default: function genUUID() {
            return (0, uuid_1.v4)();
        },
    }),
    __metadata("design:type", String)
], Classification.prototype, "uuid", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Classification.prototype, "code", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Classification.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        default: function getClassName() {
            return Classification_1.name;
        },
    }),
    __metadata("design:type", String)
], Classification.prototype, "class_name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Classification.prototype, "detail", void 0);
Classification = Classification_1 = __decorate([
    (0, mongoose_1.Schema)()
], Classification);
exports.Classification = Classification;
exports.ClassificationSchema = mongoose_1.SchemaFactory.createForClass(Classification);
//# sourceMappingURL=classification.entity.js.map