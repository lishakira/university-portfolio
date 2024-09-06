import { getData, setData } from './dataStore';
import {
  isNameValid,
  isNameLengthValid,
  isUserIdActive,
  checkIndexOfAuthUserId,
  timeSentCalculation,
} from './other';
import { isUserEmailActive, isUserHandleActive } from './auth';
// import { config } from './config.json';
import validator from 'validator';
import HTTPError from 'http-errors';
import request from 'sync-request';
import fs from 'fs';
import { saveData } from './serverAssistant';

export const config = {
  url: 'http://127.0.0.1',
  port: 2195
};

export interface userReturn {
  uId: number;
  email: string;
  nameFirst: string;
  nameLast: string;
  handleStr: string;
  profileImgUrl: string;
}

export interface user {
  user: userReturn;
}

export interface users {
  users: user | user[];
}

/**
 * userProfileV1 - Maximilian Falco Widjaya
 * userProfileV2 - Shakira Li
 *
 * Given a valid user, it returns information about their userId, email,
 * first name, last name and handle.
 * @param {
 *     authUserId<> (string)
 *     uId<>   (integer)
 * }
 *
 * @returns {
 *     user<> ({'uId': '', 'email' : '', 'nameFirst': '', 'nameLast': '', 'handleStr': '',})
 * }
 *
 */
const userProfileV1 = (authUserId: number, uId: number): user => {
  if (!isUserIdActive(uId)) throw HTTPError(400, 'uId does not refer to a valid user');

  const dataStore = getData();
  const index: number = checkIndexOfAuthUserId(uId);

  return {
    user: {
      uId: dataStore.users[index].id,
      email: dataStore.users[index].email,
      nameFirst: dataStore.users[index].nameFirst,
      nameLast: dataStore.users[index].nameLast,
      handleStr: dataStore.users[index].handler,
      profileImgUrl: dataStore.users[index].profileImgUrl,
    }
  };
};

/**
 * usersAllV1 - Shakira Li
 *
 * Returns an array of all users and their associated details.
 *
 * @param {
 *    token<> (Array)
 * }
 *
 * @returns {
 *    users<> (Array)
 * }
 */
const usersAllV1 = (authUserId: number): users => {
  const dataStore = getData();
  const output = {
    users: [],
  };

  for (const user of dataStore.users) {
    // will not add removed users into the array of all users
    if (user.nameFirst !== 'Removed' && user.nameLast !== 'user') {
      output.users.push(userProfileV1(authUserId, user.id).user);
    }
  }

  return output;
};

/**
 * userProfileSetNameV1 - Shakira Li
 *
 * Update the authorised user's first and last name
 *
 * @param {
 *    token<> (string)
 *    nameFirst<> (string)
 *    nameLast<> (string)
 * }
 *
 * @returns {}
 */
const userProfileSetNameV2 = (authUserId: number, nameFirst: string, nameLast:string): object => {
  // length != (0 or undefined)
  const maxLength = 50;
  if (!isNameValid(nameFirst) || !isNameLengthValid(nameFirst, maxLength)) throw HTTPError(400, 'length of nameFirst is not between 1 and 50 characters inclusive');
  if (!isNameValid(nameLast) || !isNameLengthValid(nameLast, maxLength)) throw HTTPError(400, 'length of nameLast is not between 1 and 50 characters inclusive');

  const dataStore = getData();
  const index: number = checkIndexOfAuthUserId(authUserId);
  dataStore.users[index].nameFirst = nameFirst;
  dataStore.users[index].nameLast = nameLast;
  setData(dataStore);

  return {};
};

/**
 * userProfileSetEmailV1 - Shakira Li
 *
 * Update the authorised user's email address
 *
 * @param {
 *    token<> (string)
 *    email<> (string)
 * }
 *
 * @return {}
 */
const userProfileSetEmailV2 = (authUserId: number, email: string): object => {
  if (!validator.isEmail(email)) throw HTTPError(400, 'email entered is not a valid email');
  if (isUserEmailActive(email) && !isRemovedUserEmail(email)) throw HTTPError(400, 'email address is already being used by another user');

  const dataStore = getData();
  const index: number = checkIndexOfAuthUserId(authUserId);
  dataStore.users[index].email = email;
  setData(dataStore);

  return {};
};

/**
 * userProfileSetHandleV1 - Shakira Li
 *
 * Update the authorised user's handle (i.e. display name)
 *
 * @param {
 *    token<> (string)
 *    handleStr<> (string)
 * }
 *
 * @return {}
 */
