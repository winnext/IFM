"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateClassificationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_classification_dto_1 = require("./create-classification.dto");
class UpdateClassificationDto extends (0, swagger_1.PartialType)(create_classification_dto_1.CreateClassificationDto) {
}
exports.UpdateClassificationDto = UpdateClassificationDto;
//# sourceMappingURL=update-classification.dto.js.map