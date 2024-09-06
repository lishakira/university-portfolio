import { getData, setData } from './dataStore';
import HTTPError from 'http-errors';
import { getHashOf, SECRET } from './auth';
import { notificationTagged } from './notifications';

// Interface Types
export interface TokenUser {
  token: string;
  authUserId: number;
}

export interface messagesObject {
  messageId: number;
  uId: number;
  message: string;
  timeSent: number;
  reactId: number;
  isPinned: boolean;
}

export interface MessagePosition {
  dmPosition?: number
  channelPosition?: number;
  messagePosition: number;
  message?: messagesObject;
}

/**
 * clearV1 - James Humphries
 * Remove all data from the data aray
 * @param {
 * }
 *
 * @returns {
 * }
 *
 */
function clearV1(): object {
  const dataStore = getData();
  dataStore.users = [];
  dataStore.channels = [];
  dataStore.tokens = [];
  dataStore.dms = [];
  dataStore.resetCodes = [];
  dataStore.totalMessages = 0;
  dataStore.workSpaceStats = {
    channelsExist: [{ numChannelsExist: 0, timeStamp: timeSentCalculation() }],
    dmsExist: [{ numDmsExist: 0, timeStamp: timeSentCalculation() }],
    messagesExist: [{ numMessagesExist: 0, timeStamp: timeSentCalculation() }],
    utilizationRate: 0,
  };
  dataStore.delayedMessages = [];
  setData(dataStore);
  return {};
}

function searchV1(queryStr: string, authUserId: number) {
  if (queryStr.length < 1) {
    throw HTTPError(400, 'query string cannot be less than 1 character long');
  } else if (queryStr.length > 1000) {
    throw HTTPError(400, 'query string cannot be more than 1000 characters long');
  }
  const dataStore = getData();
  const output = [];
  const indexOfUser = checkIndexOfAuthUserId(authUserId);
  // console.log(dataStore.users[indexOfUser]);

  // search through all enrolled channels
  for (const element in dataStore.users[indexOfUser].enrolledChannels) {
    const indexOfChannel = checkIndexOfChannelId(dataStore.users[indexOfUser].enrolledChannels[element]);
    const channel = dataStore.channels[indexOfChannel];
    // console.log(channel);
    for (const message in channel.messages) {
      // console.log(channel.messages[message]);
      const currentMessage = channel.messages[message].message;
      if (currentMessage.includes(queryStr)) {
        output.push(currentMessage);
      }
    }
  }
  // search through all dm channels
  for (const element in dataStore.users[indexOfUser].enrolledDms) {
    const indexOfDm = checkIndexOfDmId(dataStore.users[indexOfUser].enrolledDms[element]);
    const dm = dataStore.dms[indexOfDm];
    // console.log(dm);
    for (const message in dm.messages) {
      // console.log(dm.messages[message]);
      const currentMessage = dm.messages[message].message;
      if (currentMessage.includes(queryStr)) {
        output.push(currentMessage);
      }
    }
  }
  return output;
}

/**
 * clearV1 - James Humphries
 * Remove all data from the data aray
 * @param {
 * }
 *
 * @returns {
 * }
 *
 */
function clearTokensV1(): boolean {
  const dataStore = getData();
  dataStore.tokens = [];
  setData(dataStore);
  return true;
}

/**
* Check if token is valid
*
* @param {string} token to check
* @returns {Boolean} to indicate if a character.
*/
function isTokenValid(token: string): boolean {
  const dataTokens = getData().tokens;
  const tokenLength = dataTokens.length;
  for (let i = 0; i < tokenLength; i++) {
    if (token === dataTokens[i].token) {
      return true;
    }
  }
  throw HTTPError(403, 'token is invalid  => other');
}

/**
* Check if name is valid by being longer than 0 and not undefined.
*
* @param {string} name to check
* @returns {Boolean} to indicate if a character.
*/

function isNameValid(name: string): boolean {
  // Check size of name
  if (name === undefined) return false;
  if (name.length === 0) {
    return false;
  }
  return true;
}

