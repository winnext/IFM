"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassificationNotFountException = exports.FacilityNotFountException = void 0;
const common_1 = require("@nestjs/common");
class FacilityNotFountException extends common_1.HttpException {
    constructor(id) {
        super(`Facility with #${id} Not Found `, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.FacilityNotFountException = FacilityNotFountException;
class ClassificationNotFountException extends common_1.HttpException {
    constructor(id) {
        super(`Classification with #${id} Not Found `, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.ClassificationNotFountException = ClassificationNotFountException;
//# sourceMappingURL=facility.not.found.exception.js.map