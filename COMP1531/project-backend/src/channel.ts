import { getData, setData } from './dataStore';
import { userJoinedChannel, userLeftChannel, userProfileV1 } from './users';
import {
  isUserIdActive,
  isUserGlobalOwner,
  isChannelIdActive,
  isUserChannelOwner,
  checkIndexOfAuthUserId,
  isUserIdInChannel,
} from './other';
import { notificationAdded } from './notifications';
import HTTPError from 'http-errors';

export interface channelInviteObject {
  error?: string;
}

export interface channelDetailsObject {
  name: string;
  isPublic: boolean;
  ownerMembers: any;
  allMembers: any;
}

/**
 * channelDetailsV1 - Shakira Li
 * Edited by Shakira Li on 22/06/2022
 *
 * Given a channel with ID channelId that the authorised user is a
 * member of, provide basic details about the channel.
 *
 * @param {
 *      authUserId<> (integer)
 *      channelId<> (integer)
 * }
 *
 * @returns {
 *      { name, isPublic, ownerMembers, allMembers }
 * }
 */
export function channelDetailsV1(authUserId: number, channelId: number): channelDetailsObject {
  // Invalid channel
  if (!isChannelIdActive(channelId)) {
    throw HTTPError(400, 'channelId does not refer to a valid channel => channel');
  }

  const data = getData();
  // find the index of the channelId
  const index = checkIndexOfChannelId(channelId);

  // Authorised user is not a member
  if (!(data.channels[index].allMembers.includes(authUserId))) {
    throw HTTPError(403, 'channelId is valid and the authorised user is not a member of the channel => channel');
  }

  const ownerMembersArray = [];
  for (const i in data.channels[index].ownerMembers) {
    ownerMembersArray.push(userProfileV1(data.channels[index].ownerMembers[i], data.channels[index].ownerMembers[i]).user);
  }

  const allMembersArray = [];
  for (const j in data.channels[index].allMembers) {
    allMembersArray.push(userProfileV1(data.channels[index].allMembers[j], data.channels[index].allMembers[j]).user);
  }

  return {
    name: data.channels[index].name,
    isPublic: data.channels[index].isPublic,
    ownerMembers: ownerMembersArray,
    allMembers: allMembersArray,
  };
}

/**
 * channelInviteV1 - James Humphries
 * Edited by - Jovanka Kurniawan
 *
 * TO BE UPDATED IN LATER ITERATIONS
 * @param {
 *     authUserId<> (integer)
 *     channelId<>  (integer)
 *     uId<>      (integer)
 * }
 *
 * @returns {
 *     "authUserId" + "channelId" + "uId"
 * }
 */

export function channelInviteV1(authUserId: number, channelId: number, uId: number): channelInviteObject {
  const dataStore = getData();

  // find the index of the channelId
  const index = checkIndexOfChannelId(channelId);
  // Invalid cases:
  // if channel id doesn't exist
  if (isChannelIdActive(channelId) === false) {
    throw HTTPError(400, 'channelId does not refer to a valid channel => channel');
  }
  // if uID doesn't exist
  if (isUserIdActive(uId) === false) {
    throw HTTPError(400, 'uId does not refer to a valid user => channel');
  }

  // channelId is valid and the authorised user is not a member of the channel
  if (!(dataStore.channels[index].allMembers.includes(authUserId))) {
    throw HTTPError(403, 'channelId is valid and the authorised user is not a member of the channel => channel');
  }
  // uId refers to a user who is already a member of the channel
  if (dataStore.channels[index].allMembers.includes(uId)) {
    throw HTTPError(400, 'uId refers to a user who is already a member of the channel => channel');
  }

  dataStore.channels[index].allMembers.push(uId);

  // add channelId to enrolled channels for user invited
  dataStore.users[checkIndexOfAuthUserId(uId)].enrolledChannels.push(channelId);
  userJoinedChannel(authUserId, channelId);
  notificationAdded(authUserId, channelId, -1, uId);
  setData(dataStore);

  return {};
}
/**
 * checkIndexOfChannelId
 * Given a channelId, find its index position in the data store
 * Return -1 if unable to find index position
 * @param {
 *     channelId<>  (integer)
 * }
 *
 * @returns {
 *     indexPosition (number)
 * }
 */

