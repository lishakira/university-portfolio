import { getData, setData } from './dataStore';
import {
  isNameValid,
  isNameLengthValid,
  isMessageIdActive,
  getMessageChannelPosition,
  isChannelIdActive,
  checkIndexOfChannelId,
  timeSentCalculation,
  isDmIdActive,
  isAuthUserInDmIdActive,
  checkIndexOfAuthUserId,
  checkIndexOfDmId,
  isAuthUserInChannel,
  isAuthUserMessageSender,
  getMessageDmPosition,
  isMessageBeingSentInThePast,
  tagging,
} from './other';
import HTTPError from 'http-errors';
import { notificationReact } from './notifications';

import { userSentMessage, workSpaceRemovedMessage, workSpaceSentMessage } from './users';
import { saveData } from './serverAssistant';

export interface messageSendObject {
  messageId: number;
}
export interface messageRemoveObject {
  error?: string;
}

interface messageObject {
  messageId: number,
  uId: number,
  message: string,
  timeSent: number,
  reacts: any[],
  isPinned: boolean,
}
/**
 * message/setupcheck Channel and MessageId - James Humphries
 * Check basic information and throw an error if anything fails
 * @param {
 *     channelId<>  (number)
 *     message<>  (string)
 * }
 *
 * @returns {
 * }
 */
const messageSetUpCheckChannel = (channelId: number, message: string): void => {
  // error checking:
  if (!isChannelIdActive(channelId)) throw HTTPError(400, 'channelId does not refer to a valid channel => message');
  if (!isNameValid(message) || !isNameLengthValid(message, 1000)) throw HTTPError(400, 'length of message is less than 1 or over 1000 characters => message');
};

const messageSetUpCheckMessage = (messageId: number, message: string): void => {
  // error checking:
  if (!isMessageIdActive(messageId)) throw HTTPError(400, 'messageId does not refer to a valid message within a channel/DM that the authorised user has joined => message');
  if (!isNameValid(message) || !isNameLengthValid(message, 1000)) throw HTTPError(400, 'length of message is less than 1 or over 1000 characters => message');
};

/**
 * message/send/v1 - James Humphries
 * Send a message from the authorised user to the channel specified by channelId.
 * Note: Each message should have its own unique ID,
 * i.e. no messages should share an ID with another message, even if that other message is in a different channel.
 * @param {
 *     authUserId<> (number)
 *     channelId<>  (number)
 *     message<>  (string)
 *     isStandUp<>  (boolean)
 *     isMessageDelayed<>  (boolean)
 * }
 *
 * @returns {
 *     messageId
 * }
 *
 */
export const messageSendV2 = (authUserId: number, channelId: number, message: string, isStandUp: boolean, isMessageDelayed: boolean, oldMessageId: number):messageSendObject => {
  // error checking:
  if (!isStandUp) {
    // Standup message does not have the message limit requirement and channelId is checked before sending a message
    messageSetUpCheckChannel(channelId, message);
  }

  // Check if the user is a part of the channel
  if (!isAuthUserInChannel(authUserId, channelId)) throw HTTPError(403, 'channelId is valid and the authorised user is not a member of the channel => message');

  // Create new message Id
  let messageId = createUniqueMessageId();

  const dataStore = getData();
  // Check if the message was sent from the past, therefore a new Id number is not needed
  if (isMessageDelayed) {
    messageId = oldMessageId;
    dataStore.delayedMessages = arrayRemove(dataStore.delayedMessages, oldMessageId);
  }

  const messageObject = createMessage(authUserId, messageId, message);
  const channelPosition = checkIndexOfChannelId(channelId);
  dataStore.channels[channelPosition].messages.unshift(messageObject);

  // ------------------ TAGGING ------------------//
  tagging(authUserId, channelId, -1, message, messageId);
  // ---------------------------------------------//

  setData(dataStore);
  updateMessageTally(authUserId, messageId);
  return { messageId: messageId };
};

// Remove element from the array
function arrayRemove(arr: any[], value: number) {
  return arr.filter(function(ele) {
    return ele !== value;
  });
}

/**
 * Create a message
 * @param {
 *     authUserId<> (number)
 *     messageId<>  (number)
 *     message<>  (string)
 * }
 *
 * @returns {messageObject}
 *
 */
