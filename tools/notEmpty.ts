/**
 *
 *
 * @export
 * @param {any} p
 * @returns {boolean}
 */
export function notEmpty(p): boolean {
	return ['', null, 'undefined', undefined].indexOf(p) < 0;
}