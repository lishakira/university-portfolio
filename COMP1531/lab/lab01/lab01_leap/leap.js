/**
 * Complete the function below which takes in a year and returns
 * true if it is a leap year and false otherwise.
 * - https://en.wikipedia.org/wiki/Leap_year#Algorithm
 *
 * When comparing values, use `===` and `!==` instead of `==` or `!=`.
 * When testing, the 'year' is guaranteed to be a strictly positive integer.
 *
 * @param {number} year - for example, 1999.
 * @returns {boolean} whether the given year is true or false
 */
function isLeap(year) {
  // TODO: return true or false depending on the year, rather than null.

  if ((year % 100 === 0 && year % 400 === 0) || 
      (year % 100 !== 0 && year % 4 === 0)) {
    return true;
  } 

  return false;
}

/**
 * Given an array of strictly positive years, return the number of
 * leap years present.
 *
 * @param {Array<number>} yearArray - for example, [1899, 1904, 1900, 2000]
 * @returns {number} the number of leap years in the given array
 */
function countLeaps(yearArray) {
  // TODO

  let count = 0;

  for (let i = 0; i < yearArray.length; i++) {
    if (isLeap(yearArray[i]) === true) {
      count++;
    }
  }

  return count;
}

/**
 * Given a strictly positive year, return the closest leap year
 * AFTER the given year.
 *
 * @param {number} year, for example 1999
 * @returns
 */
function getNextLeap(year) {

  let leapyear = year;

  if (isLeap(year) === true) {
    leapyear++;
  } 
  
  while (isLeap(leapyear) === false) {
    leapyear++;
  }

  return leapyear;
}

//= ========================================================================= //

/**
 * The code below will be executed when you run this file with
 *     $ node leap.js
 *
 * Feel free to modify the code below to do your own testing.
 * Any modification will have 0 impact on the automarking
 * (we won't be using this!).
 */
console.log("For these tests, you pass if no 'Assertion failed' is outputted!");

console.log();
console.log('=== testing isLeap ===');
console.assert(isLeap(1899) === false, '1899 is not a leap year!');
console.assert(isLeap(1904) === true, '1904 is a leap year!');
console.assert(isLeap(1900) === false, '1900 is a not a leap year!');
console.assert(isLeap(2000) === true, '2000 is a leap year!');

console.log();
console.log('=== Testing countLeap ===');
console.assert(countLeaps([1899, 1904, 1900, 2000]) === 2, 'There should be 2 leap years!');
console.assert(countLeaps([1899, 1900]) === 0, 'There should be 0 leap years!');
console.assert(countLeaps([4, 400, 4000]) === 3, 'There should be 3 leap years!');

console.log();
console.log('=== Testing getNextLeap ===');
console.assert(getNextLeap(2000) === 2004, 'Should skip 2000 to 2004!');
console.assert(getNextLeap(1697) === 1704, 'Should be 1704, since 1700 is not a leap year!');
