import {
  authRegisterV1,
  authLogoutV1,
  authPasswordResetRequestV1,
  authPasswordResetV1,
  codeDetails // FOR TESTING PURPOSES ONLY
} from './auth';
import { getData, setData } from './dataStore';
import {
  userProfileV1,
  userProfileSetNameV2,
  userProfileSetEmailV2,
  userProfileSetHandleV2,
  getUserStats,
  getWorkspaceStats,
  usersAllV1,
  userProfileUploadPhoto
} from './users';
import { channelLeaveV1, addOwner, removeOwner, channelInviteV1, channelDetailsV1, channelJoinV1, channelMessagesV2 } from './channel';
import { channelsCreateV2, channelsListV2, channelsListallV2 } from './channels';
import fs from 'fs';
import {
  messageSendV2,
  messageEditV2,
  messageRemoveV2,
  messagesenddmV2,
  messagePinStatusV1,
  messageSendLaterV1,
  messageSendLaterDmV1,
  messageReactV1,
  messageUnreactV1,
  messageShareV1,
} from './message';

import {
  tokenString,
  clearTokensV1,

  getUserIdFromToken,
  searchV1,
} from './other';
import { standupSend, standUpActive, standupStart } from './standupFunctions';
import { dmMessagesV2, dmListV2, dmRemoveV2, dmDetailsV2, dmLeaveV2, dmCreateV2 } from './dm';
import { adminUserRemoveV1, adminUserPermissionsV1 } from './admin';
import { notificationsGetV1 } from './notifications';
// import request from 'sync-request';
// import HTTPError from 'http-errors';

// This file is used for the main purpose of keeping server clean
// and helping with any functions that require multiple things

const dataFilePath = 'dataFile.json';

// Save the data that is given to a file
const saveData = () => {
  const data = getData();
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 4), { flag: 'w' });
};

// Read the data back into the system
// If the file does not exist, save a blank template to create the file.
const restoreData = () => {
  // If statement below commented out for coverage
  /*
  if (!fs.existsSync(dataFilePath)) {
    saveData();
    return;
  }
  */
  const jsonData = fs.readFileSync(dataFilePath, { encoding: 'utf8', flag: 'r' });
  const data = JSON.parse(jsonData);
  setData(data);
  clearTokensV1();
};

// Create a function to contain all of the extra commands outside of server
const authRegisterV2Assistant = (email: string, password: string, nameFirst: string, nameLast: string) => {
  const authUserId = authRegisterV1(email, password, nameFirst, nameLast).authUserId;

  // Generate the token
  const token = tokenString(authUserId);
  saveData();
  return { response: { token, authUserId } };
};

const dmCreateV1Assistant = (token: string, uIds: number[]) => {
  const authUserId = getUserIdFromToken(token);
  const output = dmCreateV2(authUserId, uIds);
  saveData();
  return { response: output };
};

const dmListV1Assistant = (token: string) => {
  const authUserId = getUserIdFromToken(token);
  const dms = dmListV2(authUserId);
  return { response: dms };
};

const dmRemoveV1Assistant = (token: string, dmId: number) => {
  const authUserId = getUserIdFromToken(token);
  const output = dmRemoveV2(authUserId, dmId);
  saveData();
  return { response: output };
};

const dmDetailsV1Assistant = (token: string, dmId: number) => {
  const authUserId = getUserIdFromToken(token);
  const output = dmDetailsV2(authUserId, dmId);
  return { response: output };
};

const dmLeaveV1Assistant = (token: string, dmId: number) => {
  const authUserId = getUserIdFromToken(token);
  const output = dmLeaveV2(authUserId, dmId);
  saveData();
  return { response: output };
};

// Create a function to contain all of the extra commands outside of server
const dmMessagesV1Assistant = (token: string, dmId: number, start: number) => {
  // console.log(`dmMessagesV1Assistant ${token} ${dmId} ${start}`);
  const authUserId = getUserIdFromToken(token);
  const dmMessageObject = dmMessagesV2(authUserId, dmId, start);
  saveData();
  return { response: dmMessageObject };
};

// Create a function to contain all of the extra commands outside of server
const authLogoutV1Assistant = (token: string) => {
  const authLogoutObject = authLogoutV1(token);
  saveData();
  return { response: authLogoutObject };
};

const messageSendV1Assistant = (token: string, channelId: number, message: string) => {
  const authUserId = getUserIdFromToken(token);
  const messageId = messageSendV2(authUserId, channelId, message, false, false, -1).messageId;
  saveData();
  return { response: { messageId: messageId } };
};

const messageEditV1Assistant = (token: string, messageId: number, message: string) => {
  const authUserId = getUserIdFromToken(token);
  const messageEditObject = messageEditV2(authUserId, messageId, message);
  saveData();
  return { response: messageEditObject };
};

