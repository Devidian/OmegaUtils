/**
 * This function can be used to clamp a value to min and max values
 *
 * @export
 * @param {number} val the value to clamp
 * @param {number} lower the minimum for value
 * @param {number} upper the maximum for value
 * @returns {number} either val, lower or upper
 */
export function clamp(val: number, lower: number, upper: number): number {
    return Math.max(Math.min(val, upper), lower);
}