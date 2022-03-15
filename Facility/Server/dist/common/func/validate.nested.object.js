"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateNested = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
function ValidateNested(schema, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'ValidateNested',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value, args) {
                    args.value;
                    if (Array.isArray(value)) {
                        for (let i = 0; i < value.length; i++) {
                            if ((0, class_validator_1.validateSync)((0, class_transformer_1.plainToClass)(schema, value[i])).length) {
                                return false;
                            }
                        }
                        return true;
                    }
                    else
                        return (0, class_validator_1.validateSync)((0, class_transformer_1.plainToClass)(schema, value)).length
                            ? false
                            : true;
                },
                defaultMessage(args) {
                    if (Array.isArray(args.value)) {
                        for (let i = 0; i < args.value.length; i++) {
                            return (`${args.property}::index${i} -> ` +
                                (0, class_validator_1.validateSync)((0, class_transformer_1.plainToClass)(schema, args.value[i]))
                                    .map((e) => e.constraints)
                                    .reduce((acc, next) => acc.concat(Object.values(next)), [])).toString();
                        }
                    }
                    else
                        return (`${args.property}: ` +
                            (0, class_validator_1.validateSync)((0, class_transformer_1.plainToClass)(schema, args.value))
                                .map((e) => e.constraints)
                                .reduce((acc, next) => acc.concat(Object.values(next)), [])).toString();
                },
            },
        });
    };
}
exports.ValidateNested = ValidateNested;
//# sourceMappingURL=validate.nested.object.js.map