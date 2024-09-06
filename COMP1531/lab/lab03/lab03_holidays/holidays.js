import promptSync from 'prompt-sync';
import {getChristmas, getEaster, getValentinesDay} from 'date-fns-holiday-us';
import {format} from 'date-fns';

/**
 * Given a starting year and an ending year:
 * - If `start` is not at least 325, return an empty array.
 * - If `start` is strictly greater than `end`, return an empty array.
 * - Otherwise, return an object containing information about the valentine,
 * easter and christmas date strings in the given (inclusive) range.
 *
 * An example format for christmas in 1970 is
 * - Friday, 25.12.1970
 *
 * @param {number} start - starting year, inclusive
 * @param {number} end - ending year, inclusive
 * @returns {Array<{valentinesDay: number, easter: number, christmas: number}>}
 */
export function holidaysInRange(start, end) {
  if (start < 325 || start > end) {
    return [];
  }

  const holidays = [];
  for (let i = start; i <= end; i++) {
    let temp = {
      valentinesDay: format(getValentinesDay(i), "eeee',' dd'.'MM'.'y"),
      easter: format(getEaster(i), "eeee',' dd'.'MM'.'y"),
      christmas: format(getChristmas(i), "eeee',' dd'.'MM'.'y"),
    }

    holidays.push(temp);
  }

  return holidays;
}

/**
 * TODO: Implement the two lines in the "main" function below.
 * This function is imported and called in main.js
 */
export function main() {
  const prompt = promptSync();
  const start = parseInt(prompt('Enter start year: '));
  const end = parseInt(prompt('Enter end year: '));

  const holidays = holidaysInRange(start, end);
  console.log(holidays);
}
