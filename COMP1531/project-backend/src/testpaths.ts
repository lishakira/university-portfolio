/* eslint-disable */
import { token } from 'morgan';
import request, { HttpVerb } from 'sync-request';
import config from './config.json';

// Constant file to contain all of the path names for easier modification
// Name written in the format of command + 'Path' + version of function
export const authLoginPathV3          = '/auth/login/v3';
export const authRegisterPathV3       = '/auth/register/v3';
export const channelsCreatePathV3     = '/channels/create/v3';
export const channelsListPathV3       = '/channels/list/v3';
export const channelsListAllPathV3    = '/channels/listall/v3';
export const channelDetailsPathV3     = '/channel/details/v3';
export const channelJoinPathV3        = '/channel/join/v3';
export const channelInvitePathV3      = '/channel/invite/v3';
export const channelMessagesPathV3    = '/channel/messages/v3';
export const userProfilePathV3        = '/user/profile/v3';
export const clearPathV1              = '/clear/v1';
export const authLogoutPathV3         = '/auth/logout/v3';
export const channelLeavePathV2       = '/channel/leave/v2';
export const channelAddownerPathV2    = '/channel/addowner/v2';
export const channelRemoveownerPathV2 = '/channel/removeowner/v2';
export const messageSendPathV2        = '/message/send/v2';
export const messageEditPathV2        = '/message/edit/v2';
export const messageRemovePathV2      = '/message/remove/v2';
export const dmCreatePathV2           = '/dm/create/v2';
export const dmListPathV2             = '/dm/list/v2';
export const dmRemovePathV2           = '/dm/remove/v2';
export const dmDetailsPathV2          = '/dm/details/v2';
export const dmLeavePathV2            = '/dm/leave/v2';
export const dmMessagesPathV2         = '/dm/messages/v2';
export const messageSendDmPathV2      = '/message/senddm/v2';
export const usersAllPathV2           = '/users/all/v2';
export const userProfileSetNamePathV2 = '/user/profile/setname/v2';
export const userProfileSetEmailPathV2 = '/user/profile/setemail/v2';
export const userProfileSetHandlePathV2 = '/user/profile/sethandle/v2';

// Iteration 3 Exports
export const standupStartPathV1             = '/standup/start/v1';
export const standupActivePathV1            = '/standup/active/v1';
export const standupSendPathV1              = '/standup/send/v1';
export const notificationsGetPathV1         = '/notifications/get/v1';
export const searchPathV1                   = '/search/v1';
export const messageSharePathV1             = '/message/share/v1';
export const messageReactPathV1             = '/message/react/v1';
export const messageUnreactPathV1           = '/message/unreact/v1';
export const messagePinPathV1               = '/message/pin/v1';
export const messageUnpinPathV1             = '/message/unpin/v1';
export const messageSendLaterPathV1         = '/message/sendlater/v1';
export const messageSendLaterDmPathV1       = '/message/sendlaterdm/v1';
export const authPasswordResetRequestPathV1 = '/auth/passwordreset/request/v1';
export const authPasswordResetResetPathV1   = '/auth/passwordreset/reset/v1';
export const userProfileUploadPhotoPathV1   = '/user/profile/uploadphoto/v1';
export const userStatsPathV1                = '/user/stats/v1';
export const usersStatsPathV1               = '/users/stats/v1';
export const adminUserRemovePathV1          = '/admin/user/remove/v1';
export const adminUserPermissionsPathV1     = '/admin/userpermission/change/v1';

// FOR TESTING PURPOSES ONLY Export
export const testCodePath = '/test/code/only';

// Wrapper Functions For All Test Files
export const HTTPOK = 200;
export const HTTPError403 = 403;
export const HTTPError400 = 400;
const port = config.port;
const url = config.url;
const SERVER_URL = `${url}:${port}`;
function requestHelper(method: HttpVerb, path: string, header: object, payload: object) {
  let qs = {};
  let json = {};
  let headers = {};
  headers = header;
  if (['GET', 'DELETE'].includes(method)) {
	  qs = payload;
  } else {
	  // PUT/POST
	  json = payload;
  }

  const res = request(method, SERVER_URL + path, { headers, qs, json });
  if (res.statusCode === HTTPError400) {
	  return { statusCode: HTTPError400 };
  }
  else if (res.statusCode === HTTPError403) {
	  return { statusCode: HTTPError403 };
  }

  return JSON.parse(res.getBody('utf-8'));
}