const createMessage = (authUserId: number, messageId: number, message: string): messageObject => {
  const timeSent = timeSentCalculation();
  const messageObject = {
    messageId: messageId,
    uId: authUserId,
    message: message,
    timeSent: timeSent,
    reacts: [],
    isPinned: false,
  };
  return messageObject;
};

/**
 * update the message tally
 * @param {
 *     authUserId<> (number)
 *     messageId<>  (number)
 *     message<>  (string)
 * }
 *
 * @returns
 *
 */
const updateMessageTally = (authUserId: number, messageId: number): void => {
  const dataStore = getData();
  dataStore.totalMessages = dataStore.totalMessages + 1;

  setData(dataStore);
  workSpaceSentMessage(messageId);
  userSentMessage(authUserId, messageId);
  saveData();
};

/**
 * create unique messageId
 * @param {
 *     authUserId<> (number)
 *     messageId<>  (number)
 *     message<>  (string)
 * }
 *
 * @returns
 *
 */
const createUniqueMessageId = (): number => {
  // Create new message Id
  let messageId = 1;
  // Loop through till user Id is unique
  while (isMessageIdActive(messageId)) {
    messageId++;
  }
  return messageId;
};

/**
 * message/edit/v1 - James Humphries
 * Given a message, update its text with new text.
 * If the new message is an empty string, the message is deleted.
 * @param {
 *     authUserId<> (number)
 *     messageId<>  (number)
 *     message<>  (string)
 * }
 *
 * @returns {}
 *
 */
export const messageEditV2 = (authUserId: number, messageId: number, message: string):messageRemoveObject => {
  if (message.length === 0) {
    // Run the delete message command
    messageRemoveV2(authUserId, messageId);
    return {};
  }
  // error checking:
  messageSetUpCheckMessage(messageId, message);

  // Check if the user is autherised to edit the message
  if (!isAuthUserMessageSender(authUserId, messageId)) throw HTTPError(403, 'authorised user does not have owner permissions, and the message was not sent by them => message');

  const messageFunctionObject = getMessageChannelPosition(messageId);
  const messagePosition = messageFunctionObject.messagePosition;
  const channelPosition = messageFunctionObject.channelPosition;
  const dmPosition = messageFunctionObject.dmPosition;
  let channelId = -1;
  let dmId = -1;
  const dataStore = getData();
  if (messageFunctionObject.channelPosition === -1) {
    // Message is in a dm
    dataStore.dms[dmPosition].messages[messagePosition].message = message;
    dmId = dataStore.dms[dmPosition].dmId;
  } else {
    // Message is in a channel
    dataStore.channels[channelPosition].messages[messagePosition].message = message;
    channelId = dataStore.channels[channelPosition].id;
  }

  // Check if the user is autherised to edit the message
  if (!isAuthUserMessageSender(authUserId, messageId)) throw HTTPError(403, 'authorised user does not have owner permissions, and the message was not sent by them => message');

  // ------------------ TAGGING ------------------//
  tagging(authUserId, channelId, dmId, message, messageId);
  // ---------------------------------------------//

  setData(dataStore);
  return {};
};

/**
 * message/edit/v1 - James Humphries
 * Given a message, update its text with new text.
 * If the new message is an empty string, the message is deleted.
 * @param {
 *     authUserId<> (number)
 *     messageId<>  (number)
 *     message<>  (string)
 * }
 *
 * @returns {}
 *
 */
export const messageRemoveV2 = (authUserId: number, messageId: number):void => {
  // error checking:
  messageSetUpCheckMessage(messageId, 'empty');

  const messageFunctionObject = getMessageChannelPosition(messageId);
  const messagePosition = messageFunctionObject.messagePosition;
  const dmPosition = messageFunctionObject.dmPosition;
  const channelPosition = messageFunctionObject.channelPosition;
  const dataStore = getData();
  // Check if the user is autherised to edit the message
  if (!isAuthUserMessageSender(authUserId, messageId)) throw HTTPError(403, 'authorised user does not have owner permissions, and the message was not sent by them => message');

  if (messageFunctionObject.channelPosition === -1) {
    // Message is in a dm
    dataStore.dms[dmPosition].messages.splice(messagePosition, 1);
  } else {
    // Message is in a channel
    dataStore.channels[channelPosition].messages.splice(messagePosition, 1);
  }

  setData(dataStore);
  workSpaceRemovedMessage(messageId);
};

