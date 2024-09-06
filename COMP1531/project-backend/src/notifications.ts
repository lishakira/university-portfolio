import { getData, setData } from './dataStore';
// import HTTPError from 'http-errors';
import {
  checkIndexOfChannelId,
  checkIndexOfAuthUserId,
  checkIndexOfDmId,
  getMessageChannelPosition,
  getMessageDmPosition,
} from './other';

export function notificationsGetV1(authUserId: number) {
  const dataStore = getData();
  // notifications is an array of ojects which cointains {channelId, dmId, notification message}
  // each user has a list of notifications.
  // make a create notification function.
  const userIndex = checkIndexOfAuthUserId(authUserId);
  // take only the first 20.hbn
  const arrayofnotifications = [...dataStore.users[userIndex].notifications];
  arrayofnotifications.splice(20);
  arrayofnotifications.reverse();

  return { notifications: arrayofnotifications };
}

export function notificationReact(authUserId: number, channelId: number, dmId: number, targetId: number) {
  const dataStore = getData();
  const userIndex = checkIndexOfAuthUserId(authUserId);
  const targetIndex = checkIndexOfAuthUserId(targetId);
  const userHandle = dataStore.users[userIndex].handler;
  if (channelId !== -1) {
    const index = checkIndexOfChannelId(channelId);
    const channelname = dataStore.channels[index].name;
    dataStore.users[targetIndex].notifications.push({ channelId: channelId, dmId: dmId, notificationMessage: `${userHandle} reacted to your message in ${channelname}` });
  } else {
    // else if (dmId !== -1) {
    const dmIndex = checkIndexOfDmId(dmId);
    const dmname = dataStore.dms[dmIndex].name;
    dataStore.users[targetIndex].notifications.push({ channelId: channelId, dmId: dmId, notificationMessage: `${userHandle} reacted to your message in ${dmname}` });
  }
  setData(dataStore);
}

export function notificationTagged(authUserId: number, channelId: number, dmId: number, messageId: number, targetId: number) {
  const dataStore = getData();
  const userIndex = checkIndexOfAuthUserId(authUserId);
  const targetIndex = checkIndexOfAuthUserId(targetId);
  const userHandle = dataStore.users[userIndex].handler;
  if (channelId !== -1) {
    const channelIndex = checkIndexOfChannelId(channelId);

    const channelMembers = dataStore.channels[channelIndex].allMembers;
    if (!channelMembers.includes(targetId)) {
      return;
    }

    const channelname = dataStore.channels[channelIndex].name;
    const message = getMessageChannelPosition(messageId);
    const firstpart = message.message.message.substring(0, 20);
    dataStore.users[targetIndex].notifications.push({ channelId: channelId, dmId: dmId, notificationMessage: `${userHandle} tagged you in ${channelname}: ${firstpart}` });
  } else {
    // else if (dmId !== -1) {
    const dmIndex = checkIndexOfDmId(dmId);

    const dmMembers = dataStore.dms[dmIndex].memberIds;
    if (!dmMembers.includes(targetId)) {
      return;
    }

    const dmname = dataStore.dms[dmIndex].name;
    const message = getMessageDmPosition(messageId);
    const firstpart = message.message.message.substring(0, 20);
    dataStore.users[targetIndex].notifications.push({ channelId: channelId, dmId: dmId, notificationMessage: `${userHandle} tagged you in ${dmname}: ${firstpart}` });
  }
  setData(dataStore);
}

export function notificationAdded(authUserId: number, channelId: number, dmId: number, targetId: number) {
  const dataStore = getData();
  const userIndex = checkIndexOfAuthUserId(authUserId);
  const targetIndex = checkIndexOfAuthUserId(targetId);
  const userHandle = dataStore.users[userIndex].handler;
  if (channelId !== -1) {
    const index = checkIndexOfChannelId(channelId);
    const channelname = dataStore.channels[index].name;
    dataStore.users[targetIndex].notifications.push({ channelId: channelId, dmId: dmId, notificationMessage: `${userHandle} added you to ${channelname}` });
  } else {
    // else if (dmId !== -1) {
    const dmIndex = checkIndexOfDmId(dmId);
    const dmname = dataStore.dms[dmIndex].name;
    dataStore.users[targetIndex].notifications.push({ channelId: channelId, dmId: dmId, notificationMessage: `${userHandle} added you to ${dmname}` });
  }
  setData(dataStore);
}
