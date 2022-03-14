"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFacilityDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_facility_dto_1 = require("./create.facility.dto");
class UpdateFacilityDto extends (0, swagger_1.PartialType)(create_facility_dto_1.CreateFacilityDto) {
}
exports.UpdateFacilityDto = UpdateFacilityDto;
//# sourceMappingURL=update.facility.dto.js.map