/**
 * message/senddm/v1 - James Humphries
 * Send a message from authorisedUser to the DM specified by dmId.
 * Note: Each message should have it's own unique ID,
 * i.e. no messages should share an ID with another message,
 * even if that other message is in a different channel or DM.
 * @param {
 *     authUserId<> (number)
 *     dmId<>  (number)
 *     message<>  (string)
 *     isMessageDelayed<>  (boolean)
 *     oldMessageId<>  (number)
 * }
 *
 * @returns {}
 * Return object {error: 'error'} when any of:
 * dmId does not refer to a valid DM
 * length of message is less than 1 or over 1000 characters
 * dmId is valid and the authorised user is not a member of the DM
 */
export const messagesenddmV2 = (authUserId: number, dmId: number, message: string, isMessageDelayed: boolean, oldMessageId: number):messageSendObject => {
  // error checking:

  if (!isNameValid(message) || !isNameLengthValid(message, 1000)) throw HTTPError(400, 'length of message is less than 1 or over 1000 characters => message');

  // Check if authUserId is an authorised user
  if (!isDmIdActive(dmId)) throw HTTPError(400, 'dmId does not refer to a valid DM => message');
  if (!isAuthUserInDmIdActive(authUserId, dmId)) throw HTTPError(403, 'dmId is valid and the authorised user is not a member of the DM => message');
  // Create new message Id
  let messageId = createUniqueMessageId();
  const dataStore = getData();
  // Check if the message was sent from the past, therefore a new Id number is not needed
  if (isMessageDelayed) {
    messageId = oldMessageId;
    dataStore.delayedMessages = arrayRemove(dataStore.delayedMessages, oldMessageId);
  }
  const messageObject = createMessage(authUserId, messageId, message);

  // check dm position
  const dmPosition = checkIndexOfDmId(dmId);
  dataStore.dms[dmPosition].messages.unshift(messageObject);

  // ------------------ TAGGING ------------------//
  tagging(authUserId, -1, dmId, message, messageId);
  // ---------------------------------------------//

  setData(dataStore);
  updateMessageTally(authUserId, messageId);
  return { messageId: messageId };
};

/**
 * message/pin/v1 - James Humphries
 * message/unpin/v1 - James Humphries
 * @param {
 *     authUserId<> (number)
 *     messageId<>  (number)
 *     newPinStatus<>  (boolean)
 * }
 *
 * @returns {}
 */
export const messagePinStatusV1 = (authUserId: number, messageId: number, newPinStatus: boolean):void => {
  // error checking:
  if (!isMessageIdActive(messageId)) throw HTTPError(400, 'messageId does not refer to a valid message within a channel/DM that the authorised user has joined => message');

  // Make the message become pinned or unpinned (searches channel then dm)
  toggleMessagePinnedChannel(authUserId, messageId, newPinStatus);
};

/**
 * Toggle the current dm message
 * Since it wasn't in channels it must be here
 * @param {
 *     authUserId<> (number)
 *     messageId<>  (number)
 *     newPinStatus<>  (boolean)
 * }
 *
 * @returns
 * Throw an error if user is not autherised or if already pinned

 */
const toggleMessagePinnedDm = (authUserId: number, messageId: number, newPinStatus: boolean): void => {
  const dataStore = getData();
  const messageFunctionObject = getMessageDmPosition(messageId);
  // Is the user in the channel / DM?
  if (!dataStore.dms[messageFunctionObject.dmPosition].memberIds.includes(authUserId)) {
    throw HTTPError(403, 'messageId refers to a valid message in a joined channel/DM and the authorised user does not have owner permissions in the channel/DM => message');
  }
  // Is it already pinned?
  if (messageFunctionObject.message.isPinned === newPinStatus) throw HTTPError(400, 'the message is already pinned or unpinned => message');

  // Pin message
  dataStore.dms[messageFunctionObject.dmPosition].messages[messageFunctionObject.messagePosition].isPinned = newPinStatus;
  setData(dataStore);
};

/**
 * Toggle the current channel message
 * @param {
 *     authUserId<> (number)
 *     messageId<>  (number)
 *     newPinStatus<>  (boolean)
 * }
 *
 * @returns
 * Throw an error if user is not autherised or if already pinned

 */
