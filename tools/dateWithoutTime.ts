/**
 * returns a date without time component useful if you want to get 2 dates for between querrys
 *
 * @param {Date} d the Date Object to flattern, leave out for today
 * @param {number} daydiff Number of days to sub (-) or add (+)
 */
export function dateWithoutTime(d?: Date, daydiff?: number): Date {
	let flatDate = d ? new Date(d) : new Date();
	flatDate.setHours(0, 0, 0, 0);

	flatDate.setDate(flatDate.getDate() + (daydiff ? daydiff : 0));
	return flatDate;
}