import { getData, setData, dmObject } from './dataStore';
import { userJoinedDms, userLeftDms, userProfileV1, workSpaceCreatedDm, workSpaceRemovedDm } from './users';
import {
  isDmIdActive,
  isUserIdActive,
  checkIndexOfDmId,
  checkIndexOfAuthUserId,
  checkDuplicates,
} from './other';
import { notificationAdded } from './notifications';
import HTTPError from 'http-errors';

export interface channelInviteObject {
  error?: string;
}

export interface messageObject {
  error?: string;
  end?: number;
  start?: number;
  messages?: string[];
}

export interface messageInfo {
  messageId: number,
  uId: number,
  message: string,
  timeSent: string,
  reacts: [],
  isPinned: boolean,
}

export interface channelJoinObject {
  error?: string;
}

/**
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
export function dmMessagesV2(authUserId: number, dmId: number, start: number): any {
  // Invalid channel
  if (!isDmIdActive(dmId)) throw HTTPError(400, 'dmId is not active => dm');

  const dmPosition = checkIndexOfDmId(dmId);

  const data = getData();
  if (!data.dms[dmPosition].memberIds.includes(authUserId)) throw HTTPError(400, 'authUserId is not a member of dm => dm');
  const messageArray = [];

  const lengthOfMessages = data.dms[dmPosition].messages.length;

  if (lengthOfMessages < start) {
    throw HTTPError(400, 'length of messages is less than start position => dm');
  }
  for (const messageObjectPosition in data.dms[dmPosition].messages) {
    const messageObject = data.dms[dmPosition].messages[messageObjectPosition];
    if (parseInt(messageObjectPosition) >= start) {
      if (parseInt(messageObjectPosition) >= (start + 50)) break;
      const messageObjectCreated = {
        messageId: messageObject.messageId,
        uId: messageObject.uId,
        message: messageObject.message,
        timeSent: messageObject.timeSent,
        reacts: messageObject.reacts,
        isPinned: messageObject.isPinned,
      };
      messageArray.push(messageObjectCreated);
    }
  }

  let end = start + 50;
  if (end > lengthOfMessages) {
    end = -1;
  }
  const returnMessageObject = {
    messages: messageArray,
    start: start,
    end: end,
  };

  return returnMessageObject;
}

export function dmListV2(authUserId: number): any {
  const dms = [];
  const memberId = authUserId;
  const dataStore = getData();
  for (const i in dataStore.dms) {
    for (const j in dataStore.dms[i].memberIds) {
      if (dataStore.dms[i].memberIds[j] === memberId) {
        dms.push({ dmId: dataStore.dms[i].dmId, name: dataStore.dms[i].name });
      }
    }
  }
  return { dms };
}

export function dmDetailsV2(authUserId: number, dmId: number): any {
  if (!isDmIdActive(dmId)) {
    throw HTTPError(400, 'dmId is not active => dm');
  }

  const dataStore = getData();
  const userId = authUserId;
  const dmIndex: number = checkIndexOfDmId(dmId);
  const dm = dataStore.dms[dmIndex];
  let found = false;
  for (const element in dm.memberIds) {
    if (dm.memberIds[element] === userId) {
      found = true;
    }
  }
  if (found === false) {
    throw HTTPError(400, 'Not in dm => dm');
  }
  const output = {
    name: dm.name,
    members: [],
  };

  for (const element in dm.memberIds) {
    output.members.push(userProfileV1(authUserId, dm.memberIds[element]).user);
  }

  return { name: output.name, members: output.members };
}

export function dmRemoveV2(authUserId: number, dmId: number): any {
  const userId: number = authUserId;

  if (!isDmIdActive(dmId)) throw HTTPError(400, 'dmId is not active => dm');
  const dataStore = getData();

  const dmIndex: number = checkIndexOfDmId(dmId);
  const dm = dataStore.dms[dmIndex];
  let found = false;
  if (authUserId !== dm.ownerUserId) {
    // Not allowed to delete this dm
    throw HTTPError(403, 'dmId is valid and the authorised user is not the original DM creator => dm');
  }
  for (const element in dm.memberIds) {
    if (dm.memberIds[element] === userId) {
      found = true;
    }
  }
  if (found === false) {
    throw HTTPError(403, 'dmId is valid and the authorised user is no longer in the DM => dm');
  }

  while (dm.memberIds[0] !== undefined) {
    // Push out all the members
    const dmUser = dm.memberIds[0];
    // Does this actually work?
    const indexOfMember: number = checkIndexOfAuthUserId(dmUser);
    const member = dataStore.users[indexOfMember];
    dmLeaveV2(member.id, dmId);
    userLeftDms(member.id, dmId);
  }
  const indexOfDm = checkIndexOfDmId(dmId);
  dataStore.dms.splice(indexOfDm, 1);
  workSpaceRemovedDm(dmId);
  setData(dataStore);
  return { };
}

export function dmLeaveV2(authUserId: number, dmId: number): any {
  if (!isDmIdActive(dmId)) {
    throw HTTPError(400, 'dmId is not active => dm');
  }
  const dataStore = getData();
  const userId: number = authUserId;
  const dmIndex: number = checkIndexOfDmId(dmId);
  const dm = dataStore.dms[dmIndex];

  let found = false;
  const length: number = dm.memberIds.length;
  for (let i = 0; i < length; i++) {
    if (dm.memberIds[i] === userId) {
      dm.memberIds.splice(i, 1);
      found = true;
    }
  }
  if (found === false) {
    throw HTTPError(400, 'authUserId is not in dm => dm');
  }
  const indexOfUser = checkIndexOfAuthUserId(userId);
  for (let i = 0; i < dataStore.users[indexOfUser].enrolledDms.length; i++) {
    if (dmId === dataStore.users[indexOfUser].enrolledDms[i]) {
      dataStore.users[indexOfUser].enrolledDms.splice(i, 1);
      break;
    }
  }
  userLeftDms(authUserId, dmId);
  setData(dataStore);

  return { };
}

export function dmCreateV2(authUserId: number, uIds: number[]): any {
  const ownerId: number = authUserId;
  for (const element in uIds) {
    if (!isUserIdActive(uIds[element])) {
      throw HTTPError(400, 'uIds are not all active => dm');
    }
  }
  if (!checkDuplicates(uIds)) {
    throw HTTPError(400, 'duplicate uIds in array => dm');
  }
  const dataStore = getData();

  const newDm: dmObject = {
    name: '',
    ownerUserId: ownerId,
    ownerHandle: userProfileV1(ownerId, ownerId).user.handleStr,
    memberIds: [],
    messages: [],
    dmId: 1,
  };

  // making the name of the DM
  const handles = [];
  handles.push(newDm.ownerHandle);
  for (const element in uIds) {
    handles.push(userProfileV1(authUserId, uIds[element]).user.handleStr);
  }
  handles.sort();
  for (let i = 0; i < handles.length; i++) {
    newDm.name = newDm.name + handles[i];
    if (i === handles.length - 1) {
      continue;
    }
    newDm.name = newDm.name + ', ';
  }
  // filling in the member property of the new DM
  newDm.memberIds.push(ownerId);
  for (const element in uIds) {
    newDm.memberIds.push(uIds[element]);
  }
  // generating the dmId
  newDm.dmId = 1;
  while (isDmIdActive(newDm.dmId) === true) {
    newDm.dmId++;
  }
  // pushing the new DM to the dataStore
  dataStore.dms.push(newDm);
  const dmId: number = newDm.dmId;
  // updating the enrolled DM property of the users
  const indexOfOwner = checkIndexOfAuthUserId(ownerId);
  dataStore.users[indexOfOwner].enrolledDms.push(dmId);
  userJoinedDms(authUserId, dmId);
  for (const element in uIds) {
    const indexOfMember = checkIndexOfAuthUserId(uIds[element]);
    dataStore.users[indexOfMember].enrolledDms.push(dmId);
    userJoinedDms(uIds[element], dmId);
  }
  workSpaceCreatedDm(dmId);

  for (const ids of uIds) {
    notificationAdded(authUserId, -1, dmId, ids);
  }

  setData(dataStore);
  return { dmId };
}