const toggleMessagePinnedChannel = (authUserId: number, messageId: number, newPinStatus: boolean): void => {
  const dataStore = getData();
  const messageFunctionObject = getMessageChannelPosition(messageId);
  if (messageFunctionObject.channelPosition === -1) {
    toggleMessagePinnedDm(authUserId, messageId, newPinStatus);
  } else {
    // Is the user in the channel / DM?
    if (!dataStore.channels[messageFunctionObject.channelPosition].allMembers.includes(authUserId)) {
      throw HTTPError(403, 'messageId refers to a valid message in a joined channel/DM and the authorised user does not have owner permissions in the channel/DM => message');
    }
    // Is it already pinned?
    if (messageFunctionObject.message.isPinned === newPinStatus) throw HTTPError(400, 'the message is already pinned or unpinned => message');

    // Pin message
    dataStore.channels[messageFunctionObject.channelPosition].messages[messageFunctionObject.messagePosition].isPinned = newPinStatus;
    setData(dataStore);
  }
};

/**
 * Send the message some time in the future
 * @param {
 *     authUserId<> (number)
 *     channelId<>  (number)
 *     message<>  (string)
 *     newPinStatus<>  (boolean)
 * }
 *
 * @returns {messageId}
 * Throw an error if user is not autherised or if already pinned

 */
export const messageSendLaterV1 = (authUserId: number, channelId: number, message: string, timeSent: number): number => {
  // Error checking
  // Check if the user is a part of the channel
  if (!isAuthUserInChannel(authUserId, channelId)) throw HTTPError(403, 'channelId is valid and the authorised user is not a member of the channel they are trying to post to => message');
  // Check initial conditions for channelId and length
  messageSetUpCheckChannel(channelId, message);
  // Check if message is being sent from the past
  const currentTime = timeSentCalculation();
  isMessageBeingSentInThePast(timeSent);
  // Convert back to seconds
  const duration = (timeSent - currentTime);
  // Create a fake new message Id
  const messageId = createUniqueMessageId();
  const data = getData();
  data.delayedMessages.push(messageId);

  // ------------------ TAGGING ------------------//
  tagging(authUserId, channelId, -1, message, messageId);
  // ---------------------------------------------//

  setData(data);

  // ------------------ TAGGING ------------------//
  tagging(authUserId, channelId, -1, message, messageId);
  // ---------------------------------------------//

  // Set time out command and then update the messageId with the given command
  setTimeout(messageSendV2, duration * 1000, authUserId, channelId, message, false, true, messageId);
  return messageId;
};

/**
 * Send the message some time in the future
 * @param {
 *     authUserId<> (number)
 *     channelId<>  (number)
 *     message<>  (string)
 *     newPinStatus<>  (boolean)
 * }
 *
 * @returns {messageId}

 * Throw an error if user is not autherised or if already pinned

 */
export const messageSendLaterDmV1 = (authUserId: number, dmId: number, message: string, timeSent: number): number => {
  // Error checking
  if (!isNameValid(message) || !isNameLengthValid(message, 1000)) throw HTTPError(400, 'length of message is less than 1 or over 1000 characters => message');

  // Check if authUserId is an authorised user
  if (!isDmIdActive(dmId)) throw HTTPError(400, 'dmId does not refer to a valid DM => message');
  if (!isAuthUserInDmIdActive(authUserId, dmId)) throw HTTPError(403, 'dmId is valid and the authorised user is not a member of the DM => message');

  // Check if message is being sent from the past
  isMessageBeingSentInThePast(timeSent);

  const currentTime = timeSentCalculation();
  // Convert back to seconds
  const duration = (timeSent - currentTime);

  // Create a fake new message Id
  const messageId = createUniqueMessageId();
  const data = getData();
  data.delayedMessages.push(messageId);

  // ------------------ TAGGING ------------------//
  tagging(authUserId, -1, dmId, message, messageId);
  // ---------------------------------------------//

  setData(data);

  // ------------------ TAGGING ------------------//
  tagging(authUserId, -1, dmId, message, messageId);
  // ---------------------------------------------//
  // Call the function later with the knowledge that it is an old messageId number
  setTimeout(messagesenddmV2, duration * 1000, authUserId, dmId, message, true, messageId);
  return messageId;
};

