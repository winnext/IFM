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
var Facility_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaciliySchema = exports.Facility = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const classification_entity_1 = require("../../classification/entities/classification.entity");
const base_object_1 = require("../../common/baseObject/base.object");
const uuid_1 = require("uuid");
let Facility = Facility_1 = class Facility extends base_object_1.BasePersistantDocumentObject {
};
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        default: function genUUID() {
            return (0, uuid_1.v4)();
        },
    }),
    __metadata("design:type", String)
], Facility.prototype, "uuid", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Facility.prototype, "facility_name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Facility.prototype, "locations", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Facility.prototype, "brand_name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Facility.prototype, "type_of_facility", void 0);
__decorate([
    (0, mongoose_1.Prop)([{ type: mongoose_2.Schema.Types.ObjectId, ref: classification_entity_1.Classification.name }]),
    __metadata("design:type", Array)
], Facility.prototype, "classifications", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Facility.prototype, "label", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Facility.prototype, "pathtoChosenNodeClassification", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
        default: function genDate() {
            return new Date();
        },
    }),
    __metadata("design:type", Date)
], Facility.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Facility.prototype, "updatedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], Facility.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        default: function getClassName() {
            return Facility_1.name;
        },
    }),
    __metadata("design:type", String)
], Facility.prototype, "class_name", void 0);
Facility = Facility_1 = __decorate([
    (0, mongoose_1.Schema)()
], Facility);
exports.Facility = Facility;
exports.FaciliySchema = mongoose_1.SchemaFactory.createForClass(Facility);
//# sourceMappingURL=facility.entity.js.map