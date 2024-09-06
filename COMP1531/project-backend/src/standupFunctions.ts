import { getData, setData } from './dataStore';
import { isChannelIdActive, isUserIdInChannel } from './other';
import HTTPError from 'http-errors';
import { checkIndexOfChannelId } from './channel';
import { userProfileV1 } from './users';
import { messageSendV2 } from './message';
import { saveData } from './serverAssistant';
interface messageObject {
  authUserId: number;
  message: string;
}

interface standUpObject {
  isActive?: boolean;
  timeFinish?: number;
}
/**
 * standupStart Function - James Humphries
 *  Allows for the sending of messages in a different format to regular messages
 * @param {
 *     authUserId<> (number)
 *     channelId<> (number)
 *     length<>  (number)
 * }
 *
 * @returns {
 *     timeFinish: number
 * }
 */
export const standupStart = (authUserId: number, channelId: number, length: number): standUpObject => {
  if (length < 0) throw HTTPError(400, 'length is a negative integer  => standUp');
  const data = getData();
  const channelPosition = checkIndexOfChannelId(channelId);
  if (!isUserIdInChannel(authUserId, channelId)) throw HTTPError(403, 'channelId is valid and the authorised user is not a member of the channel  => standUp');
  // Check, is there a stand up active?
  if (data.channels[channelPosition].isStandUpActive) throw HTTPError(400, 'an active standup is currently running in the channel  => standUp');

  // If not, delete all previous information, then start new session
  // After length of seconds, call the end of the start up
  const endTime = getEndTime(length);

  data.channels[channelPosition].isStandUpActive = true;
  // Save timeFinish as a string allowing for easy extraction
  data.channels[channelPosition].standup = {
    owner: userProfileV1(authUserId, authUserId).user.handleStr,
    channelId: data.channels[channelPosition].name,
    timeFinish: endTime,
    messages: [],
  };
  setData(data);
  setTimeout(endStartUp, length * 1000, authUserId, channelId);
  return {
    timeFinish: endTime
  };
};

// Calculate the new end time
export const getEndTime = (additionalTime: number): number => {
  const current = new Date();
  return Math.ceil(current.getTime() / 10) / 100 + additionalTime;
};

/**
 * endStartUp Function
 * Set the startUp to be over and call the startUpSend to Update all information as required
 * During this standup period, if someone calls standup/send with a message, it will be buffered
 * during the length-second window. Then, at the end of the standup, all buffered messages are
 * packaged into one message, and this packaged message is sent to the channel from the user who
 * started the standup: see section 6.13. for more details. If no standup messages are sent during
 * the standup, no message should be sent at the end.
 * @param {
 *     authUserId<> (number)
 *     channelId<> (number)
 * }
 *
 * @returns void
 */
const endStartUp = (authUserId: number, channelId: number): void => {
  const data = getData();
  if (isChannelIdActive(channelId)) {
    const channelPosition = checkIndexOfChannelId(channelId);
    const standUpObject = data.channels[channelPosition].standup;
    // Process the information
    data.channels[channelPosition].isStandUpActive = false;
    setData(data);
    let finalMessage = '';
    for (const messageObjects of standUpObject.messages) {
      finalMessage = finalMessage + '\n' + createNewMessage(messageObjects);
    }
    // Don't want the first new line
    finalMessage = finalMessage.slice(1);
    messageSendV2(authUserId, channelId, finalMessage, true, false, -1);
    saveData();
  }
};

/**
 * createNewMessage Function
 * Returns the standup message in the correct format
 * @param {
 *     messageObject<> (messageObject)
 * }
 *
 * @returns {
 *     addString<> (string)
 * }
 */
const createNewMessage = (messageObject: messageObject): string => {
  // Extract the authUserId from object and add it as the correct style
  const userName = messageObject.authUserId;
  const addString = userName + ': ' + messageObject.message;
  return addString;
};

/**
 * standUpActive Function
 * Returns if the stand up is active and how long it has left
 * @param {
 *     authUserId<> (number)
 *     channelId<> (number)
 * }
 *
 * @returns {
 *     standUpObject<> (string)
 * }
 */
export const standUpActive = (authUserId: number, channelId: number):standUpObject => {
  if (!isUserIdInChannel(authUserId, channelId)) throw HTTPError(403, 'channelId is valid and the authorised user is not a member of the channel  => standUp');
  const channelPosition = checkIndexOfChannelId(channelId);
  const data = getData();
  if (!data.channels[channelPosition].isStandUpActive) {
    return { isActive: data.channels[channelPosition].isStandUpActive, timeFinish: null };
  } else {
    return {
      isActive: data.channels[channelPosition].isStandUpActive, timeFinish: data.channels[channelPosition].standup.timeFinish
    };
  }
};

export const standupSend = (authUserId: number, channelId: number, message: string): standUpObject => {
  if (!isUserIdInChannel(authUserId, channelId)) throw HTTPError(403, 'channelId is valid and the authorised user is not a member of the channel  => standUp');
  if (message.length > 1000) throw HTTPError(400, 'length of message is over 1000 characters');
  const data = getData();
  const channelPosition = checkIndexOfChannelId(channelId);
  // Check, is there a stand up active?
  if (data.channels[channelPosition].isStandUpActive !== true) throw HTTPError(400, 'an active standup is not currently running in the channel  => standUp');
  data.channels[channelPosition].standup.messages.push({ authUserId: userProfileV1(authUserId, authUserId).user.handleStr, message: message });
  return { };
};