const userProfileSetHandleV2 = (authUserId: number, handleStr: string): object => {
  const minLength = 2;
  const maxLength = 20;
  if (isNameLengthValid(handleStr, minLength)) throw HTTPError(400, 'length of handleStr is not between 3 and 20 characters inclusive');
  if (!isNameLengthValid(handleStr, maxLength)) throw HTTPError(400, 'length of handleStr is not between 3 and 20 characters inclusive');
  if (!isAlphaNumeric(handleStr)) throw HTTPError(400, 'handleStr contains characters that are not alphanumeric');
  if (isUserHandleActive(handleStr) && !isRemovedUserHandle(handleStr)) throw HTTPError(400, 'the handle is already used by another user');

  const dataStore = getData();
  const index: number = checkIndexOfAuthUserId(authUserId);
  dataStore.users[index].handler = handleStr;
  setData(dataStore);

  return {};
};

/**
 * Adds channel to UserStats
 *
 * @param {number} authUserId
 * @param {number} channelId
 */
export const userJoinedChannel = (authUserId: number, channelId: number): void => {
  const data = getData();
  const timeStamp = timeSentCalculation();
  const userPosition = checkIndexOfAuthUserId(authUserId);
  const userStats = data.users[userPosition].userStats.channelsJoined;
  const newChannelObject = { numChannelsJoined: (userStats[userStats.length - 1].numChannelsJoined + 1), timeStamp: timeStamp };
  data.users[userPosition].userStats.channelsJoined.push(newChannelObject);
  setData(data);
};

/**
 * Remove channel to UserStats
 *
 * @param {number} authUserId
 * @param {number} channelId
 */
export const userLeftChannel = (authUserId: number, channelId: number): void => {
  const data = getData();
  const timeStamp = timeSentCalculation();
  const userPosition = checkIndexOfAuthUserId(authUserId);
  const userStats = data.users[userPosition].userStats.channelsJoined;
  const newChannelObject = { numChannelsJoined: (userStats[userStats.length - 1].numChannelsJoined - 1), timeStamp: timeStamp };
  data.users[userPosition].userStats.channelsJoined.push(newChannelObject);

  setData(data);
};

/**
 * Adds dms to UserStats
 *
 * @param {number} authUserId
 * @param {number} dmId
 */
export const userJoinedDms = (authUserId: number, dmId: number): void => {
  const data = getData();
  const timeStamp = timeSentCalculation();
  const userPosition = checkIndexOfAuthUserId(authUserId);
  const userStats = data.users[userPosition].userStats.dmsJoined;
  const newDmObject = { numDmsJoined: (userStats[userStats.length - 1].numDmsJoined + 1), timeStamp: timeStamp };
  data.users[userPosition].userStats.dmsJoined.push(newDmObject);

  setData(data);
};

/**
 * Remove dm to UserStats
 *
 * @param {number} authUserId
 * @param {number} dmId
 */
export const userLeftDms = (authUserId: number, dmId: number): void => {
  const data = getData();
  const timeStamp = timeSentCalculation();
  const userPosition = checkIndexOfAuthUserId(authUserId);
  const userStats = data.users[userPosition].userStats.dmsJoined;
  const newDmObject = { numDmsJoined: (userStats[userStats.length - 1].numDmsJoined - 1), timeStamp: timeStamp };
  data.users[userPosition].userStats.dmsJoined.push(newDmObject);
  setData(data);
};

/**
 * Adds messages to UserStats
 *
 * @param {number} authUserId
 * @param {number} messageId
 */
export const userSentMessage = (authUserId: number, messageId: number): void => {
  const data = getData();
  const timeStamp = timeSentCalculation();
  const userPosition = checkIndexOfAuthUserId(authUserId);
  const userStats = data.users[userPosition].userStats.messagesSent;
  const newMessageObject = { numMessagesSent: (userStats[userStats.length - 1].numMessagesSent + 1), timeStamp: timeStamp };
  data.users[userPosition].userStats.messagesSent.push(newMessageObject);
  setData(data);
};

/**
 * Adds messages to workSpace
 *
 * @param {number} messageId
 */
export const workSpaceSentMessage = (messageId: number): void => {
  const data = getData();
  const timeStamp = timeSentCalculation();
  const workStats = data.workSpaceStats.messagesExist;
  const newMessageObject = { numMessagesExist: (workStats[workStats.length - 1].numMessagesExist + 1), timeStamp: timeStamp };
  data.workSpaceStats.messagesExist.push(newMessageObject);
  setData(data);
};

/**
 * Removed messages to workSpace
 *
 * @param {number} messageId
 */
export const workSpaceRemovedMessage = (messageId: number): void => {
  const data = getData();
  const timeStamp = timeSentCalculation();
  const workStats = data.workSpaceStats.messagesExist;
  const newMessageObject = { numMessagesExist: (workStats[workStats.length - 1].numMessagesExist - 1), timeStamp: timeStamp };
  data.workSpaceStats.messagesExist.push(newMessageObject);
  setData(data);
};