export function messageReactV1(authUserId: number, messageId: number, reactId: number) {
  const dataStore = getData();
  const messageChannel = getMessageChannelPosition(messageId);
  const messageDm = getMessageDmPosition(messageId);
  // check for errors.
  if (!isMessageIdActive(messageId)) throw HTTPError(400, 'message id invalid');
  if (reactId !== 1) throw HTTPError(400, 'invalid react Id');
  if (isThisUserReacted(authUserId, messageId)) throw HTTPError(400, 'user already reacted');

  if (messageChannel.channelPosition !== -1) {
    if (dataStore.channels[messageChannel.channelPosition].messages[messageChannel.messagePosition].reacts.length === 0) {
      addreaction(messageId, reactId);
    }
    for (const reactions of dataStore.channels[messageChannel.channelPosition].messages[messageChannel.messagePosition].reacts) {
      if (reactions.reactId === reactId) {
        reactions.uIds.push(authUserId);
        reactions.isThisUserReacted = isThisUserReacted(authUserId, messageId);
        notificationReact(authUserId, dataStore.channels[messageChannel.channelPosition].id, -1, messageChannel.message.uId);
      }
    }
  } else if (messageDm.channelPosition !== -1) {
    if (dataStore.dms[messageDm.dmPosition].messages[messageDm.messagePosition].reacts.length === 0) {
      addreaction(messageId, reactId);
    }
    for (const reactions of dataStore.dms[messageDm.dmPosition].messages[messageDm.messagePosition].reacts) {
      if (reactions.reactId === reactId) {
        reactions.uIds.push(authUserId);
        reactions.isThisUserReacted = isThisUserReacted(authUserId, messageId);
        notificationReact(authUserId, -1, dataStore.dms[messageDm.dmPosition].dmId, dataStore.dms[messageDm.dmPosition].messages[messageDm.messagePosition].uId);
      }
    }
  }
  setData(dataStore);
  return {};
}

export function addreaction(messageId: number, reactId: number) {
  const dataStore = getData();
  const messageChannel = getMessageChannelPosition(messageId);
  const messageDm = getMessageDmPosition(messageId);
  const newReact = {
    reactId: reactId,
    uIds: [],
    isAuthUserInChannel: false,
  };
  if (messageChannel.channelPosition !== -1) {
    dataStore.channels[messageChannel.channelPosition].messages[messageChannel.messagePosition].reacts.push(newReact);
  } else if (messageDm.dmPosition !== -1) {
    dataStore.dms[messageDm.dmPosition].messages[messageDm.messagePosition].reacts.push(newReact);
  }
}

export const isThisUserReacted = (authUserId: number, messageId: number): boolean => {
  const dataStore = getData();
  const messagechannelpos = getMessageChannelPosition(messageId);
  const dmchannelpos = getMessageDmPosition(messageId);
  if (messagechannelpos.channelPosition !== -1) {
    if (dataStore.channels[messagechannelpos.channelPosition].messages[messagechannelpos.messagePosition].reacts.length < 1) return false;
    if (dataStore.channels[messagechannelpos.channelPosition].messages[messagechannelpos.messagePosition].reacts[0].uIds.includes(authUserId)) return true;
  } else if (dmchannelpos.dmPosition !== -1) {
    if (dataStore.dms[dmchannelpos.dmPosition].messages[dmchannelpos.messagePosition].reacts.length < 1) return false;
    if (dataStore.dms[dmchannelpos.dmPosition].messages[dmchannelpos.messagePosition].reacts[0].uIds.includes(authUserId)) return true;
  }
  // if this is true check the position.uids for the auth suer id and if it is there return true.
  return false;
};

export function messageUnreactV1(authUserId: number, messageId: number, reactId: number) {
  const dataStore = getData();
  const messageChannel = getMessageChannelPosition(messageId);
  const messageDm = getMessageDmPosition(messageId);
  // check for errors.
  if (!isMessageIdActive(messageId)) throw HTTPError(400, 'message id invalid');
  if (reactId !== 1) throw HTTPError(400, 'invalid react Id');
  if (!isThisUserReacted(authUserId, messageId)) throw HTTPError(400, 'user already reacted');

  if (messageChannel.channelPosition !== -1) {
    for (const reactions of dataStore.channels[messageChannel.channelPosition].messages[messageChannel.messagePosition].reacts) {
      if (reactions.reactId === reactId) {
        reactions.uIds.splice(reactions.uIds.indexOf(authUserId), 1);
        reactions.isThisUserReacted = isThisUserReacted(authUserId, messageId);
      }
    }
  } else if (messageDm.channelPosition !== -1) {
    for (const reactions of dataStore.dms[messageDm.dmPosition].messages[messageDm.messagePosition].reacts) {
      if (reactions.reactId === reactId) {
        reactions.uIds.splice(reactions.uIds.indexOf(authUserId), 1);
        reactions.isThisUserReacted = isThisUserReacted(authUserId, messageId);
      }
    }
  }
  setData(dataStore);
  return {};
}

