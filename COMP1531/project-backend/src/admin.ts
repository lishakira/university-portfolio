import { getData, setData } from './dataStore';
import {
  isUserIdActive,
  isUserGlobalOwner,
  checkIndexOfDmId,
  isUserIdInChannel,
  checkIndexOfAuthUserId,
} from './other';
import { userProfileSetNameV2 } from './users';
import { dmLeaveV2 } from './dm';
import { channelLeaveV1 } from './channel';
import HTTPError from 'http-errors';

/**
 * admin/user/remove/v1 - Shakira Li
 *
 * Given a user by their uId, remove them from the Treats.
 *
 * @param {
 *     uId<> (integer)
 * }
 *
 * @returns {}
 */
const adminUserRemoveV1 = (authUserId: number, uId: number) => {
  if (!isUserGlobalOwner(authUserId)) throw HTTPError(403, 'the authorised user is not a global owner');
  if (!isUserIdActive(uId)) throw HTTPError(400, 'uId does not refer to a valid user');
  if (isUserOnlyGlobalOwner(uId)) throw HTTPError(400, 'uId refers to a user who is the only global owner');
  // changes all the dm messages sent by the user to 'Removed user'
  removedUserDms(uId);
  // changes all the channel messages sent by the user to 'Removed user'
  removedUserChannels(uId);
  userProfileSetNameV2(uId, 'Removed', 'user');
};

/**
 * admin/userpermission/change/v1 - Shakira Li
 *
 * Given a user by their user ID, set their permissions to new permissions
 * described by permissionId.
 *
 * @param {
 *    authUserId<> (integer)
 *    uId<> (integer)
 * }
 *
 * @returns {}
 */
const adminUserPermissionsV1 = (authUserId: number, uId: number, permissionId: number) => {
  const ownerPermission = 1;
  const memberPermission = 2;
  const permissionIds = [ownerPermission, memberPermission];

  if (!isUserGlobalOwner(authUserId)) throw HTTPError(403, 'the authorised user is not a global owner');
  if (!isUserIdActive(uId)) throw HTTPError(400, 'uId does not refer to a valid user');
  if (isUserOnlyGlobalOwner(uId) && permissionId === memberPermission) throw HTTPError(400, 'uId refers to a user who is the only global owner and they are being demoted to a user');
  if (!permissionIds.includes(permissionId)) throw HTTPError(400, 'permissionId is invalid');
  if (currentPermissionLevel(uId) === permissionId) throw HTTPError(400, 'the user already has the permissions level of permissionId');

  const dataStore = getData();
  const index = checkIndexOfAuthUserId(uId);
  if (permissionId === ownerPermission) {
    dataStore.users[index].globalOwner = true;
  } else {
    dataStore.users[index].globalOwner = false;
  }

  setData(dataStore);
};

/// ////////////////////
// Helper Functions //
/// ///////////////////
/**
 * Changes all the dm messages of the user to 'Removed user'
 *
 * @param {number} uId
 */
function removedUserDms (uId: number) {
  const dataStore = getData();
  for (const dmPosition in dataStore.dms) {
    const dmObject = dataStore.dms[dmPosition];
    if (isUserIdInDm(uId, dmObject.dmId)) {
      for (const messagePosition in dmObject.messages) {
        const dmMessage = dmObject.messages[messagePosition];
        if (uId === dmMessage.uId) {
          dmMessage.message = 'Removed user';
        }
      }
      // remove user from dm
      dmLeaveV2(uId, dmObject.dmId);
    }
  }
  setData(dataStore);
}

/**
 * Changes all the channel messages of the user to 'Removed user'
 *
 * @param {number} uId
 */
function removedUserChannels (uId: number) {
  const dataStore = getData();
  for (const channelPosition in dataStore.channels) {
    const channelObject = dataStore.channels[channelPosition];
    if (isUserIdInChannel(uId, channelObject.id)) {
      const messages = channelObject.messages;
      for (const messagePosition in messages) {
        const channelMessage = channelObject.messages[messagePosition];
        if (uId === channelMessage.uId) {
          channelMessage.message = 'Removed user';
        }
      }
      // remove user from channel
      channelLeaveV1(uId, channelObject.id);
    }
  }
  setData(dataStore);
}

/**
 * Checks if the user is part of the dm
 *
 * @param {number} uId
 * @param {nmber} dmId
 * @returns {boolean}
 */
function isUserIdInDm (uId: number, dmId: number): boolean {
  const dataStore = getData();
  const dmPosition = checkIndexOfDmId(dmId);
  const dmObject = dataStore.dms[dmPosition];
  if (dmObject.memberIds.includes(uId)) {
    return true;
  }
  // Id is not being used
  return false;
}

/**
 * Checks if the user is the only global owner
 *
 * @param {number} uId
 * @returns {boolean}
 */
function isUserOnlyGlobalOwner (uId: number): boolean {
  if (!isUserGlobalOwner(uId)) return false;

  const dataStore = getData();
  const userLength = dataStore.users.length;
  for (let i = 0; i < userLength; i++) {
    if (uId !== dataStore.users[i].id && dataStore.users[i].globalOwner) {
      return false;
    }
  }
  // user is the sole global owner
  return true;
}

/**
 * Checks the permission level of the user depending on
 * whether they are a global owner or just a member
 *
 * @param {number} uId
 * @returns {1} if global owner;
 * @returns {2} if global member
 */
function currentPermissionLevel (uId: number): number {
  const ownerPermission = 1;
  const memberPermission = 2;
  return isUserGlobalOwner(uId) ? ownerPermission : memberPermission;
}

export {
  adminUserRemoveV1,
  adminUserPermissionsV1
};
