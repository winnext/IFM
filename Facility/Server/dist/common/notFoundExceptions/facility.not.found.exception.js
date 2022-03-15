"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassificationNotFountException = exports.FacilityNotFountException = void 0;
const common_1 = require("@nestjs/common");
const i18n_enum_1 = require("../const/i18n.enum");
function FacilityNotFountException(id) {
    throw new common_1.HttpException({ key: i18n_enum_1.I18NEnums.FACILITY_NOT_FOUND, args: { id: id } }, common_1.HttpStatus.NOT_FOUND);
}
exports.FacilityNotFountException = FacilityNotFountException;
function ClassificationNotFountException(id) {
    throw new common_1.HttpException({ key: i18n_enum_1.I18NEnums.CLASSIFICATION_NOT_FOUND, args: { id: id } }, common_1.HttpStatus.NOT_FOUND);
}
exports.ClassificationNotFountException = ClassificationNotFountException;
//# sourceMappingURL=facility.not.found.exception.js.map