"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkObjectIddİsValid = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const i18n_enum_1 = require("../const/i18n.enum");
function checkObjectIddİsValid(id) {
    const IsValidobject = mongoose_1.Types.ObjectId.isValid(id);
    if (!IsValidobject) {
        throw new common_1.HttpException({ key: i18n_enum_1.I18NEnums.OBJECTID_NOT_VALID, args: { id: id } }, common_1.HttpStatus.NOT_FOUND);
    }
}
exports.checkObjectIddİsValid = checkObjectIddİsValid;
//# sourceMappingURL=objectId.check.js.map