import crypto from 'crypto';
import { getData, setData, resetCodeObject } from './dataStore';
import {
  isNameValid,
  isNameLengthValid,
  isUserIdActive,
  isTokenValid,
  checkIndexOfTokenId,
  checkIndexOfAuthUserId,
  timeSentCalculation,
  findTokenObject
} from './other';
import { config, isRemovedUserEmail } from './users';
import validator from 'validator';
import HTTPError from 'http-errors';

export interface authUserType {
  authUserId: number;
}

// SUPER SECRET FOR HASH
export const SECRET = 'CRUNCHIE';

export function getHashOf(plaintext: string) {
  return crypto.createHash('sha256').update(plaintext).digest('hex');
}

// Type declaration
// type authUserId = {authUserId: number };
// type errorResponseType = { error: string };
/**
 * authLoginV1 - Jovanka Kurniawan
 * Edited by - Jovanka Kurniawan
 *
 * @param {
 *     email<> (string)
 *     password<>  (string)
 * }
 *
 * @returns {
 *     authUserId: number
 * }
 *
 */
const authLoginV1 = (email: string, password: string):authUserType => {
  const dataStore = getData();
  // error checking:
  // email entered does not belong to a user
  if (!(isUserEmailActive(email))) throw HTTPError(400, 'email entered does not belong to a user => auth');
  // password is not correct
  if (!(isPasswordCorrect(email, password))) throw HTTPError(400, 'password is not correct => auth');

  // let authUserId = 0;
  for (const i in dataStore.users) {
    if (email === dataStore.users[i].email) {
      return {
        authUserId: dataStore.users[i].id
      };
    }
  }
};

/**
 * authLogoutV1 - Jovanka Kurniawan
 * Edited by - Jovanka Kurniawan
 *
 * @param {
 *     token<> (string)
 * }
 *
 * @returns {
 * }
 *
 */
const authLogoutV1 = (token: string):object => {
  const dataStore = getData();
  // error checking:
  isTokenValid(token);

  const tokenPosition = checkIndexOfTokenId(token);
  dataStore.tokens.splice(tokenPosition, 1);
  setData(dataStore);
  return ({ });
};

/**
 * authRegisterV1 - Jovanka Kurniawan
 * Edited by - James Humphries
 * Given a user's first and last name, email address, and password, create a new account for them and return a new `authUserId`.
 * Return an error if email, password, nameFirst or nameLast is invalid
 * Return an error if the email is already in the system
 * @param {
 *     email<> (string)
 *     password<>  (string)
 *     nameFirst<>  (string)
 *     nameLast<>  (string)
 * }
 *
 * @returns {
 *     authUserId: userId, - Newly created userId
 * }
 *
 */
const authRegisterV1 = (email: string, password:string, nameFirst: string, nameLast: string):authUserType => {
  // Remove any spaces in first name, last name or password
  const nameFirstStr = nameFirst.split(' ').join('');
  const nameLastStr = nameLast.split(' ').join('');
  const passwordStr = password.split(' ').join('');
  // Check if any field is empty
  if (!isNameValid(email) || !isEmailValid(email)) throw HTTPError(400, 'email entered is not a valid email => auth');
  if (!isNameValid(passwordStr) || !isPasswordValid(passwordStr)) throw HTTPError(400, 'length of password is less than 6 characters => auth');
  const maxLength = 50;
  // Check parameter specific commands
  if (!isNameValid(nameFirstStr) || !isNameLengthValid(nameFirstStr, maxLength)) throw HTTPError(400, 'length of nameFirst is not between 1 and 50 characters inclusive => auth');
  if (!isNameValid(nameLastStr) || !isNameLengthValid(nameLastStr, maxLength)) throw HTTPError(400, 'length of nameLast is not between 1 and 50 characters inclusive => auth');
  // Check to see if the users email is already in the system
  if (isUserEmailActive(email) && !isRemovedUserEmail(email)) throw HTTPError(400, 'email address is already being used by another user => auth');

  let userId = 1;
  let globalOwnerStatus = false;
  // Check if the first user
  if (!isUserIdActive(userId)) {
    // First user, give them global permissions
    globalOwnerStatus = true;
  }

  // Loop through till user Id is unique
  while (isUserIdActive(userId)) {
    userId++;
  }
  const handleStr = nameFirst.toLowerCase() + nameLastStr.toLowerCase();
  let handle = handleStr.slice(0, 20);

  let handlerVal = -1;
  if (isUserHandleActive(handle)) {
    handlerVal++;
    while (isUserHandleActive(handle + handlerVal)) {
      handlerVal++;
    }
  }
  if (handlerVal !== -1) {
    handle = handle + handlerVal;
  }

  // Add to the array
  const user = {
    id: userId,
    nameFirst: nameFirstStr,
    nameLast: nameLastStr,
    password: getHashOf(passwordStr + SECRET),
    email: email,
    enrolledChannels: [],
    enrolledDms: [],
    handler: handle,
    globalOwner: globalOwnerStatus,
    userStats: {
      channelsJoined: [{ numChannelsJoined: 0, timeStamp: timeSentCalculation() }],
      dmsJoined: [{ numDmsJoined: 0, timeStamp: timeSentCalculation() }],
      messagesSent: [{ numMessagesSent: 0, timeStamp: timeSentCalculation() }],
      involvementRate: 0,
    },
    notifications: [],
    profileImgUrl: `${config.url}:${config.port}/profiles/startingimage.jpg`
  };
  const dataStore = getData();
  dataStore.users.push(user);
  setData(dataStore);
  return {
    authUserId: userId,
  };
};