export function checkIndexOfChannelId(channelId: number): number {
  const dataStore = getData();
  for (const i in dataStore.channels) {
    if (channelId === dataStore.channels[i].id) {
      return Number(i);
    }
  }

  return -1;
}

/**
 * channelJoinV1 - James Humphries
 * Edited by Shakira Li on 22/06/2022
 *
 * Given a channelId of a channel that the authorised user can join,
 * adds them to that channel.
 *
 * @param {
 *     authUserId<> (integer)
 *     channelId<>  (integer)
 *     uId<>      (integer)
 * }
 *
 * @returns {
 *     "authUserId" + "channelId" + "uId"
 * }
 */
export function channelJoinV1(authUserId: number, channelId: number): object {
  // Invalid channel
  if (!isChannelIdActive(channelId)) {
    throw HTTPError(400, 'channelId does not refer to a valid channel => channel');
  }

  // Find the index of the channelId
  const index = checkIndexOfChannelId(channelId);

  const data = getData();
  // Authorised user is already a member of the channel
  if (data.channels[index].allMembers.includes(authUserId)) {
    throw HTTPError(400, 'the authorised user is already a member of the channel => channel');
  }

  // Checks if channel is private
  // If so, checks if authorised user is a global owner
  if (!(data.channels[index].isPublic)) {
    if (!isUserGlobalOwner(authUserId)) {
      // Authorised user has no permission to access the channel
      throw HTTPError(403, 'channelId refers to a channel that is private and the authorised user is not already a channel member and is not a global owner => channel');
    }
  }

  data.channels[index].allMembers.push(authUserId);

  data.users[checkIndexOfAuthUserId(authUserId)].enrolledChannels.push(channelId);
  userJoinedChannel(authUserId, channelId);
  return {};
}

/**
 * channelMessagesV2 - Anton Sangalang
 * edited by - Maximilian Falco Widjaya
 *
 * Given valid userId and channelId, return up to 50 messages between
 * index 'start' and 'start + 50' if the given userId is a member of
 * the channel with the corresponding channelId. Returns 'end' that has
 * a value of 'start + 50'. Returns '-1' if this function has returned
 * the most recent message
 *
 * @param {
 *     authUserId<> (integer)
 *     channelId<>  (integer)
 *     start<>      (integer)
 * }
 *
 * @returns {
 *     messages:    [],
 *     start:       (integer),
 *     end:         (integer),
 * }
 *
 */

export function channelMessagesV2(authUserId: number, channelId: number, start: number): object {
  const dataStore = getData();
  if (!isChannelIdActive(channelId)) {
    throw HTTPError(400, 'channelId does not refer to a valid channel => channel');
  }
  // find the index of the channelId
  const index = checkIndexOfChannelId(channelId);

  // Check if an authorised user of the channel
  if (!dataStore.channels[index].allMembers.includes(authUserId)) {
    throw HTTPError(403, 'channelId is valid and the authorised user is not a member of the channel => channel');
  }

  const channel = dataStore.channels[index];

  if (start > channel.messages.length) {
    throw HTTPError(400, 'start is greater than the total number of messages in the channel => channel');
  }

  const output = {
    messages: [],
    start: 0,
    end: 0,
  };

  const startPoint = channel.messages.length - start - 1;
  // const endPoint = channel.messages.length - end;

  let end = startPoint - 50;
  if (end < 0) {
    end = -1;
  }

  for (let i = startPoint; i > end; i--) {
    output.messages.unshift(channel.messages[i]);
  }

  if (end > channel.messages.length) {
    end = -1;
  }
  output.end = end;
  output.start = start;

  return output;
}

/**
 * channelLeaveV1 - Anton Sangalang
 *
 * Given a valid channelId and a user of specified channel. Removes this member as a member from
 * the channel. Their message will remain. If the owner of the channel leaves the channel
 * will remain.
 *
 * @param {
 *     authUserId<> (number)
 *     channelId<> (integer)
 * }
 *
 * @returns {}
 *
 */

