import { isNumeric } from "./isNumeric";
import { ObjectID } from "mongodb";

/**
 * converts input to its real (base) type
 *
 * @export
 * @param {any} input
 * @returns {boolean|number|string}
 */
export function toRealTypeMongo(input): any {
	if (Array.isArray(input)) {
		for (const key in input) {
			// console.log(key);
			input[key] = toRealTypeMongo(input[key]);
		}
		
		return input;
	}
	if(input === Object(input)){
		// console.log('input is object', input);
		for (const key in input) {
			if (input.hasOwnProperty(key)) {
				input[key] = toRealTypeMongo(input[key]);
			}
		}
		return input;
	}
	// typecheck
	if(ObjectID.isValid(input) && new ObjectID(input)+'' === input){
		return new ObjectID(input);
	}
	if (isNumeric(input)) {
		return Number(input);
	}
	if ([true, false, "true", "false"].indexOf(input) >= 0) {
		return Boolean(input);
	}
	return input;
}