/**
 * auth/passwordreset/request/v1 - Shakira Li
 *
 * sends email to the email from input
 * to be called in password reset function
 * (may need modifications)
 * @param {string} email
 *
 * @returns {}
 */
function authPasswordResetRequestV1(authUserId: number, email: string) {
  const nodemailer = require('nodemailer');

  const transporter = nodemailer.createTransport({
    // this is an actual gmail account i made for the project's purposes
    service: 'gmail',
    auth: {
      user: 'treats.w15crunchie@gmail.com',
      pass: 'oogzpvafksexiwfl'
    }
  });

  // generates a reset code
  let resetCode = Math.floor((Math.random() * 1000000) + 1);
  // while loop below will most likely fail coverage since the chances of getting
  // two exact same codes are very very small, this will also apply to the helper
  // functions origin in line 416 since a false return will only happen at a very
  // very small chance
  while (!isCodeUnique(resetCode.toString())) {
    resetCode = Math.floor((Math.random() * 1000000) + 1);
  }

  // message object
  const message = {
    from: 'treats.w15crunchie@gmail.com',
    to: email,
    subject: 'Treats Password Reset Request',
    text: 'The reset code is: ' + resetCode + '.'
  };

  // stores reset code and authUserId as uId
  const dataStore = getData();
  const code: resetCodeObject = {
    authUserId: authUserId,
    resetCode: getHashOf(resetCode + SECRET),
    valid: true
  };
  dataStore.resetCodes.push(code);

  // logout of all current sessions
  authLogoutV1(dataStore.tokens[findTokenObject(authUserId)].token);
  setData(dataStore);

  // if email is of a registered user's, sends email from sender to receiver
  // else, resetCode gets invalidated
  if (isUserEmailActive(email)) {
    transporter.sendMail(message, (err, data) => {
      if (err) {
        throw HTTPError(400, 'Error sending email.');
      }
    });
  } else {
    const codePosition = findCodePosition(getHashOf(resetCode + SECRET));
    dataStore.resetCodes[codePosition].valid = false;
  }

  return {};
}

/**
 * auth/passwordreset/reset/v1 - Shakira Li
 *
 * Given a reset code for a user, set that user's new password
 * to the password provided.
 *
 * @param {
 *    authUserId<> (number)
 *    resetCode (number)
 * }
 *
 * @returns {}
 */
function authPasswordResetV1 (resetCode: string, newPassword: string) {
  // to avoid rehashing when testing
  if (Number.isInteger(resetCode)) {
    resetCode = getHashOf(resetCode + SECRET);
  }

  if (!isPasswordValid(newPassword)) throw HTTPError(400, 'password entered is less than 6 characters long');
  if (!isResetCodeActive(resetCode) || !isResetCodeValid(resetCode)) throw HTTPError(400, 'resetCode is not a valid reset code');

  const dataStore = getData();
  const codePosition = findCodePosition(resetCode);
  const codeObject = dataStore.resetCodes[codePosition];
  const userPosition = checkIndexOfAuthUserId(codeObject.authUserId);
  dataStore.users[userPosition].password = getHashOf(newPassword + SECRET);
  codeObject.valid = false;
  setData(dataStore);

  return {};
}