/**
 * Adds channel to workSpace
 *
 * @param {number} channelId
 */
export const workSpaceCreateChannel = (channelId: number): void => {
  const data = getData();
  const timeStamp = timeSentCalculation();
  const workStats = data.workSpaceStats.channelsExist;
  const newChannelObject = { numChannelsExist: (workStats[workStats.length - 1].numChannelsExist + 1), timeStamp: timeStamp };
  data.workSpaceStats.channelsExist.push(newChannelObject);
  setData(data);
};

/**
 * Adds messages to workSpace
 *
 * @param {number} dmId
 */
export const workSpaceCreatedDm = (dmId: number): void => {
  const data = getData();
  const timeStamp = timeSentCalculation();
  const workStats = data.workSpaceStats.dmsExist;
  const newDmObject = { numDmsExist: (workStats[workStats.length - 1].numDmsExist + 1), timeStamp: timeStamp };
  data.workSpaceStats.dmsExist.push(newDmObject);
  setData(data);
};

/**
 * Removed messages to workSpace
 *
 * @param {number} dmId
 */
export const workSpaceRemovedDm = (dmId: number): void => {
  const data = getData();
  const timeStamp = timeSentCalculation();
  const workStats = data.workSpaceStats.dmsExist;
  const newDmObject = { numDmsExist: (workStats[workStats.length - 1].numDmsExist - 1), timeStamp: timeStamp };
  data.workSpaceStats.dmsExist.push(newDmObject);
  setData(data);
};

/**
 * Calculates involvementRate UserStats
 *
 * @param {number} authUserId
 * @returns {number}
 */
export const userInvolvementRate = (authUserId: number): number => {
  const data = getData();
  const userPosition = checkIndexOfAuthUserId(authUserId);
  const totalChannels = data.channels.length;
  const totaldms = data.dms.length;
  const totalMessages = data.totalMessages;
  const totalActions = totalChannels + totaldms + totalMessages;
  if (totalActions === 0) return 0;
  const userStats = data.users[userPosition].userStats;
  const userRateChannel = userStats.channelsJoined[userStats.channelsJoined.length - 1].numChannelsJoined;
  const userRateDm = userStats.dmsJoined[userStats.dmsJoined.length - 1].numDmsJoined;
  const userRateMessages = userStats.messagesSent[userStats.messagesSent.length - 1].numMessagesSent;
  const totalUserActions = userRateChannel + userRateDm + userRateMessages;
  const involvement = Math.max(totalUserActions / totalActions);
  return (involvement);
};

/**
 * Calculates utilizationRate UserStats
 *  Figure out if there is a user still in a channel or Dm
 * @returns {number}
 */
export const workSpaceUtilizationRate = (): number => {
  const data = getData();
  let activeUsers = 0;
  for (const user of data.users) {
    if (user.enrolledChannels[0] !== undefined) {
      activeUsers = activeUsers + 1;
    } else if (user.enrolledDms[0] !== undefined) {
      activeUsers = activeUsers + 1;
    }
  }
  const totalUsers = data.users.length;
  return (activeUsers / totalUsers);
};

/**
 * Get UserStats
 *
 * @param {number} authUserId
 * @returns {userStats}
 */
export const getUserStats = (authUserId: number): any => {
  const data = getData();
  const userPosition = checkIndexOfAuthUserId(authUserId);
  const userStats = data.users[userPosition].userStats;
  userStats.involvementRate = userInvolvementRate(authUserId);
  return { userStats: userStats };
};

/**
 * Get workspaceStats
 *
 * @param {}
 * @returns {userStats}
 */
export const getWorkspaceStats = (): any => {
  const data = getData();
  const workspaceStats = data.workSpaceStats;
  workspaceStats.utilizationRate = workSpaceUtilizationRate();
  return { workspaceStats: workspaceStats };
};

/**
 * uploads profile picture to user's profile
 * allows user to crop image
 *
 * @param {string} imgUrl
 * @param {number} xStart
 * @param {number} yStart
 * @param {number} xEnd
 * @param {number}yEnd
 *
 * @returns {}
 */