export function messageShareV1(authUserId: number, ogMessageId: number, message: string, channelId: number, dmId: number) {
  if (!isChannelIdActive(channelId) && !isDmIdActive(dmId)) {
    throw HTTPError(400, 'both channelId and dmId are invalid');
  }
  if (channelId !== -1 && dmId !== -1) {
    throw HTTPError(400, 'neither channelId or dmId are -1');
  }
  if (message.length > 1000) {
    throw HTTPError(400, 'length of message is too long');
  }
  if (!isMessageIdActive(ogMessageId)) {
    throw HTTPError(400, 'messageId is not active!');
  }
  let messageFound = false;
  const dataStore = getData();
  const indexOfUser = checkIndexOfAuthUserId(authUserId);
  const enrolledChannelsOfUser = dataStore.users[indexOfUser].enrolledChannels;
  // console.log(enrolledChannelsOfUser);
  for (const element in enrolledChannelsOfUser) {
    const indexOfChannel = checkIndexOfChannelId(enrolledChannelsOfUser[element]);
    const channel = dataStore.channels[indexOfChannel];
    for (const message in channel.messages) {
      if (ogMessageId === channel.messages[message].messageId) {
        messageFound = true;
      }
    }
  }
  const enrolledDmsOfUser = dataStore.users[indexOfUser].enrolledDms;
  // console.log(enrolledDmsOfUser);
  for (const element in enrolledDmsOfUser) {
    const indexOfDm = checkIndexOfDmId(enrolledDmsOfUser[element]);
    const dm = dataStore.dms[indexOfDm];
    for (const message in dm.messages) {
      if (ogMessageId === dm.messages[message].messageId) {
        messageFound = true;
      }
    }
  }
  if (!messageFound) {
    throw HTTPError(400, 'user has not been enrolled in channel/dm where the message originated from');
  }

  if (channelId !== -1) {
    const indexOfChannel = checkIndexOfChannelId(channelId);
    let isMember = false;
    const channel = dataStore.channels[indexOfChannel];
    for (const member in channel.allMembers) {
      if (authUserId === channel.allMembers[member]) {
        isMember = true;
      }
    }
    if (!isMember) {
      throw HTTPError(403, 'user is not enrolled in target channel/DM');
    }
  } else if (dmId !== -1) {
    const indexOfDm = checkIndexOfDmId(dmId);
    let isMember = false;
    const dm = dataStore.dms[indexOfDm];
    for (const member in dm.memberIds) {
      if (authUserId === dm.memberIds[member]) {
        isMember = true;
      }
    }
    if (!isMember) {
      throw HTTPError(403, 'user is not enrolled in target channel/DM');
    }
  }
  // error testing ends here

  const messageLocation = getMessageChannelPosition(ogMessageId);
  // console.log(messageLocation);

  // getting info regarding ogMessage and creating newMessage
  const ogMessage = messageLocation.message.message;
  // const indexOfMessage = messageLocation.messagePosition;
  // const indexOfChannel = messageLocation.channelPosition;
  // const indexOfDm = messageLocation.dmPosition;
  const newMessage = ogMessage + ' - ' + message;

  // console.log('-------------------------------------');
  // console.log('ogMessage: ' + ogMessage);
  // console.log('indexOfMessage: ' + indexOfMessage);
  // console.log('indexOfChannel: ' + indexOfChannel);
  // console.log('indexOfDm: ' + indexOfDm);
  // console.log('newMessage: ' + newMessage);
  // console.log('-------------------------------------');
  // tagging is done in messageSendV1 and messageSendDmV2 automatically
  // sending the newMessage to the target channel/DM
  // tagging is done in messageSendV1 and messageSendDmV2 automatically
  if (channelId !== -1) {
    const newMessageId = messageSendV2(authUserId, channelId, newMessage, false, false, -1);
    return newMessageId;
  } else if (dmId !== -1) {
    const newMessageId = messagesenddmV2(authUserId, dmId, newMessage, false, -1);
    return newMessageId;
  }
}
