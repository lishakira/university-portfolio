/**
 * Compute the sum of the integer array.
 * If the array is empty, the sum is 0.
 *
 * @param {Array<number>} array of integers
 * @returns {number} the sum of the array
 */
function arraySum(array) {
  let sum = 0;

  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }

  return sum;
}

/**
 * Compute the product of the given integer array.
 * If the array is empty, the product is 1.
 *
 * @param {Array<number>} array of integers
 * @returns {number} the product of the array
 */
function arrayProduct(array) {
  let product = 1;

  for (let i = 0; i < array.length; i++) {
    product *= array[i];
  }

  return product;
}

/**
 * Find the smallest number in the array
 *
 * @param {Array<number>} array of integers
 * @returns {number|null} the smallest number in the array, or
 * null if the array is empty
 */
function arrayMin(array) {
  if (array.length === 0) {
    return null;
  }

  let min = array[0];

  for (let i = 0; i < array.length; i++) {
    if (array[i] <= min) {
      min = array[i];
    }
  }

  return min;
}

/**
 * Find the largest number in the array
 *
 * @param {Array<number>} array of integers
 * @returns {number|null} the largest number in the array, or
 * null if the array is empty
 */
function arrayMax(array) {
  if (array.length === 0) {
    return null;
  }

  let max = array[0];

  for (let i = 0; i < array.length; i++) {
    if (array[i] >= max) {
      max = array[i];
    }
  }

  return max;
}

/**
 * Determine if the array contains a particular element.
 *
 * @param {Array<number>} array of integers
 * @param {number} item integer to check
 * @returns {boolean} whether the integer item is in the given array
 */
function arrayContains(array, item) {
  // FIXME: true or false instead of null
  for (let i = 0; i < array.length; i++) {
    if (item === array[i]) {
      return true;
    }
  }

  return false;
}

/**
 * Create an array that is the reserved of the original.
 *
 * WARNING: a reminder that the original(s) array must not be modified.
 * You can create new arrays if needed.
 *
 * @param {Array<number>} array of integers
 * @returns {Array<number>} a new reversed array
 */
function arrayReversed(array) {
  const reverseArray = [];

  for (i = array.length - 1; i >= 0; i--) {
    reverseArray.push(array[i]);
  }

  return reverseArray;
}

/**
 * Returns the first element in the array
 *
 * @param {Array<number>} array of integers
 * @returns {number|null} the first element in the array,
 * or null if the array is empty
 */
function arrayHead(array) {
  return array.length !== 0 ? array[0] : null;
}

/**
 * Return all elements in the array after the head.
 *
 * WARNING: a reminder that the original(s) array must not be modified.
 * You can create new arrays if needed.
 *
 * @param {Array<number>} array of integers
 * @returns {Array<number>} an array of elements excluding the head,
 * or null array is empty
 */
function arrayTail(array) {
  return array.length !== 0 ? array[array.length - 1] : null;
}

/**
 * Given two arrays, multiply the elements at each index from arrays and store
 * the result in a third array. If the given two arrays differ in length,
 * excess elements of the larger array will be added on at the end.
 *
 * For example,
 *     [1, 3, 2]
 *   x [2, 4, 3, 5, 9]
 *   -----------------
 *   = [2, 12, 6, 5, 9]
 *
 * The result will be the same if array1 and array2 are swapped.
 *
 * @param {Array<number>} array1 of integers
 * @param {Array<number>} array2 of integers
 * @returns {Array<number>} array1 x array2 at each index
 */
function arraysMultiply(array1, array2) {
  const result = [];

  for (let i = 0; i < array1.length || i < array2.length; i++) {
    if (i >= array1.length) {
      result.push(array2[i]);
    } else if (i >= array2.length) {
      result.push(array1[i]);
    } else {
      result.push(array1[i] * array2[i]);
    }
  }

  return result;
}

/**
 * Create a third array containing common elements between two arrays.
 *
 * Each element in the first array can map to at most one element
 * in the second array. Duplicated elements in each array are
 * treated as separate entities.
 *
 * The order is determined by the first array.
 *
 * A few examples,
 *   arraysCommon([1,1], [1,1,1]) gives [1,1]
 *   arraysCommon([1,1,1], [1,1]) gives [1,1]
 *   arraysCommon([1,2,3,2,1], [5,4,3,2,1]) gives [1,2,3]
 *   arraysCommon([1,2,3,2,1], [2,2,3,3,4]) gives [2,3,2]
 *   arraysCommon([1,4,1,1,5,9,2,7], [1,8,2,5,1]) gives [1,1,5,2]
 *
 * WARNING: a reminder that the original array(s) must not be modified.
 * You can create new arrays if needed.
 *
 * @param {Array<number>} array1 of integers
 * @param {Array<number>} array2 of integers
 * @returns {Array<number>} number of common elements between two arrays
 */
function arraysCommon(array1, array2) {
  const result = [];

  for (i = 0; i < array1.length; i++) {
    for (j = 0; j < array2.length; j++) {
      if (array1[i] === array2[j]) {
        result.push(array1[i]);
        j = array2.length;
      }
    }
  }

  return result;
}

// ========================================================================= //

/**
 * Some test code
 */

console.assert(arraySum([1, 2, 3, 4]) === 10, 'arraySum([1,2,3,4]) === 10');
console.assert(arrayProduct([1, 2, 3, 4]) === 24, 'arrayProduct([1,2,3,4]) === 24');

/**
 * NOTE: you can't directly compare two arrays with `===`, so you may need
 * to come up with your own way of testing arrays this week. For example, you
 * could use console.log() and observe the output manually.
 */
console.log();
console.log('Testing : arrayCommon([1,2,3,2,1], [2,2,3,3,4])');
console.log('Received:', arraysCommon([1, 2, 3, 2, 1], [2, 2, 3, 3, 4]));
console.log('Expected: [2,3,2]');
console.log();

// TODO: your own testing/debugging here
console.log("Minimum in [99, 23, 54, 61, 87]:", arrayMin([99, 23, 54, 61, 87]));
console.log("Maximum in [86, 23, 54, 102, 87]:", arrayMax([86, 23, 54, 102, 87]));
console.log("2 is in [1, 2, 3]:", arrayContains([1, 2, 3], 2));
console.log("4 is in [1, 2, 3]:", arrayContains([1, 2, 3], 4));
console.log("Reverse array of [99, 23, 54, 61, 87]:", arrayReversed([99, 23, 54, 61, 87]));
console.log("Head element of [1, 2, 3]:", arrayHead([1, 2, 3]));
console.log("Tail element of [1, 2, 3]:", arrayTail([1, 2, 3]));
console.log();
console.log('Testing : arraysMultiply([1, 3, 2], [2, 4, 3, 5, 9])');
console.log('Received:', arraysMultiply([1, 3, 2], [2, 4, 3, 5, 9]));
console.log('Expected: [2, 12, 6, 5, 9]');
console.log();
console.log('Testing : arrayCommon([99, 33, 66, 12, 0], [66, 66, 24, 22, 0])');
console.log('Received:', arraysCommon([99, 33, 66, 12, 0], [66, 66, 24, 22, 0]));
console.log('Expected: [66, 0]');
console.log();