import { getData, setData } from './dataStore';
import { isChannelIdActive, checkIndexOfAuthUserId, timeSentCalculation } from './other';
import HTTPError from 'http-errors';
import { userJoinedChannel, workSpaceCreateChannel } from './users';

export interface channelsCreateObject {
  channelId: number;
}
export interface channelsListObject {
  channelId: number;
  name: string;
}
/**
 * channelsCreateV1 - Maximilian Falco Widjaya
 * Edited by - Jovanka Kurniawan
 * Creates a new channel with the given name that is either a public or private channel.
 * The user who created it automatically joins the channel.
 * @param {
 *     authUserId<> (integer)
 *     name<>       (string)
 *     isPublic<>   (boolean)
 * }
 *
 * @returns {
 *     "token" + "name" + "isPublic"
 * }
 */
export function channelsCreateV2(authUserId: number, name: string, isPublic: boolean): channelsCreateObject {
  const dataStore = getData();
  // Invalid cases:
  // name length too long or too short
  if (name.length < 1 || name.length > 20) {
    throw HTTPError(400, 'name does not meet criteria => channels');
  }
  // if channel name already exists
  if (channelNameExists(name) === true) {
    throw HTTPError(400, 'channel name already exists => channels');
  }

  let channelId = 10;
  while (isChannelIdActive(channelId) === true) {
    channelId++;
  }

  if (isPublic === true) {
    const channelsElements = {
      id: channelId,
      name: name,
      isPublic: true,
      messages: [],
      ownerMembers: [authUserId],
      allMembers: [authUserId],
      isStandUpActive: false,
      standup:
      {

        owner: 0,
        channelId: 0,
        timeFinish: timeSentCalculation(),
        messages:
        {
        },

      },
    };
    dataStore.channels.push(channelsElements);
  } else if (isPublic === false) {
    const channelsElements = {
      id: channelId,
      name: name,
      isPublic: false,
      messages: [],
      ownerMembers: [authUserId],
      allMembers: [authUserId],
      isStandUpActive: false,
      standup:
      {

        owner: 0,
        channelId: 0,
        timeFinish: timeSentCalculation(),
        messages:
        {
        },

      },
    };
    dataStore.channels.push(channelsElements);
  }
  dataStore.users[checkIndexOfAuthUserId(authUserId)].enrolledChannels.push(channelId);
  setData(dataStore);
  userJoinedChannel(authUserId, channelId);
  workSpaceCreateChannel(channelId);
  return {
    channelId: channelId,
  };
}

/**
 * returns true if channel name already exists
 *
 * @param {number} id
 * @returns {boolean}
 */
export function channelNameExists(name: string): boolean {
  const dataStore = getData();
  for (const i in dataStore.channels) {
    if (name === dataStore.channels[i].name) {
      return true;
    }
  }
  return false;
}

/**
 * channelsListV1 - Maximilian Falco Widjaya
 * channelsListV1 - James Humphries
 * Search through the DataStore, and get classes that are public or private with the userId
 * Return an empty object array if no classes or userId is incorrect
 * @param {
 *     authUserId<> (integer) - userId from the dataStore
 * }
 *
 * @returns {
 *     [ classes] - An array of objects that contains the information about the classes
 * }
 */
export function channelsListV2(authUserId: number): channelsListObject[] {
  const dataStore = getData();

  const channelLength = dataStore.channels.length;
  /*
  if (channelLength === 0) {
    throw HTTPError(400, 'channelLength is 0 => channels');
  }
  */
  const classArray = [];
  for (let i = 0; i < channelLength; i++) {
    const classObject = dataStore.channels[i];
    if (classObject.allMembers.includes(authUserId)) {
      classArray.push(getClassInformation(i));
    }
  }

  return classArray;
}

/**
 * channelsListallV1 - Shakira Li
 * channelsListallV1 - James Humphries
 * Search through the DataStore, and get classes that are public or private
 * Return an empty object array if no classes or userId is incorrect
 * @param {
 *      authUserId<> (integer) - userId from the dataStore
 * }
 *
 * @returns {
 *      [ classes] - An array that contains the information about the classes
 * }
 */
export function channelsListallV2(authUserId: number): channelsListObject[] {
  const dataStore = getData();

  const channelLength = dataStore.channels.length;
  /*
  if (channelLength === 0) {
    throw HTTPError(400, 'channelLength is 0 => channels');
  }
  */
  const classArray = [];
  for (let i = 0; i < channelLength; i++) {
    classArray.push(getClassInformation(i));
  }

  return classArray;
}

/**
 * Get information about the class and return it
 *
 * @param {number} classPosition
 * @returns {class} - object that contains information about the class and if it is public or private
 */
export function getClassInformation(classPosition: number): channelsListObject {
  const dataStore = getData();
  const classObject = dataStore.channels[classPosition];
  return { channelId: classObject.id, name: classObject.name };
}