/**
* Check if name is valid by length
*
* @param {string} password to check
* @param {int} maxLength limitation of the length for testing
* @returns {Boolean} to indicate result of test
*/
function isNameLengthValid(name: string, maxLength: number): boolean {
  // Check if email is valid
  if (name.length > maxLength) {
    return false;
  }
  return true;
}

/**
 * Check if the userId is in dataStore
 *
 * @param {number} userId
 * @returns {boolean}
 */
function isUserIdActive(userId: number): boolean {
  const dataStore = getData();
  const userLength = dataStore.users.length;
  for (let i = 0; i < userLength; i++) {
    if (userId === dataStore.users[i].id) {
      return true;
    }
  }
  // Id is not being used
  return false;
}

/**
 * Check if the user is a global owner in the database
 * Runs after checking if Id is active
 * @param {number} userId
 * @returns {boolean}
 */
function isUserGlobalOwner(userId: number): boolean {
  const dataStore = getData();
  const userPosition = Number(checkIndexOfAuthUserId(userId));
  if (userPosition === -1) return false;
  const userObject = dataStore.users[userPosition];
  if (userObject.globalOwner) return true;
  // User is not a global owner
  return false;
}

/**
 * checkIndexOfAuthUserId
 * Given a authUserId, find its index position in the data store
 * Return -1 if unable to find index position
 * @param {
 *     authUserId<>  (number)
 * }
 *
 * @returns {
 *     indexPosition (number)
 * }
 */
function checkIndexOfAuthUserId(authUserId: number): number {
  const dataStore = getData();
  for (const userPosition in dataStore.users) {
    if (authUserId === dataStore.users[userPosition].id) {
      return Number(userPosition);
    }
  }
}

/**
 * checkIndexOfChannelId
 * Given a authUserId, find its index position in the data store
 * Return -1 if unable to find index position
 * @param {
 *     channelId<>  (number)
 * }
 *
 * @returns {
 *     indexPosition (number)
 * }
 */
function checkIndexOfChannelId(channelId: number): number {
  const dataStore = getData();
  for (const channelPosition in dataStore.channels) {
    if (channelId === dataStore.channels[channelPosition].id) {
      return Number(channelPosition);
    }
  }
  throw HTTPError(400, 'channelId does not exist => other');
}

/**
 * checkIndexOfTokenId
 * Given a token, find its index position in the data store
 * Token is checked earlier
 * @param {
 *     token<>  (number)
 * }
 *
 * @returns {
 *     indexPosition (number)
 * }
 */
function checkIndexOfTokenId(token: string): number {
  const dataStore = getData();
  for (const tokenPosition in dataStore.tokens) {
    if (token === dataStore.tokens[tokenPosition].token) {
      return Number(tokenPosition);
    }
  }
}

/**
 * Gets the index of tokenObject given the authUserId
 *
 * @param {number} authUserId
 * @returns {number} indexOfToken
 */
function findTokenObject(authUserId: number): number {
  const dataStore = getData();
  for (const element in dataStore.tokens) {
    if (authUserId === dataStore.tokens[element].authUserId) {
      return Number(element);
    }
  }
}

/**
 * checkIndexOfDmId
 * Given a authUserId, find its index position in the data store
 * Return -1 if unable to find index position
 * @param {
 *     dmId<>  (number)
 * }
 *
 * @returns {
 *     indexPosition (number)
 * }
 */
function checkIndexOfDmId(dmId: number): number {
  const dataStore = getData();
  for (const dmPosition in dataStore.dms) {
    if (dmId === dataStore.dms[dmPosition].dmId) {
      return Number(dmPosition);
    }
  }
}

/**
 * Check if the channelId is in dataStore. Returns true if Id already exists
 *
 * @param {number} channelId
 * @returns {boolean}
 */
function isChannelIdActive(channelId: number): boolean {
  const dataStore = getData();
  for (const i in dataStore.channels) {
    if (channelId === dataStore.channels[i].id) {
      return true;
    }
  }
  return false;
}

