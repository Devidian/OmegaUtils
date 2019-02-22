/**
 * checks if a value is numeric
 *
 * @export
 * @param {any} n the value to check
 * @returns {boolean} true if its numeric
 */
export function isNumeric(n): boolean {
	var ts = Object.prototype.toString;
	return (ts.call(n) === '[object Number]' || ts.call(n) === '[object String]') && !isNaN(parseFloat(n)) && isFinite(n.toString().replace(/^-/, ''));
}