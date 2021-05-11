/**
 * https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
 *
 * @param {*} array
 * @param {*} callback
 */
export async function asyncForEach<T>(array: T[], callback: (item: T, index: number, array: T[]) => Promise<void>) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}
