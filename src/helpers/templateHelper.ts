import { capitalize, isDateTimeISO } from "./stringHelper";

interface JSClass {
    className: String,
    model: Object
}

const Placeholder = {
	CLASS_PROPERTIES: `CLASS_PROPERTIES`,
	CONSTRUCTOR_PARAMS: `CONSTRUCTOR_PARAMS`,
	CONSTRUCTOR_PROPERTIES: `CONSTRUCTOR_PROPERTIES` 
};

const getTemplate = (className: String) => (
	[
		`export class ${className} {`,
		`\t/**`,
		`\t * @typedef {Object} ${className}~Constructor`,
		Placeholder.CLASS_PROPERTIES,
		`\t */`,
		`\t/**`,
		`\t * @param {${className}~Constructor} Constructor - Constructor`,
		`\t */`,
		Placeholder.CONSTRUCTOR_PARAMS,
		Placeholder.CONSTRUCTOR_PROPERTIES,
		`\t}`,
		`}`

	]
);

const getClassPropertiesTemplate = (property: String, type: String) => `\t * @property {${type}} ${property}`;//TODO: Add capitalize back
const getConstructorParamsTemplate = (properties: String[]) => `\tconstructor({ ${properties.join(`, `)} } = {}) {`;
const getConstructorPropertiesTemplate = (property: String) => `\t\tthis.${property} = ${property};`;

const getModelsFromJson = (json: Object, className: String, classes: JSClass[] = []) => {
    const model: any = {};

    Object.entries(json).forEach(([key, value]) => {
        const type = typeof value;

        if(type === `string` && isDateTimeISO(value)) {
            model[key] = `DateTime`; //luxon DateTime class
        }else if(type === `object`) {
            if(Array.isArray(value)) {
                const arrayValue = value.length>0 ? value[0] : null;
                let arrayType = arrayValue ? typeof arrayValue : `Object`;

                if(arrayType === `string` && isDateTimeISO(arrayValue)) {
                    arrayType = `DateTime`; //luxon DateTime class
                } else if(arrayType === `object`) {
                    const objectName = capitalize(key);
                    const classExists = classes.some(jsClass=>jsClass.className === objectName && Object.entries(jsClass.model).every(([jsKey, jsValue]) => arrayValue[jsKey] === jsValue));
                    arrayType = objectName;
                    if(!classExists) {
                        classes = getModelsFromJson(arrayValue, objectName, classes);
                    }
                }

                model[key] = `${capitalize(arrayType)}[]`;
            } else {
                const objectName = capitalize(key);
                const classExists = classes.some(jsClass=>jsClass.className === objectName && Object.entries(jsClass.model).every(([jsKey, jsValue]) => value[jsKey] === jsValue));
                
                model[key] = objectName;
                if(!classExists) {
                    classes = getModelsFromJson(value, objectName, classes);
                }
            }
        } else {
            model[key] = capitalize(type);
        }
    });

    classes.push({className, model});
    return classes;
};

export {
    Placeholder,
    getTemplate,
    getClassPropertiesTemplate,
    getConstructorParamsTemplate,
    getConstructorPropertiesTemplate,
    getModelsFromJson
};