export function requestAuthRegister(email: string, password: string, nameFirst: string, nameLast: string) {
  return requestHelper('POST', authRegisterPathV3, {}, {email, password, nameFirst, nameLast});
}

export function requestAuthLogin(email: string, password: string) {
  return requestHelper('POST', authLoginPathV3,  {}, {email, password});
}

export function requestAuthLogout(token: string) {
  return requestHelper('POST', authLogoutPathV3, {token}, {});
}

export function requestChannelsCreate(token: string, name: string, isPublic: boolean) {
  return requestHelper('POST', channelsCreatePathV3, {token}, {name, isPublic});
}

export function requestChannelsList(token: string) {
  return requestHelper('GET', channelsListPathV3, {token},  {});
}

export function requestChannelsListAll(token: string) {
  return requestHelper('GET', channelsListAllPathV3, {token},  {});
}

export function requestClear() {
  return requestHelper('DELETE', clearPathV1, {}, {});
}

export function requestMessageSendDm(token: string, dmId: number, message: string) {
	return requestHelper('POST', messageSendDmPathV2, {token} , {dmId, message});
}

export function requestMessageRemove(token: string, messageId: number) {
  return requestHelper('DELETE', messageRemovePathV2, {token} , {messageId});
}

export function requestMessageEdit(token: string, messageId: number, message: string) {
  return requestHelper('PUT', messageEditPathV2, {token}, {messageId, message});
}

export function requestMessageSend(token: string, channelId: number, message: string) {
  return requestHelper('POST', messageSendPathV2, {token}, {channelId, message});
}

export function requestDmCreate(token: string, uIds: number[]) {
  return requestHelper('POST', dmCreatePathV2, {token}, {uIds});
}

export function requestDmList(token: string) {
  return requestHelper('GET', dmListPathV2, { token }, {});
}

export function requestDmRemove(token: string, dmId: number) {
  return requestHelper('DELETE', dmRemovePathV2, { token}, {dmId });
}

export function requestDmDetails(token: string, dmId: number) {
  return requestHelper('GET', dmDetailsPathV2, { token}, {dmId });
}

export function requestDmLeave(token: string, dmId: number) {
  return requestHelper('POST', dmLeavePathV2, { token}, {dmId });
}

export function requestUserProfile(token: string, uId: number) {
  return requestHelper('GET', userProfilePathV3, {token}, {uId});
}

export function requestChannelInvite(token: string, channelId: number, uId: number) {
  return requestHelper('POST', channelInvitePathV3, {token}, {channelId, uId});
}

export function requestChannelDetails(token: string, channelId: number) {
  return requestHelper('GET', channelDetailsPathV3, {token}, {channelId});
}

export function requestChannelJoin(token: string, channelId: number) {
  return requestHelper('POST', channelJoinPathV3, {token}, {channelId});
}

export function requestUsersAll(token: string) {
  return requestHelper('GET', usersAllPathV2, {token}, {});
}

export function requestDmMessages(token: string, dmId: number, start: number) {
  return requestHelper('GET', dmMessagesPathV2, {token}, {dmId, start});
}

export function requeststandupStart(token: string, channelId: number, length: number) {
	return requestHelper('POST', standupStartPathV1, {token}, {channelId, length});
}

export function requeststandupActive(token: string, channelId: number) {
	return requestHelper('GET', standupActivePathV1, {token}, {channelId});
}

export function requeststandupSend(token: string, channelId: number, message: string) {
	return requestHelper('POST', standupSendPathV1, {token}, {channelId, message});
}

export function requestChannelLeave(token: string, channelId: number) {
  return requestHelper('POST', channelLeavePathV2, {token}, {channelId});
}

export function requestAddOwner(token: string, channelId: number, uId: number) {
  return requestHelper('POST', channelAddownerPathV2, {token}, {channelId, uId});
}