/**
 * Create a unique token as a string and return the result
 *
 * @returns {
 *     unique uuid (string)
 * }
 */

const tokenStringGenerator = (): string => {
  return String(getHashOf(String(Math.floor(Math.random() * 100000) + 1) + SECRET));
};

// Must be unique
// const isTokenUnique = (tokenStr: string) => {
//   const dataStore = getData();
//   if (dataStore.tokens === undefined) return true;
//   for (const token of dataStore.tokens) {
//     if (tokenStr === token.token) {
//       return false;
//     }
//   }
//   return true;
// };

// Given an authUserId, return the token string for a unique number
const tokenString = (authUserId: number) => {
  const token = tokenStringGenerator();
  addTokenUser(token, authUserId);
  return token;
};

// Need the tokens to be valid
// Add the token and its corresponding authUserId
const addTokenUser = (token: string, authUserId: number) => {
  const dataStore = getData();
  dataStore.tokens.push({ token: token, authUserId: authUserId });
};

// Remove the token and its authUserId
// const removeTokenUser = (token: string) => {
//   const dataStore = getData();
//   setData(dataStore.tokens.splice(dataStore.tokens.indexOf(findUserId(token)), 1));
// };

// // Works as intended
// const findUserId = (token: string): TokenUser => {
//   const dataStore = getData();
//   const tokenObject = dataStore.tokens.find(tokenUser => tokenUser.token === token);
//   return tokenObject;
// };

// gets the corresponding authUserId from token
const getUserIdFromToken = (token: string): number => {
  const dataStore = getData();
  for (const i in dataStore.tokens) {
    if (dataStore.tokens[i].token === token) {
      return dataStore.tokens[i].authUserId;
    }
  }
  throw HTTPError(403, 'token does not correspond to a valid authUserId  => other');
};

/**
 * Check if the messageId is in dataStore
 * Need to check each channel
 * @param {number} messageId
 * @returns {boolean}
 */
function isMessageIdActive(messageId: number): boolean {
  const dataStore = getData();
  const dmLength = dataStore.dms.length;
  for (let i = 0; i < dmLength; i++) {
    const messagesArray = dataStore.dms[i].messages;
    if (messagesArray !== undefined) {
      for (const message of messagesArray) {
        if (messageId === message.messageId) {
          return true;
        }
      }
    }
  }
  const channelLength = dataStore.channels.length;
  for (let i = 0; i < channelLength; i++) {
    const messagesArray = dataStore.channels[i].messages;
    if (messagesArray !== undefined) {
      for (const message of messagesArray) {
        if (messageId === message.messageId) {
          return true;
        }
      }
    }
  }
  // Check if this should be sent later
  if (dataStore.delayedMessages.includes(messageId)) {
    return true;
  }
  // Id is not being used
  return false;
}

/**
 * Get channel of the message and its information
 * Assume it has run after checking Id is active
 * @param {number} messageId
 * @returns {boolean}
 */
function getMessageChannelPosition(messageId: number): MessagePosition {
  const dataStore = getData();
  const channelLength = dataStore.channels.length;
  for (let chanPos = 0; chanPos < channelLength; chanPos++) {
    const messagesLength = dataStore.channels[chanPos].messages.length;
    for (let mesPos = 0; mesPos < messagesLength; mesPos++) {
      if (messageId === dataStore.channels[chanPos].messages[mesPos].messageId) {
        return { channelPosition: chanPos, messagePosition: mesPos, dmPosition: -1, message: dataStore.channels[chanPos].messages[mesPos] };
      }
    }
  }
  const dmObject = getMessageDmPosition(messageId);
  return { channelPosition: -1, dmPosition: dmObject.dmPosition, messagePosition: dmObject.messagePosition, message: dmObject.message };
}

/**
 * Get dm of the message and its information
 * Assume it has run after checking Id is active
 * @param {number} messageId
 * @returns {boolean}
 */
