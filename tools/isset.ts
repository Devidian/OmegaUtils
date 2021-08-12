/**
 * undefined check
 *
 * @export
 * @param {*} p
 * @returns {boolean}
 */
export function isset(p: unknown): boolean {
	return p !== undefined;
}