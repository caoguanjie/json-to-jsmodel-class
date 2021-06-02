{
    "HI" : "string",
    "B": "int"
}

export class ClassName {
	/**
	 * @typedef ClassNameConstructor
	 * @type {object}
	 * @property {string} HI
	 * @property {int} B
	 */
	/**
	 * @param {ClassNameConstructor} ClassNameConstructor - ClassNameConstructor
	 */
	constructor({ HI, B }={}) {
		this.HI = HI;
		this.B = B;
	}
}
