export const capitalize = (word: string) => {
    const baseType = ['any', 'object', 'boolean', 'number', 'string', 'array', 'void', 'Undefined', 'null', 'never', 'unknown'];
    if (baseType.includes(word)) {
        return word;
    }
    return word[0].toUpperCase() + word.slice(1);
};

export const isDateTimeISO = (word: string) => /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/.test(word);