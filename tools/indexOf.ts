import { deepEqual } from "assert";

/**
 * searches an array of objects for a specific object with a property value (searchTerm)
 *
 * @export
 * @param {{}[]} inArray
 * @param {*} searchTerm
 * @param {string} property
 * @returns {number}
 */
export function indexOf(inArray: {}[], searchTerm: any, property: string): number {
	for (var i = 0, len = inArray.length; i < len; i++) {
		try {
			deepEqual(inArray[i][property], searchTerm, 'Not equal');
			return i;
		} catch (error) {
			// not equal
		}
	}
	return -1;
}