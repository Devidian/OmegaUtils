/**
 * calculates difference between 2 objects
 *
 * @export
 * @param {any} oldObj the first object
 * @param {any} newObj the second object to compare with
 * @returns the changes between the first and the second object
 */
export function diffObject(oldObj, newObj) {
	let diffObj: { id?: any, _id?: any } = {};
	// Set id if available
	if (oldObj.id) {
		diffObj.id = oldObj.id;
	}
	if (oldObj._id) {
		diffObj._id = oldObj._id;
	}

	for (let prop in newObj) {
		if (typeof newObj[prop] === 'object') {
			diffObj[prop] = diffObject(oldObj[prop], newObj[prop]);
		} else {
			if (!oldObj[prop] || oldObj[prop] !== newObj[prop]) {
				diffObj[prop] = newObj[prop];
			}
		}
	}

	return diffObj;
}