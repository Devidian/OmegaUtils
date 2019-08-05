/**
 *
 *
 * @export
 * @param {any} p
 * @returns {boolean}
 */
export function notEmpty(p: any): boolean {
	return ['', null, 'undefined', undefined].indexOf(p) < 0;
}