function getMessageDmPosition(messageId: number): MessagePosition {
  const dataStore = getData();
  const dmLength = dataStore.dms.length;
  for (let dmPos = 0; dmPos < dmLength; dmPos++) {
    const messagesLength = dataStore.dms[dmPos].messages.length;
    for (let mesPos = 0; mesPos < messagesLength; mesPos++) {
      if (messageId === dataStore.dms[dmPos].messages[mesPos].messageId) {
        return {
          messagePosition: mesPos,
          dmPosition: dmPos,
          message: dataStore.dms[dmPos].messages[mesPos],
        };
      }
    }
  }
  return { dmPosition: -1, messagePosition: -1 };
}

/**
 * Check if the authUserId is in the channel
 * First convert token to authUserId
 * Then check members to see if they are a member
 * @param {number} authUserId
 * @param {number} channelId
 * @returns {boolean}
 */
function isAuthUserInChannel(authUserId: number, channelId: number): boolean {
  const dataStore = getData();
  const channelPosition = checkIndexOfChannelId(channelId);
  const channelObject = dataStore.channels[channelPosition];
  if (channelObject.allMembers.includes(authUserId)) {
    return true;
  }
  // Id is not being used
  return false;
}

/**
 * Check if the authUserId is the person that sent the message
 * If they are the owner of the channel, they can also edit the message
 * If they are in the channel and are a global owner, they can also edit the message
 * @param {number} authUserId
 * @param {number} messageId
 * @returns {boolean}
 */
function isAuthUserMessageSender(authUserId: number, messageId: number): boolean {
  const dataStore = getData();
  let messageFunctionObject = getMessageChannelPosition(messageId);
  if (messageFunctionObject.channelPosition === -1) {
    // Not a channel message
    messageFunctionObject = getMessageDmPosition(messageId);
    if (messageFunctionObject.dmPosition === -1) {
      // No active messages
      return false;
    }
    // Check messageId (uId)
    const dmPosition = messageFunctionObject.dmPosition;
    const messagePosition = messageFunctionObject.messagePosition;

    const dmObject = dataStore.dms[dmPosition];
    const messageObject = dmObject.messages[messagePosition];
    const messageUId = messageObject.uId;

    // Check if they are a the person that sent the message or an owner
    if (messageUId === authUserId || dmObject.ownerUserId.includes(authUserId)) {
      return true;
    }
    // Check if they are a global owner and are part of the channel
    if (dmObject.memberIds.includes(authUserId) && isUserGlobalOwner(authUserId)) {
      return true;
    }
  } else {
    const channelPosition = messageFunctionObject.channelPosition;
    const messagePosition = messageFunctionObject.messagePosition;

    const channelObject = dataStore.channels[channelPosition];
    const messageObject = channelObject.messages[messagePosition];
    const messageUId = messageObject.uId;

    if (messageUId === authUserId || channelObject.ownerMembers.includes(authUserId)) {
      return true;
    }
    // Check if they are a global owner and are part of the channel
    if (channelObject.allMembers.includes(authUserId) && isUserGlobalOwner(authUserId)) {
      return true;
    }

    // Id is not of autherised member
    return false;
  }
}

/**
 * Calculate current timeStamp
 *
 * @param {}
 * @returns {number}
 */
const timeSentCalculation = (): number => {
  return Math.floor(Date.now() / 10) / 100;
};

/**
 * Checks for duplicates in a given array. Returns true if there is none and returns
 * false if duplicates are found.
 *
 * @param {array}
 * @returns {boolean}
 */
const checkDuplicates = (array: any[]): boolean => {
  const length: number = array.length;
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length; j++) {
      if (i === j) {
        continue;
      }
      if (array[i] === array[j]) {
        return false;
      }
    }
  }
  return true;
};

/**
 * Checks the dataStore if there is already a DM with the corresponding dmId or not.
 * Returns true if found, returns false otherwise
 *
 * @param {number} dmId
 * @returns {boolean}
 */
const isDmIdActive = (dmId: number): boolean => {
  const dataStore = getData();
  for (const element in dataStore.dms) {
    if (dmId === dataStore.dms[element].dmId) {
      return true;
    }
  }
  return false;
};

