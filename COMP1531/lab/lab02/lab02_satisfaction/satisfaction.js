/**
 * Switches the element of bigger value to be on top of the 
 * element of smaller value.
 * 
 * @param {Array<number>} array 
 * @param {Array<indexOne>} indexOne
 * @param {Array<indexTwo>} indexTwo
 * 
 * NOTE: Array<indexOne> > Array<indexTwo>; indexOne > indexTwo
 * 
 * @returns array with the same items but with the two elements
 * switched up.
 */
function reorder(array, indexOne, indexTwo) {
  const temp = array[indexOne]
  array[indexOne] = array[indexTwo];
  array[indexTwo] = temp;
}

/**
 * Given an array of fast food restaurants, return a new sorted
 * array in descending order by:
 *
 *     1. customerService
 *     2. foodVariety
 *     3. valueForMoney
 *     4. timeToMake
 *     5. taste
 *     6. name (in lexicographical order, case-insensitive)
 *
 * For example, if two restaurant have the same customerService
 * and foodVariety, the one with a higher valueForMoney will be
 * in front (nearer to the start of the returned array).
 *
 * If the all other fields are equal and the name is compared,
 * "hungry Jacks" will be before "KFC" because "h" is before "K".
 *
 * WARNING: You should NOT modify the order of the original array.
 *
 * @param {
 *     Array<{
 *         name: string,
 *         customerService: number,
 *         foodVariety: number,
 *         valueForMoney: number,
 *         timeToMake: number,
 *         taste: number
 *     }>
 * } fastFoodArray with information about fast food restaurants,
 * which should not be modified.
 * @returns array with the same items, sorted by the key-order given.
 */
function sortedFastFood(fastFoodArray) {
  for (let i = fastFoodArray.length - 1; i > 0; i--) {
    for (let j = fastFoodArray.length - 2; j >= 0; j--) {
      if (fastFoodArray[i].customerService > fastFoodArray[j].customerService) {
        reorder(fastFoodArray, i, j);
      } else if (fastFoodArray[i].customerService === fastFoodArray[j].customerService) {
        if (fastFoodArray[i].foodVariety > fastFoodArray[j].foodVariety) {
          reorder(fastFoodArray, i, j);
        } else if (fastFoodArray[i].foodVariety === fastFoodArray[j].foodVariety) {
          if (fastFoodArray[i].valueForMoney > fastFoodArray[j].valueForMoney) {
            reorder(fastFoodArray, i, j);
          } else if (fastFoodArray[i].valueForMoney === fastFoodArray[j].valueForMoney) {
            if (fastFoodArray[i].timeToMake > fastFoodArray[j].timeToMake) {
              reorder(fastFoodArray, i, j);
            } else if (fastFoodArray[i].timeToMake === fastFoodArray[j].timeToMake) {
              if (fastFoodArray[i].taste > fastFoodArray[j].taste) {
                reorder(fastFoodArray, i, j);
              } else if (fastFoodArray[i].taste === fastFoodArray[j].taste) {
                if (fastFoodArray[i].name > fastFoodArray[j].name) {
                  reorder(fastFoodArray, i, j);
                }
              }
            }
          }
        }
      }
    }
  }

  return fastFoodArray;
}

/**
 * Given an array of fast food restaurants, return a new sorted
 * array ranked by the overall satisfaction.
 *
 * The satisfaction of a restaurant is the average score between
 * customerService, foodVariety, valueForMoney, timeToMake and taste.
 *
 * You do not need to round the satisfaction value.
 *
 * If two restaurants have the same satisfaction, the names
 * are compared in lexigraphical order (case-insensitive).
 * For example, "hungry Jacks" will appear before "KFC" because
 * "h" is before "K".
 *
 * WARNING: you should NOT modify the order of the original array.
 *
 * @param {
 *     Array<{
 *         name: string,
 *         customerService: number,
 *         foodVariety: number,
 *         valueForMoney: number,
 *         timeToMake: number,
 *         taste: number
 *    }>
 * } fastFoodArray with information about fast food restaurants,
 * which should not be modified.
 * @returns {
 *     Array<{
 *         restaurantName: string,
 *         satisfaction: number,
 *     }>
 * } a new sorted array based on satisfaction. The restaurantName
 * will be the same as the original name given.
 */
function sortedSatisfaction(fastFoodArray) {
  const satisfactionArray = [];

  for (let i = 0; i < fastFoodArray.length; i++) {
    satisfactionArray.push({
      restaurantName: fastFoodArray[i].name,
      satisfaction: (fastFoodArray[i].customerService + 
                     fastFoodArray[i].foodVariety + 
                     fastFoodArray[i].valueForMoney + 
                     fastFoodArray[i].timeToMake + 
                     fastFoodArray[i].taste) / 5
    },);
  }

  for (let i = satisfactionArray.length - 1; i > 0; i--) {
    for (let j = satisfactionArray.length - 2; j >= 0; j--) {
      if (satisfactionArray[i].satisfaction > satisfactionArray[j].satisfaction) {
        reorder(satisfactionArray, i, j);
      } else if (satisfactionArray[i].satisfaction === satisfactionArray[j].satisfaction) {
        if (satisfactionArray[i].name > satisfactionArray[j].name) {
          reorder(satisfactionArray, i, j);
        }
      }
    }
  }

  return satisfactionArray;
}

// ========================================================================= //

/**
 * Execute the file with:
 *     $ node satisfaction.js
 *
 * Feel free to modify the below to test your functions.
 */
const fastFoods = [
  {
    name: 'Second fastFood, third satisfaction (4.6)',
    customerService: 5,
    foodVariety: 4,
    valueForMoney: 5,
    timeToMake: 4,
    taste: 5,
  },
  {
    // Same as above, but name starts with "f"
    // which is before "S" (case-insensitive)
    name: 'First fastFood, second satisfaction (4.6)',
    customerService: 5,
    foodVariety: 5,
    valueForMoney: 4,
    timeToMake: 5,
    taste: 3
  },
  {
    // Worse foodVariety, but better overall
    name: 'Third fastFood, first satisfaction (4.8)',
    customerService: 5,
    foodVariety: 5,
    valueForMoney: 3,
    timeToMake: 5,
    taste: 4
  },
];

// Note: We are using console.log because arrays cannot be commpared with ===.
// There are better ways to test which we will explore in future weeks :).
console.log('========================');
console.log('1. Testing Fast Food');
console.log('===========');
console.log(sortedFastFood(fastFoods));
console.log();

console.log('========================');
console.log('2. Testing Satisfaction');
console.log('===========');
console.log(sortedSatisfaction(fastFoods));
console.log();