export function channelLeaveV1(authUserId: number, channelId: number): object {
  // find the given channel
  const dataStore = getData();
  const index = checkIndexOfChannelId(channelId);
  if (!isChannelIdActive(channelId)) {
    throw HTTPError(400, 'channelId does not refer to a valid channel => channel');
  }
  // Check if an authorised user of the channel
  if (!dataStore.channels[index].allMembers.includes(authUserId)) {
    throw HTTPError(403, 'channelId is valid and the authorised user is not a member of the channel => channel');
  }

  // Check if there is an active standup with the user as the owner
  if (dataStore.channels[index].standup !== undefined) {
    if (dataStore.channels[index].standup.owner === userProfileV1(authUserId, authUserId).user.handleStr) {
      throw HTTPError(400, 'the authorised user is the starter of an active standup in the channel => channel');
    }
  }

  for (const members of dataStore.channels[index].allMembers) {
    if (members === authUserId) {
      dataStore.channels[index].allMembers.splice(dataStore.channels[index].allMembers.indexOf(members), 1);
    }
  }
  for (const owners of dataStore.channels[index].ownerMembers) {
    if (owners === authUserId) {
      dataStore.channels[index].ownerMembers.splice(dataStore.channels[index].ownerMembers.indexOf(owners), 1);
    }
  }
  userLeftChannel(authUserId, channelId);
  return {};
}

/**
 * addOwner - Anton Sangalang
 *
 * Given a user Id make a user with that Id an owner of the channel. If authorized.
 *
 * @param {
 *     token<> (string)
 *     channelId<>  (integer)
 * }
 *
 * @returns {}
 *
 */
export function addOwner(authUserId: number, channelId: number, uId: number): object {
  // if the channel Id is in the data store.
  if (!isChannelIdActive(channelId)) throw HTTPError(400, 'channelId does not refer to a valid channel => channel');
  // if the user is also in the data store.
  if (!isUserIdActive(uId)) throw HTTPError(400, 'uId does not refer to a valid user => channel');
  // if the given user is in the channel.
  if (!isUserIdInChannel(uId, channelId)) throw HTTPError(400, 'uId refers to a user who is not a member of the channel => channel');
  // if the user is not already a channel owner.
  if (isUserChannelOwner(uId, channelId)) throw HTTPError(400, 'uId refers to a user who is already an owner of the channel => channel');
  // if the token is a global owner or they are an owner of the channel.
  if (isUserGlobalOwner(authUserId) || isUserChannelOwner(authUserId, channelId)) {
    const dataStruct = getData();
    const channelLocation = checkIndexOfChannelId(channelId);
    dataStruct.channels[channelLocation].ownerMembers.push(uId);
    return {};
  }

  throw HTTPError(403, 'channelId is valid and the authorised user does not have owner permissions in the channel => channel');
}

/**
 * removeOwner - Anton Sangalang
 *
 * Given a user Id remove that user from the owners list. If authorized.
 *
 * @param {
 *     token<> (string)
 *     channelId<>  (integer)
 * }
 *
 * @returns {}
 *
 */
export function removeOwner(authUserId: number, channelId: number, uId: number): object {
  const dataStruct = getData();
  // does the channel exist.
  if (!isChannelIdActive(channelId)) throw HTTPError(400, 'channelId does not refer to a valid channel => channel');
  // is the member a real member.
  if (!isUserIdActive(uId)) throw HTTPError(400, 'uId does not refer to a valid user => channel');
  // is the member in the channel.
  if (!isUserIdInChannel(uId, channelId)) throw HTTPError(400, 'NOT SPECIFIED: uId refers to a user that is not a member of the channel => channel');
  // if the token user does not have perms in the channel return an error.
  if (!((isUserChannelOwner(authUserId, channelId)) || isUserGlobalOwner(authUserId))) {
    throw HTTPError(403, 'channelId is valid and the authorised user does not have owner permissions in the channel => channel');
  }
  // if there is only one owner and you are trying to remove him return an error.
  const channelindex = checkIndexOfChannelId(channelId);
  if (dataStruct.channels[channelindex].ownerMembers.length === 1) {
    if (isUserChannelOwner(uId, channelId)) throw HTTPError(400, 'uId refers to a user who is currently the only owner of the channel => channel');
  }
  // if the user is not an owner of the channel return error;
  if (!isUserChannelOwner(uId, channelId)) throw HTTPError(400, 'uId refers to a user who is not an owner of the channel => channel');

  // if all these passed go to the channel
  const channelLocation = checkIndexOfChannelId(channelId);
  dataStruct.channels[channelLocation].ownerMembers.splice(dataStruct.channels[channelLocation].ownerMembers.indexOf(uId), 1);

  return {};
}
