"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelClassVisitor = void 0;
const lodash_1 = require("lodash");
const ts = require("typescript");
const decorators_1 = require("../../decorators");
const plugin_constants_1 = require("../plugin-constants");
const ast_utils_1 = require("../utils/ast-utils");
const plugin_utils_1 = require("../utils/plugin-utils");
const abstract_visitor_1 = require("./abstract.visitor");
class ModelClassVisitor extends abstract_visitor_1.AbstractFileVisitor {
    visit(sourceFile, ctx, program, options) {
        const typeChecker = program.getTypeChecker();
        sourceFile = this.updateImports(sourceFile, ctx.factory);
        const propertyNodeVisitorFactory = (metadata) => (node) => {
            if (ts.isPropertyDeclaration(node)) {
                const decorators = node.decorators;
                const hidePropertyDecorator = plugin_utils_1.getDecoratorOrUndefinedByNames([decorators_1.ApiHideProperty.name], decorators);
                if (hidePropertyDecorator) {
                    return node;
                }
                const isPropertyStatic = (node.modifiers || []).some((modifier) => modifier.kind === ts.SyntaxKind.StaticKeyword);
                if (isPropertyStatic) {
                    return node;
                }
                try {
                    this.inspectPropertyDeclaration(ctx.factory, node, typeChecker, options, sourceFile.fileName, sourceFile, metadata);
                }
                catch (err) {
                    return node;
                }
            }
            return node;
        };
        const visitClassNode = (node) => {
            if (ts.isClassDeclaration(node)) {
                const metadata = {};
                node = ts.visitEachChild(node, propertyNodeVisitorFactory(metadata), ctx);
                return this.addMetadataFactory(ctx.factory, node, metadata);
            }
            return ts.visitEachChild(node, visitClassNode, ctx);
        };
        return ts.visitNode(sourceFile, visitClassNode);
    }
    addMetadataFactory(factory, node, classMetadata) {
        const returnValue = factory.createObjectLiteralExpression(Object.keys(classMetadata).map((key) => factory.createPropertyAssignment(factory.createIdentifier(key), classMetadata[key])));
        const method = factory.createMethodDeclaration(undefined, [factory.createModifier(ts.SyntaxKind.StaticKeyword)], undefined, factory.createIdentifier(plugin_constants_1.METADATA_FACTORY_NAME), undefined, undefined, [], undefined, factory.createBlock([factory.createReturnStatement(returnValue)], true));
        return factory.updateClassDeclaration(node, node.decorators, node.modifiers, node.name, node.typeParameters, node.heritageClauses, [...node.members, method]);
    }
    inspectPropertyDeclaration(factory, compilerNode, typeChecker, options, hostFilename, sourceFile, metadata) {
        const objectLiteralExpr = this.createDecoratorObjectLiteralExpr(factory, compilerNode, typeChecker, factory.createNodeArray(), options, hostFilename, sourceFile);
        this.addClassMetadata(compilerNode, objectLiteralExpr, sourceFile, metadata);
    }
    createDecoratorObjectLiteralExpr(factory, node, typeChecker, existingProperties = factory.createNodeArray(), options = {}, hostFilename = '', sourceFile) {
        const isRequired = !node.questionToken;
        let properties = [
            ...existingProperties,
            !plugin_utils_1.hasPropertyKey('required', existingProperties) &&
                factory.createPropertyAssignment('required', ast_utils_1.createBooleanLiteral(factory, isRequired)),
            ...this.createTypePropertyAssignments(factory, node.type, typeChecker, existingProperties, hostFilename),
            ...this.createDescriptionAndExamplePropertyAssigments(factory, node, typeChecker, existingProperties, options, sourceFile),
            this.createDefaultPropertyAssignment(factory, node, existingProperties),
            this.createEnumPropertyAssignment(factory, node, typeChecker, existingProperties, hostFilename)
        ];
        if (options.classValidatorShim) {
            properties = properties.concat(this.createValidationPropertyAssignments(factory, node));
        }
        return factory.createObjectLiteralExpression(lodash_1.compact(lodash_1.flatten(properties)));
    }
    createTypePropertyAssignments(factory, node, typeChecker, existingProperties, hostFilename) {
        const key = 'type';
        if (plugin_utils_1.hasPropertyKey(key, existingProperties)) {
            return [];
        }
        if (node) {
            if (ts.isTypeLiteralNode(node)) {
                const propertyAssignments = Array.from(node.members || []).map((member) => {
                    const literalExpr = this.createDecoratorObjectLiteralExpr(factory, member, typeChecker, existingProperties, {}, hostFilename);
                    return factory.createPropertyAssignment(factory.createIdentifier(member.name.getText()), literalExpr);
                });
                return [
                    factory.createPropertyAssignment(key, factory.createArrowFunction(undefined, undefined, [], undefined, undefined, factory.createParenthesizedExpression(factory.createObjectLiteralExpression(propertyAssignments))))
                ];
            }
            else if (ts.isUnionTypeNode(node)) {
                const nullableType = node.types.find((type) => type.kind === ts.SyntaxKind.NullKeyword ||
                    (ts.SyntaxKind.LiteralType && type.getText() === 'null'));
                const isNullable = !!nullableType;
                const remainingTypes = node.types.filter((item) => item !== nullableType);
                if (remainingTypes.length === 1) {
                    const remainingTypesProperties = this.createTypePropertyAssignments(factory, remainingTypes[0], typeChecker, existingProperties, hostFilename);
                    const resultArray = new Array(...remainingTypesProperties);
                    if (isNullable) {
                        const nullablePropertyAssignment = factory.createPropertyAssignment('nullable', ast_utils_1.createBooleanLiteral(factory, true));
                        resultArray.push(nullablePropertyAssignment);
                    }
                    return resultArray;
                }
            }
        }
        const type = typeChecker.getTypeAtLocation(node);
        if (!type) {
            return [];
        }
        let typeReference = plugin_utils_1.getTypeReferenceAsString(type, typeChecker);
        if (!typeReference) {
            return [];
        }
        typeReference = plugin_utils_1.replaceImportPath(typeReference, hostFilename);
        return [
            factory.createPropertyAssignment(key, factory.createArrowFunction(undefined, undefined, [], undefined, undefined, factory.createIdentifier(typeReference)))
        ];
    }
    createEnumPropertyAssignment(factory, node, typeChecker, existingProperties, hostFilename) {
        const key = 'enum';
        if (plugin_utils_1.hasPropertyKey(key, existingProperties)) {
            return undefined;
        }
        let type = typeChecker.getTypeAtLocation(node);
        if (!type) {
            return undefined;
        }
        if (plugin_utils_1.isAutoGeneratedTypeUnion(type)) {
            const types = type.types;
            type = types[types.length - 1];
        }
        const typeIsArrayTuple = plugin_utils_1.extractTypeArgumentIfArray(type);
        if (!typeIsArrayTuple) {
            return undefined;
        }
        let isArrayType = typeIsArrayTuple.isArray;
        type = typeIsArrayTuple.type;
        const isEnumMember = type.symbol && type.symbol.flags === ts.SymbolFlags.EnumMember;
        if (!ast_utils_1.isEnum(type) || isEnumMember) {
            if (!isEnumMember) {
                type = plugin_utils_1.isAutoGeneratedEnumUnion(type, typeChecker);
            }
            if (!type) {
                return undefined;
            }
            const typeIsArrayTuple = plugin_utils_1.extractTypeArgumentIfArray(type);
            if (!typeIsArrayTuple) {
                return undefined;
            }
            isArrayType = typeIsArrayTuple.isArray;
            type = typeIsArrayTuple.type;
        }
        const enumRef = plugin_utils_1.replaceImportPath(ast_utils_1.getText(type, typeChecker), hostFilename);
        const enumProperty = factory.createPropertyAssignment(key, factory.createIdentifier(enumRef));
        if (isArrayType) {
            const isArrayKey = 'isArray';
            const isArrayProperty = factory.createPropertyAssignment(isArrayKey, factory.createIdentifier('true'));
            return [enumProperty, isArrayProperty];
        }
        return enumProperty;
    }
    createDefaultPropertyAssignment(factory, node, existingProperties) {
        const key = 'default';
        if (plugin_utils_1.hasPropertyKey(key, existingProperties)) {
            return undefined;
        }
        let initializer = node.initializer;
        if (!initializer) {
            return undefined;
        }
        if (ts.isAsExpression(initializer)) {
            initializer = initializer.expression;
        }
        return factory.createPropertyAssignment(key, initializer);
    }
    createValidationPropertyAssignments(factory, node) {
        const assignments = [];
        const decorators = node.decorators;
        this.addPropertyByValidationDecorator(factory, 'Min', 'minimum', decorators, assignments);
        this.addPropertyByValidationDecorator(factory, 'Max', 'maximum', decorators, assignments);
        this.addPropertyByValidationDecorator(factory, 'MinLength', 'minLength', decorators, assignments);
        this.addPropertyByValidationDecorator(factory, 'MaxLength', 'maxLength', decorators, assignments);
        return assignments;
    }
    addPropertyByValidationDecorator(factory, decoratorName, propertyKey, decorators, assignments) {
        const decoratorRef = plugin_utils_1.getDecoratorOrUndefinedByNames([decoratorName], decorators);
        if (!decoratorRef) {
            return;
        }
        const argument = lodash_1.head(ast_utils_1.getDecoratorArguments(decoratorRef));
        if (argument) {
            assignments.push(factory.createPropertyAssignment(propertyKey, argument));
        }
    }
    addClassMetadata(node, objectLiteral, sourceFile, metadata) {
        const hostClass = node.parent;
        const className = hostClass.name && hostClass.name.getText();
        if (!className) {
            return;
        }
        const propertyName = node.name && node.name.getText(sourceFile);
        if (!propertyName ||
            (node.name && node.name.kind === ts.SyntaxKind.ComputedPropertyName)) {
            return;
        }
        metadata[propertyName] = objectLiteral;
    }
    createDescriptionAndExamplePropertyAssigments(factory, node, typeChecker, existingProperties = factory.createNodeArray(), options = {}, sourceFile) {
        if (!options.introspectComments || !sourceFile) {
            return [];
        }
        const propertyAssignments = [];
        const [comments, examples] = ast_utils_1.getMainCommentAndExamplesOfNode(node, sourceFile, typeChecker, true);
        const keyOfComment = options.dtoKeyOfComment;
        if (!plugin_utils_1.hasPropertyKey(keyOfComment, existingProperties) && comments) {
            const descriptionPropertyAssignment = factory.createPropertyAssignment(keyOfComment, factory.createStringLiteral(comments));
            propertyAssignments.push(descriptionPropertyAssignment);
        }
        const hasExampleOrExamplesKey = plugin_utils_1.hasPropertyKey('example', existingProperties) ||
            plugin_utils_1.hasPropertyKey('examples', existingProperties);
        if (!hasExampleOrExamplesKey && examples.length) {
            if (examples.length === 1) {
                const examplePropertyAssignment = factory.createPropertyAssignment('example', this.createLiteralFromAnyValue(factory, examples[0]));
                propertyAssignments.push(examplePropertyAssignment);
            }
            else {
                const examplesPropertyAssignment = factory.createPropertyAssignment('examples', this.createLiteralFromAnyValue(factory, examples));
                propertyAssignments.push(examplesPropertyAssignment);
            }
        }
        return propertyAssignments;
    }
    createLiteralFromAnyValue(factory, item) {
        return Array.isArray(item)
            ? factory.createArrayLiteralExpression(item.map((item) => this.createLiteralFromAnyValue(factory, item)))
            : ast_utils_1.createPrimitiveLiteral(factory, item);
    }
}
exports.ModelClassVisitor = ModelClassVisitor;