const messageRemoveV1Assistant = (token: string, messageId: number) => {
  const authUserId = getUserIdFromToken(token);
  messageRemoveV2(authUserId, messageId);
  saveData();
  return { response: {} };
};

const messageSendDMV1Assistant = (token: string, dmId: number, message: string) => {
  const authUserId = getUserIdFromToken(token);
  const messageId = messagesenddmV2(authUserId, dmId, message, false, -1).messageId;
  saveData();
  return { response: { messageId: messageId } };
};

const channelsCreateAssistant = (token: string, name: string, isPublic: boolean) => {
  const authUserId = getUserIdFromToken(token);
  const channels = channelsCreateV2(authUserId, name, isPublic);
  saveData();
  return { response: channels };
};

const channelsListAssistant = (token: string) => {
  const authUserId = getUserIdFromToken(token);
  const channels = channelsListV2(authUserId);
  saveData();
  return { response: { channels } };
};

const channelsListAllAssistant = (token: string) => {
  const authUserId = getUserIdFromToken(token);
  const channels = channelsListallV2(authUserId);

  saveData();
  return { response: { channels } };
};

const channelDetailsAssistant = (token: string, channelId: number) => {
  const authUserId = getUserIdFromToken(token);
  const channelDetailsObject = channelDetailsV1(authUserId, channelId);
  return { response: channelDetailsObject };
};

// Add in the channel invite functionality
const channelInviteAssistant = (token: string, channelId: number, uId: number) => {
  const authUserId = getUserIdFromToken(token);
  channelInviteV1(authUserId, channelId, uId);
  // change this
  saveData();
  return { response: { } };
};

const channelJoinAssistant = (token: string, channelId: number) => {
  const authUserId = getUserIdFromToken(token);
  channelJoinV1(authUserId, channelId);
  saveData();
  return { response: { } };
};

const channelLeaveAssistantV1 = (token: string, channelId: number) => {
  const authUserId = getUserIdFromToken(token);
  const emptyChannelObject = channelLeaveV1(authUserId, channelId);
  return { response: emptyChannelObject };
};

const addOwnerAssistantV1 = (token: string, channelId: number, uId: number) => {
  const authUserId = getUserIdFromToken(token);
  const ownerAdded = addOwner(authUserId, channelId, uId);
  return { response: ownerAdded };
};

const removeOwnerAssistantV1 = (token: string, channelId: number, uId: number) => {
  const authUserId = getUserIdFromToken(token);
  const ownerRemoved = removeOwner(authUserId, channelId, uId);
  return { response: ownerRemoved };
};

const channelMessagesAssistantV2 = (token: string, channelId: number, start: number) => {
  const authUserId = getUserIdFromToken(token);
  const channelMessagesReturn = channelMessagesV2(authUserId, channelId, start);
  return { response: channelMessagesReturn };
};

const userProfileV2Assistant = (token: string, uId: number) => {
  const authUserId = getUserIdFromToken(token);
  return { response: userProfileV1(authUserId, uId) };
};

const usersAllV1Assistant = (token: string) => {
  const authUserId = getUserIdFromToken(token);
  return { response: usersAllV1(authUserId) };
};

const userSetNameV1Assistant = (token: string, nameFirst: string, nameLast: string) => {
  const authUserId = getUserIdFromToken(token);
  const userSetNameObject = userProfileSetNameV2(authUserId, nameFirst, nameLast);
  saveData();
  return { response: userSetNameObject };
};

const userSetEmailV1Assistant = (token: string, email: string) => {
  const authUserId = getUserIdFromToken(token);
  const userSetEmailObject = userProfileSetEmailV2(authUserId, email);
  saveData();
  return { response: userSetEmailObject };
};

const userSetHandleV1Assistant = (token: string, handleStr: string) => {
  const authUserId = getUserIdFromToken(token);
  const userSetHandleObject = userProfileSetHandleV2(authUserId, handleStr);
  saveData();
  return { response: userSetHandleObject };
};

const standUpStartAssistant = (token: string, channelId: number, length: number) => {
  // Convert token to authUserId
  const authUserId = getUserIdFromToken(token);
  const standUpObject = standupStart(authUserId, channelId, length);
  return { response: standUpObject };
};

const standUpActiveAssistant = (token: string, channelId: number) => {
  // Convert token to authUserId
  const authUserId = getUserIdFromToken(token);
  const standUpObject = standUpActive(authUserId, channelId);
  return { response: standUpObject };
};

const standUpSendAssistant = (token: string, channelId: number, message: string) => {
  // Convert token to authUserId
  const authUserId = getUserIdFromToken(token);
  const standUpObject = standupSend(authUserId, channelId, message);
  return { response: standUpObject };
};

export const notificationsGetAssistant = (token: string) => {
  const authUserId = getUserIdFromToken(token);
  const notificationResponse = notificationsGetV1(authUserId);
  return { response: notificationResponse };
};