/// ///////////////////
// Helper Functions //
/// ///////////////////
/**
* Check if email is valid
*
* @param {string} email to check
* @returns {Boolean} to indicate if a character.
*/
//
function isEmailValid(email: string): boolean {
  // Check if email is valid
  if (!validator.isEmail(email)) {
    return false;
  }
  return true;
}

/**
* Check if password is valid
*
* @param {string} password to check
* @returns {Boolean} to indicate result of test
*/
function isPasswordValid(password: string): boolean {
  // Check if email is valid
  if (password.length < 6) {
    return false;
  }
  return true;
}

/**
 * Check if the user Email is in dataStore
 *
 * @param {string} email
 * @returns {boolean}
 */
export function isUserEmailActive(email: string): boolean {
  const dataStore = getData();
  const userLength = dataStore.users.length;
  for (let i = 0; i < userLength; i++) {
    if (email === dataStore.users[i].email) {
      return true;
    }
  }
  // Email is not being used
  return false;
}

/**
 * Check if the User Handler is in dataStore
 *
 * @param {string} handle
 * @returns {boolean}
 */
export function isUserHandleActive(handle: string): boolean {
  const dataStore = getData();
  const userLength = dataStore.users.length;
  for (let i = 0; i < userLength; i++) {
    if (handle === dataStore.users[i].handler) {
      return true;
    }
  }
  // Email is not being used
  return false;
}

/**
 * Checks if the password is correct for the registered email
 * @param {
 *     email<> (string)
 *     password<>  (string)
 * }
 *
 * @returns {boolean}
 *
 */
function isPasswordCorrect(email: string, password: string): boolean {
  const dataStore = getData();
  let index = 0;
  for (const i in dataStore.users) {
    if (email === dataStore.users[i].email) {
      index = Number(i);
      break;
    }
  }
  if (dataStore.users[index].password === getHashOf(password + SECRET)) {
    return true;
  } else {
    return false;
  }
}

/**
 * Checks if the code has been invalidated
 *
 * @param {number} resetCode
 * @returns {boolean}
 */
function isResetCodeValid (resetCode: string): boolean {
  const dataStore = getData();
  const codePosition = findCodePosition(resetCode);
  if (dataStore.resetCodes[codePosition].valid) return true;
  // reset code has been invalidated
  return false;
}

/**
 * Checks if the code is active
 *
 * @param {number} resetCode
 * @returns {boolean}
 */
function isResetCodeActive (resetCode: string): boolean {
  const dataStore = getData();
  const codePosition = findCodePosition(resetCode);
  if (resetCode === dataStore.resetCodes[codePosition].resetCode) return true;
  // reset code does not exist
  return false;
}

/**
 * Finds the index of the resetCode
 *
 * @param {number} resetCode
 * @returns {number}
 */
function findCodePosition (resetCode: string): number {
  const dataStore = getData();
  for (const codePosition in dataStore.resetCodes) {
    if (resetCode === dataStore.resetCodes[codePosition].resetCode) return Number(codePosition);
  }
  throw HTTPError(400, 'resetCode is not a valid reset code');
}

/**
 * Checks if the code is unique
 *
 * @param {number} unhashedResetCode
 * @returns {boolean}
 */
function isCodeUnique (unhashedResetCode: string): boolean {
  const dataStore = getData();
  const resetCode = getHashOf(unhashedResetCode + SECRET);
  if (dataStore.resetCodes === undefined) return true;

  // look at line 196 for explanation
  for (const code of dataStore.resetCodes) {
    if (resetCode === code.resetCode) return false;
  }

  return true;
}

/// ////////////////////////////
// FOR TESTING PURPOSES ONLY //
/// ////////////////////////////
/**
 * Grabs the randomised resetCode of the authUserId
 *
 * @param {number} authUserId
 * @returns
 */
export function codeDetails (authUserId: number) {
  const dataStore = getData();
  for (const codePosition in dataStore.resetCodes) {
    const codeObject = dataStore.resetCodes[codePosition];
    if (authUserId === codeObject.authUserId && isResetCodeValid(codeObject.resetCode)) return codeObject.resetCode;
  }
  // throw HTTPError(400, 'user did not request for password reset => auth');
}

export {
  authLoginV1,
  authRegisterV1,
  authLogoutV1,
  authPasswordResetRequestV1,
  authPasswordResetV1
};
