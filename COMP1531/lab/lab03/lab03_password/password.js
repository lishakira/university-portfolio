/**
 * NOTE: Tests for the checkPassword should be written first,
 * before implementing the function below.
 * @module password
 */

/**
 * Checks if the password includes a number by using 
 * isNaN(string[index]) function.
 * - function returns true if the character is Not a Number;
 * - otherwise, function returns false
 * 
 * @param {string[index]} password
 * @returns 'true' if the password includes a number; 
 * otherwise, 'false'.
 */
 function hasNum(password) {
  for (let i = 0; i < password.length; i++) {
    if (isNaN(password.charAt(i)) === false) {
      return true;
    } 
  }

  return false;
}

/**
 * Checks if the password includes both uppercase and
 * lowercase letters.
 * 
 * @param {string[index]} password 
 * @returns 'true' if the password includes both uppercase and 
 * lowercase letters; otherwise, 'false'.
 */
function hasBothCaseLetters(password) {
  let hasUppercaseLetter = false;
  let hasLowercaseLetter = false;

  for (let i = 0; i < password.length; i++) {
    if (password[i] === password[i].toUpperCase() && (/[a-zA-z]/).test(password[i]) === true) {
      hasUppercaseLetter = true;
    }
    if (password[i] === password[i].toLowerCase() && (/[a-zA-z]/).test(password[i]) === true) {
      hasLowercaseLetter = true;
    }
    if (hasUppercaseLetter === true && hasLowercaseLetter === true) {
      return true;
    }
  }

  return false;
}

/**
 * Checks the strength of the given password and returns a string
 * to represent the result.
 *
 * The returned string is based on the requirements below:
 * - "Strong Password"
 *     - at least 12 characters
 *     - at least  1 number
 *     - at least  1 uppercase letter
 *     - at least  1 lowercase letter
 * - "Moderate Password"
 *     - at least  8 characters
 *     - at least  1 number
 * - "Horrible Password"
 *     - passwords that are exactly any of the top 5 (not 20) passwords
 *     from the 2021 Nordpass Ranking:
*      - https://en.wikipedia.org/wiki/List_of_the_most_common_passwords
 * - "Poor Password"
 *     - any password that is not horrible, moderate or strong.
 *
 * @param {string} password to check
 * @returns {string} string to indicate the strength of the password.
 */
export function checkPassword(password) {
  const horriblePasswords = ['123456', '123456789', '12345', 'qwerty', 'password'];

  if (horriblePasswords.includes(password) === true) {
    return 'Horrible Password'
  }

  if (hasBothCaseLetters(password) === true && password.length >= 12 && hasNum(password) === true) {
    return 'Strong Password'
  }

  if (password.length >= 8 && hasNum(password) === true) {
    return 'Moderate Password'
  }

  return 'Poor Password';
} 

/**
 * Testing will no longer be done in here.
 * See password.test.js
 */