export function requestRemoveOwner(token: string, channelId: number, uId: number) {
  return requestHelper('POST', channelRemoveownerPathV2, {token}, {channelId, uId});
}

export function requestChannelMessages(token: string, channelId: number, start: number) {
	return requestHelper('GET', channelMessagesPathV3, {token}, {channelId, start});
}

// export function requestDmMessage(token: string, dmId: number, start: number) {
//   return requestHelper('GET', dmMessagesPathV2, {token}, {dmId, start});
// }

export function requestSendDmMessage(token: string, dmId: number, message: string) {
  return requestHelper('POST', messageSendDmPathV2, {token}, {dmId, message});
}

export function requestUserProfileSetName(token: string, nameFirst: string, nameLast: string) {
  return requestHelper('PUT', userProfileSetNamePathV2, {token}, {nameFirst, nameLast});
}

export function requestUserProfileSetEmail(token:string, email: string) {
  return requestHelper('PUT', userProfileSetEmailPathV2, {token}, {email});
}

export function requestUserProfileSetHandle(token:string, handleStr: string) {
  return requestHelper('PUT', userProfileSetHandlePathV2, {token}, {handleStr});
}

export function requestNotificationsGet(token: string) {
  return requestHelper('GET', notificationsGetPathV1, {token}, {});
}

export function requestSearch(token: string, queryStr: string) {
  return requestHelper('GET', searchPathV1, {token}, {queryStr});
}

export function requestMessageShare(token: string, ogMessageId: number, message: string, channelId: number, dmId: number) {
  return requestHelper('POST', messageSharePathV1, {token}, {ogMessageId, message, channelId, dmId});
}

export function requestMessageReact(token: string,  messageId: number, reactId: number) {
  return requestHelper('POST', messageReactPathV1, {token}, {messageId, reactId});
}

export function requestMessageUnreact(token: string,  messageId: number, reactId: number) {
  return requestHelper('POST', messageUnreactPathV1, {token}, {messageId, reactId});
}

export function requestMessagePin(token: string, messageId: number) {
  return requestHelper('POST', messagePinPathV1, {token}, {messageId});
}

export function requestMessageUnpin(token: string, messageId: number) {
  return requestHelper('POST', messageUnpinPathV1, {token}, {messageId});
}

export function requestMessageSendLater(token: string,  channelId: number, message: string, timeSent: number) {
  return requestHelper('POST', messageSendLaterPathV1, {token}, { channelId, message, timeSent});
}

export function requestMessageSendLaterDm(token: string, dmId: number, message: string, timeSent: number) {
  return requestHelper('POST', messageSendLaterDmPathV1, {token}, {dmId, message, timeSent});
}

export function requestAuthPasswordResetRequest(token: string, email: string) {
  return requestHelper('POST', authPasswordResetRequestPathV1, {token}, {email});
}

export function requestAuthPasswordResetReset(resetCode: string, newPassword: string) {
  return requestHelper('POST', authPasswordResetResetPathV1, {}, {resetCode, newPassword});
}

export function requestUserProfileUploadPhoto(token: string, imgUrl: string, xStart: number, yStart: number, xEnd: number, yEnd: number) {
  return requestHelper('POST', userProfileUploadPhotoPathV1, {token}, {imgUrl, xStart, yStart, xEnd, yEnd});
}

export function requestUserStats(token: string) {
  return requestHelper('GET', userStatsPathV1, {token}, {});
}

export function requestUsersStats(token: string) {
  return requestHelper('GET', usersStatsPathV1, {token}, {});
}

export function requestAdminUserRemove(token: string, uId: number) {
  return requestHelper('DELETE', adminUserRemovePathV1, {token}, {uId});
}

export function requestAdminUserPermissions(token: string, uId: number, permissionId: number) {
  return requestHelper('POST', adminUserPermissionsPathV1, {token}, {uId, permissionId});
}

// FOR TESTING PURPOSES ONLY
export function requestCodeDetails(authUserId: number) {
  return requestHelper('GET', testCodePath, {}, {authUserId});
}