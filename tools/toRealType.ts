import { isNumeric } from "./isNumeric";

/**
 * converts input to its real (base) type
 *
 * @export
 * @param {any} input
 * @returns {boolean|number|string|any}
 */
export function toRealType(input): boolean | number | string | any {
	if (Array.isArray(input) || input === Object(input)) {
		for (let i in input) {
			input[i] = toRealType(input[i]);
		}
		return input;
	}
	// typecheck
	if (isNumeric(input)) {
		return Number(input);
	}
	if ([true, false, "true", "false"].indexOf(input) >= 0) {
		return Boolean(input);
	}
	return input;
}