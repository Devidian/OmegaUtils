/**
 *
 *
 * @export
 * @param {string} p
 * @returns {boolean}
 */
export function notEmpty(p: string): boolean {
	return ['', null, 'undefined', undefined].indexOf(p) < 0;
}