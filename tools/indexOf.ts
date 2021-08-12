import { deepStrictEqual } from 'assert';

/**
 * searches an array of objects for a specific object with a property value (searchTerm)
 *
 * @export
 * @param {{}[]} inArray
 * @param {*} searchTerm
 * @param {string} property
 * @returns {number}
 */
export function indexOf(inArray: { [key: string]: unknown }[], searchTerm: unknown, property: string): number {
	for (let i = 0, len = inArray.length; i < len; i++) {
		try {
			deepStrictEqual(inArray[i][property], searchTerm, 'Not equal');
			return i;
		} catch (error) {
			// not equal
		}
	}
	return -1;
}