// ADDED:
// Get the photo from the requested location
function userProfileUploadPhoto(authUserId: number, imgUrl: string, xStart: number, yStart: number, xEnd: number, yEnd: number) {
  if (xStart >= xEnd) throw HTTPError(400, 'xEnd is less than or equal to xStart');
  if (yStart >= yEnd) throw HTTPError(400, 'yEnd is less than or equal to yStart');
  if (imgUrl.substr(-4) !== '.jpg') throw HTTPError(400, 'image uploaded is not a JPG');
  if (xStart < 0) throw HTTPError(400, 'any of xStart, yStart, xEnd, yEnd are not within the dimensions of the image at the URL');
  if (yStart < 0) throw HTTPError(400, 'any of xStart, yStart, xEnd, yEnd are not within the dimensions of the image at the URL');
  // BRAINSTORM FOR ERROR: authUserId as input
  const res = request(
    'GET', imgUrl
  );
  // Currently doesn't work for some reason
  // if (res.statusCode !== 200) throw HTTPError(400, 'imgUrl returns an HTTP status other than 200, or any other errors occur when attempting to retrieve the image');
  const body = res.getBody();

  const imagePath = 'src/profiles/' + String(authUserId) + '.jpg';
  const croppedImagePath = 'src/profiles/' + String(authUserId) + 'cropped.jpg';
  fs.writeFileSync(imagePath, body, { flag: 'w' });

  // CROPPING IMAGE STARTS BELOW
  const sharp = require('sharp');

  const width = xEnd - xStart;
  const height = yEnd - yStart;

  const image = sharp(imagePath);
  const metadata = image.metadata();
  // Should show us the information we want Currently the below tests do nothing
  // console.log(`${JSON.stringify(metadata)}`);
  if (metadata.width < xEnd) throw HTTPError(400, 'any of xStart, yStart, xEnd, yEnd are not within the dimensions of the image at the URL');
  if (metadata.height < yEnd) throw HTTPError(400, 'any of xStart, yStart, xEnd, yEnd are not within the dimensions of the image at the URL');
  sharp(imagePath).extract({ width: width, height: height, left: xStart, top: yStart }).toFile(croppedImagePath);

  const dataStore = getData();
  const index = checkIndexOfAuthUserId(authUserId);
  dataStore.users[index].profileImgUrl = `${config.url}:${config.port}/profiles/${String(authUserId)}cropped.jpg`;
  setData(dataStore);
  saveData();
  return {};
}
/* Function that was supposed to capture errors for the system
async function imageMetadata(authUserId:number, endUrl: string, imageUrl: string, xEnd:number, yEnd:number) {
  const sharp = require("sharp");
  const metadata = await sharp(imageUrl).metadata();
 // console.log(`EndTime: ${timeSentCalculation()}`);
 // console.log(metadata);
  // Need to adjust to catch and throw the erro, currently just not storing into the database
  if (metadata.width < xEnd) return; //throw HTTPError(400, 'any of xStart, yStart, xEnd, yEnd are not within the dimensions of the image at the URL');
  if (metadata.height < yEnd) return; //throw HTTPError(400, 'any of xStart, yStart, xEnd, yEnd are not within the dimensions of the image at the URL');

  const dataStore = getData();
  const index = checkIndexOfAuthUserId(authUserId);
  dataStore.users[index].profileImgUrl = endUrl;
  setData(dataStore);
  saveData();
}
*/
/// ///////////////////
// Helper Functions //
/// ///////////////////
/**
 * checks if the string contains only alphanumeric characters
 *
 * @param {string} handleStr
 * @returns {boolean}
 */
function isAlphaNumeric(handleStr: string): boolean {
  return /^[A-Za-z0-9]*$/.test(handleStr);
}

/**
 * Finds the index of the user that owns the email
 *
 * @param {string} handleStr
 * @returns {boolean}
 */
function checkIndexofEmail(email:string): number {
  const dataStore = getData();
  const userLength = dataStore.users.length;
  for (let index = 0; index < userLength; index++) {
    if (email === dataStore.users[index].email) {
      return index;
    }
  }
}

/**
 * Checks if the email is of a removed user's
 *
 * @param {string} handleStr
 * @returns {boolean}
 */
export function isRemovedUserEmail(email: string): boolean {
  const dataStore = getData();
  const index = checkIndexofEmail(email);
  if (dataStore.users[index].nameFirst === 'Removed' && dataStore.users[index].nameLast === 'user') return true;

  // Email is not of a removed user
  return false;
}

/**
 * Finds the index of the user that owns the handleStr
 *
 * @param {string} handleStr
 * @returns {boolean}
 */
function checkIndexOfHandle(handleStr: string): number {
  const dataStore = getData();
  const userLength = dataStore.users.length;
  for (let index = 0; index < userLength; index++) {
    if (handleStr === dataStore.users[index].handler) {
      return index;
    }
  }
}

/**
 * Checks if the handleStr is of a removed user's
 *
 * @param {string} handleStr
 * @returns {boolean}
 */
function isRemovedUserHandle(handleStr: string): boolean {
  const dataStore = getData();
  const index = checkIndexOfHandle(handleStr);
  if (dataStore.users[index].nameFirst === 'Removed' && dataStore.users[index].nameLast === 'user') return true;

  // Handle is not of a removed user
  return false;
}

export {
  userProfileV1,
  usersAllV1,
  userProfileSetNameV2,
  userProfileSetEmailV2,
  userProfileSetHandleV2,
  userProfileUploadPhoto
};