export const searchAssistant = (token: string, queryStr: string) => {
  const authUserId = getUserIdFromToken(token);
  const messages = searchV1(queryStr, authUserId);

  return { response: messages };
};

export const messageShareAssistant = (token: string, ogMessageId: number, message: string, channelId: number, dmId: number) => {
  const authUserId = getUserIdFromToken(token);
  const sharedMessage = messageShareV1(authUserId, ogMessageId, message, channelId, dmId);
  // throw HTTPError(401, `messageShareAssistant has not been implemented yet ${authUserId}`);
  return { response: sharedMessage };
};

export const messageReactAssistant = (token: string, messageId: number, reactId: number) => {
  const authUserId = getUserIdFromToken(token);
  const reactObject = messageReactV1(authUserId, messageId, reactId);
  return { response: reactObject };
};

export const messageUnreactAssistant = (token: string, messageId: number, reactId: number) => {
  const authUserId = getUserIdFromToken(token);
  const unreactObject = messageUnreactV1(authUserId, messageId, reactId);
  return { response: unreactObject };
};

export const messagePinAssistant = (token: string, messageId: number) => {
  const authUserId = getUserIdFromToken(token);
  messagePinStatusV1(authUserId, messageId, true);
  saveData();
  return { response: {} };
};

export const messageUnpinAssistant = (token: string, messageId: number) => {
  const authUserId = getUserIdFromToken(token);
  messagePinStatusV1(authUserId, messageId, false);
  saveData();
  return { response: {} };
};

export const messageSendlaterAssistant = (token: string, channelId: number, message: string, timeSent: number) => {
  const authUserId = getUserIdFromToken(token);
  const messageId = messageSendLaterV1(authUserId, channelId, message, timeSent);
  return { response: { messageId: messageId } };
};

export const messageSendlaterDmAssistant = (token: string, dmId: number, message: string, timeSent: number) => {
  const authUserId = getUserIdFromToken(token);
  const messageId = messageSendLaterDmV1(authUserId, dmId, message, timeSent);
  return { response: { messageId: messageId } };
};

export const authPasswordResetRequestAssistant = (token: string, email: string) => {
  const authUserId = getUserIdFromToken(token);
  authPasswordResetRequestV1(authUserId, email);
  saveData();
  return { response: {} };
};

export const authPasswordResetResetAssistant = (resetCode: string, newPassword: string) => {
  authPasswordResetV1(resetCode, newPassword);
  saveData();
  return { response: {} };
};

export const userProfileUploadPhotoAssistant = (token: string, imgUrl: string, xStart: number, yStart: number, xEnd: number, yEnd: number) => {
  const authUserId = getUserIdFromToken(token);
  Promise.resolve(userProfileUploadPhoto(authUserId, imgUrl, xStart, yStart, xEnd, yEnd));
  return { response: {} };
};

export const userStatsAssistant = (token: string) => {
  const authUserId = getUserIdFromToken(token);
  const userStats = getUserStats(authUserId);
  // console.log(`${JSON.stringify(userStats)}`);
  return { response: userStats };
};

export const usersStatsAssistant = (token: string) => {
  const workSpaceStats = getWorkspaceStats();
  return { response: workSpaceStats };
};

export const adminUserRemoveAssistant = (token: string, uId: number) => {
  const authUserId = getUserIdFromToken(token);
  adminUserRemoveV1(authUserId, uId);
  saveData();
  return { response: {} };
};

export const adminUserPermissionsAssistant = (token: string, uId: number, permissionId: number) => {
  const authUserId = getUserIdFromToken(token);
  adminUserPermissionsV1(authUserId, uId, permissionId);
  saveData();
  return { response: {} };
};

// FOR TESTING PURPOSES ONLY
const testCodeAssistant = (authUserId: number) => {
  const code = codeDetails(authUserId);
  return { response: code };
};

export {
  saveData,
  restoreData,
  authRegisterV2Assistant,
  authLogoutV1Assistant,
  messageSendV1Assistant,
  messageEditV1Assistant,
  messageRemoveV1Assistant,
  dmCreateV1Assistant,
  messageSendDMV1Assistant,
  dmListV1Assistant,
  dmDetailsV1Assistant,
  dmMessagesV1Assistant,
  channelsCreateAssistant,
  channelsListAssistant,
  channelsListAllAssistant,
  channelDetailsAssistant,
  channelInviteAssistant,
  channelJoinAssistant,
  channelLeaveAssistantV1,
  addOwnerAssistantV1,
  removeOwnerAssistantV1,
  channelMessagesAssistantV2,
  dmLeaveV1Assistant,
  dmRemoveV1Assistant,
  userProfileV2Assistant,
  usersAllV1Assistant,
  userSetNameV1Assistant,
  userSetEmailV1Assistant,
  userSetHandleV1Assistant,
  standUpStartAssistant,
  standUpActiveAssistant,
  standUpSendAssistant,
  testCodeAssistant
};