/**
 * Checks the dataStore of there is already a DM with the corresponding dmId or not.
 * Returns true if found, returns false otherwise
 *
 * @param {string} authUserId
 * @param {number} dmId
 * @returns {boolean}
 */
const isAuthUserInDmIdActive = (authUserId: number, dmId: number): boolean => {
  const dataStore = getData();
  const dmPosition = checkIndexOfDmId(dmId);
  if (dmPosition === -1) return false;
  for (const userId of dataStore.dms[dmPosition].memberIds) {
    if (authUserId === userId) return true;
  }
  if (authUserId === dataStore.dms[dmPosition].ownerUserId) return true;
  return false;
};

/**
 * Check if the authUserId is in the channel
 * @param {number} uId
 * @param {number} channelId
 * @returns {boolean}
 */
function isUserIdInChannel(uId: number, channelId: number): boolean {
  const dataStore = getData();
  const channelPosition = checkIndexOfChannelId(channelId);
  const channelObject = dataStore.channels[channelPosition];
  if (channelObject.allMembers.includes(uId)) {
    return true;
  }
  // Id is not being used
  return false;
}

/**
 * Check if the authUserId is in the channel
 * @param {number} uId
 * @param {number} channelId
 * @returns {boolean}
 */
function isUserChannelOwner(uId: number, channelId: number): boolean {
  const dataStore = getData();
  const channelPosition = checkIndexOfChannelId(channelId);
  const channelObject = dataStore.channels[channelPosition];
  if (channelObject.ownerMembers.includes(uId)) {
    return true;
  }
  // Id is not being used
  return false;
}

/**
 * Check if message is meant to be sent in the past
 * @param {number} timeSent
 * @returns
 */
function isMessageBeingSentInThePast(timeSent: number): void {
  const currentTime = timeSentCalculation();
  if (currentTime > timeSent) throw HTTPError(400, 'timeSent is a time in the past => other');
}

function tagging(authUserId: number, channelId: number, dmId: number, message: string, messageId: number) {
  const mssgLength = message.length;
  const taggedUsers: string[] = [];
  let tagging = false;
  let i = 0;
  while (i < mssgLength) {
    if (message[i] === '@') {
      tagging = true;
      let j = i + 1;
      while (j < mssgLength) {
        if (!message[j].match(/^[0-9a-zA-Z]+$/)) {
          break;
        }
        j++;
      }
      const handleStr = message.slice(i + 1, j);
      // console.log(handleStr);
      taggedUsers.push(handleStr);
    }
    i++;
  }
  if (tagging) {
    console.log('\nThis message tags someone!');
    console.log(`Tags: ${taggedUsers}`);
    // return taggedUsers;
    // console.log(taggedUsers);
    for (const element in taggedUsers) {
      const targetUserId = findIdFromHandleStr(taggedUsers[element]);
      // console.log(targetUserId);
      notificationTagged(authUserId, channelId, dmId, messageId, targetUserId);
    }
  }
}

function findIdFromHandleStr(handleStr: string): number {
  const dataStore = getData();
  for (const element in dataStore.users) {
    if (handleStr === dataStore.users[element].handler) {
      return dataStore.users[element].id;
    }
  }
  return -1;
}

export {
  clearV1,
  searchV1,
  clearTokensV1,
  isNameValid,
  isNameLengthValid,
  isUserIdActive,
  isDmIdActive,
  isUserGlobalOwner,
  checkIndexOfAuthUserId,
  checkIndexOfChannelId,
  checkIndexOfTokenId,
  findTokenObject,
  checkIndexOfDmId,
  isChannelIdActive,
  tokenString,
  isTokenValid,
  getUserIdFromToken,
  isMessageIdActive,
  getMessageChannelPosition,
  getMessageDmPosition,
  isAuthUserInChannel,
  timeSentCalculation,
  isAuthUserMessageSender,
  checkDuplicates,
  isAuthUserInDmIdActive,
  isUserIdInChannel,
  isUserChannelOwner,
  isMessageBeingSentInThePast,
  tagging,
  findIdFromHandleStr,
};
