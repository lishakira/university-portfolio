import express, { Request, Response } from 'express';
import { echo } from './echo';
import cors from 'cors';
import morgan from 'morgan';
import config from './config.json';
import errorHandler from 'middleware-http-errors';
import { authLoginV1 } from './auth';
import { clearV1, tokenString } from './other';
import {
  saveData,
  restoreData,
  // authLogin - DONE
  authRegisterV2Assistant,
  // channels/create/v2 - DONE
  channelsListAssistant,
  channelsListAllAssistant,
  channelDetailsAssistant,
  channelJoinAssistant,
  channelInviteAssistant,
  channelMessagesAssistantV2,
  userProfileV2Assistant,
  // clear/v1   -DONE
  authLogoutV1Assistant,
  channelLeaveAssistantV1,
  addOwnerAssistantV1,
  removeOwnerAssistantV1,
  messageSendV1Assistant,
  messageEditV1Assistant,
  messageRemoveV1Assistant,
  dmCreateV1Assistant,
  dmListV1Assistant,
  dmRemoveV1Assistant,
  dmDetailsV1Assistant,
  dmLeaveV1Assistant,
  dmMessagesV1Assistant,
  // dm/messages/v1
  messageSendDMV1Assistant,
  usersAllV1Assistant,
  userSetNameV1Assistant,
  userSetEmailV1Assistant,
  userSetHandleV1Assistant,
  standUpStartAssistant,
  standUpActiveAssistant,
  standUpSendAssistant,
  channelsCreateAssistant,
  notificationsGetAssistant,
  searchAssistant,
  messageShareAssistant,
  messageReactAssistant,
  messageUnreactAssistant,
  messagePinAssistant,
  messageUnpinAssistant,
  messageSendlaterAssistant,
  messageSendlaterDmAssistant,
  authPasswordResetRequestAssistant,
  authPasswordResetResetAssistant,
  userProfileUploadPhotoAssistant,
  userStatsAssistant,
  usersStatsAssistant,
  adminUserPermissionsAssistant,
  adminUserRemoveAssistant,
  testCodeAssistant // FOR TESTING PURPOSES ONLY
} from './serverAssistant';

// Constants for path names
import {
  authRegisterPathV3,
  authLoginPathV3,
  authLogoutPathV3,
  clearPathV1,
  userProfilePathV3,
  channelsCreatePathV3,
  standupStartPathV1,
  standupActivePathV1,
  standupSendPathV1,
  usersAllPathV2,
  userProfileSetNamePathV2,
  userProfileSetEmailPathV2,
  userProfileSetHandlePathV2,
  channelsListPathV3,
  channelsListAllPathV3,
  channelDetailsPathV3,
  channelJoinPathV3,
  channelInvitePathV3,
  channelMessagesPathV3,
  channelLeavePathV2,
  channelAddownerPathV2,
  channelRemoveownerPathV2,
  messageSendPathV2,
  messageEditPathV2,
  messageRemovePathV2,
  dmCreatePathV2,
  dmListPathV2,
  dmRemovePathV2,
  dmDetailsPathV2,
  dmLeavePathV2,
  dmMessagesPathV2,
  messageSendDmPathV2,
  notificationsGetPathV1,
  searchPathV1,
  messageSharePathV1,
  messageReactPathV1,
  messageUnreactPathV1,
  messagePinPathV1,
  messageUnpinPathV1,
  messageSendLaterPathV1,
  messageSendLaterDmPathV1,
  authPasswordResetRequestPathV1,
  authPasswordResetResetPathV1,
  userProfileUploadPhotoPathV1,
  userStatsPathV1,
  usersStatsPathV1,
  adminUserRemovePathV1,
  adminUserPermissionsPathV1,
  testCodePath // FOR TESTING PURPOSES ONLY
} from './testpaths';

// Set up web app, use JSON
const app = express();
app.use(express.json());

// For user photos
const path = require('path');
app.use('/profiles', express.static(path.join(__dirname, 'public')));

// Use middleware that allows for access from other domains
app.use(cors());

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

/*
//for uploading and serving images implemented in userProfileUploadPhoto function
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const filepath = req.protocol + ";//" + HOST + '/' + req.file.path;
*/

// Example get request
app.get('/echo', (req, res, next) => {
  try {
    const data = req.query.echo as string;
    return res.json(echo(data));
  } catch (err) {
    next(err);
  }
});

/// //////////////////////
//    User Functions   //
/// //////////////////////
app.get(userProfilePathV3, (req, res) => {
  const token: string = req.headers.token as string;
  const uId = Number(req.query.uId as string);
  res.json(userProfileV2Assistant(token, uId).response);
});

app.get(usersAllPathV2, (req, res) => {
  const token: string = req.headers.token as string;
  res.json(usersAllV1Assistant(token).response);
});

app.put(userProfileSetNamePathV2, (req, res) => {
  const token: string = req.headers.token as string;
  const { nameFirst, nameLast } = req.body;
  res.json(userSetNameV1Assistant(token, nameFirst, nameLast).response);
});

app.put(userProfileSetEmailPathV2, (req, res) => {
  const token: string = req.headers.token as string;
  const { email } = req.body;
  res.json(userSetEmailV1Assistant(token, email).response);
});

app.put(userProfileSetHandlePathV2, (req, res) => {
  const token: string = req.headers.token as string;
  const { handleStr } = req.body;
  res.json(userSetHandleV1Assistant(token, handleStr).response);
});

/// //////////////////////
//    Auth Functions   //
/// //////////////////////
app.post(authLoginPathV3, (req, logres) => {
  const { email, password } = req.body;
  const authUserId = authLoginV1(email, password).authUserId;
  if (authUserId === undefined) {
    logres.json({ error: 'error' });
  } else {
    // Generate the token
    const token = tokenString(authUserId);
    logres.json({ token, authUserId });
  }
});

app.post(authRegisterPathV3, (req, res) => {
  const { email, password, nameFirst, nameLast } = req.body;
  res.json(authRegisterV2Assistant(email, password, nameFirst, nameLast).response);
});

app.post(authLogoutPathV3, (req, res) => {
  const token: string = req.headers.token as string;
  res.json(authLogoutV1Assistant(token).response);
});

/// //////////////////////
//    Dm Functions     //
/// //////////////////////
app.post(dmCreatePathV2, (req, res) => {
  const token: string = req.headers.token as string;
  const { uIds } = req.body;
  res.json(dmCreateV1Assistant(token, uIds).response);
});

app.get(dmListPathV2, (req, res) => {
  const token: string = req.headers.token as string;
  res.json(dmListV1Assistant(token).response);
});

app.delete(dmRemovePathV2, (req, res) => {
  const token: string = req.headers.token as string;
  const dmId = Number(req.query.dmId as string);
  res.json(dmRemoveV1Assistant(token, dmId).response);
});

app.get(dmDetailsPathV2, (req, res) => {
  const token: string = req.headers.token as string;
  const dmId = Number(req.query.dmId as string);
  res.json(dmDetailsV1Assistant(token, dmId).response);
});

app.post(dmLeavePathV2, (req, res) => {
  const token: string = req.headers.token as string;
  const { dmId } = req.body;
  res.json(dmLeaveV1Assistant(token, dmId).response);
});

app.get(dmMessagesPathV2, (req, res) => {
  const token: string = req.headers.token as string;
  const dmId = Number(req.query.dmId as string);
  const start = Number(req.query.start as string);
  res.json(dmMessagesV1Assistant(token, dmId, start).response);
});

/// //////////////////////
//  Channels Functions //
/// //////////////////////
app.post(channelsCreatePathV3, (req, res) => {
  const token: string = req.headers.token as string;
  const { name, isPublic } = req.body;
  res.json(channelsCreateAssistant(token, name, isPublic).response);
});

app.get(channelsListPathV3, (req, res, next) => {
  const token: string = req.headers.token as string;
  res.json(channelsListAssistant(token).response);
});

app.get(channelsListAllPathV3, (req, res, next) => {
  const token: string = req.headers.token as string;
  res.json(channelsListAllAssistant(token).response);
});

app.get(channelDetailsPathV3, (req, res, next) => {
  const token: string = req.headers.token as string;
  const channelId = Number(req.query.channelId as string);
  res.json(channelDetailsAssistant(token, channelId).response);
});

app.post(channelInvitePathV3, (req, res) => {
  const token: string = req.headers.token as string;
  const { channelId, uId } = req.body;
  res.json(channelInviteAssistant(token, channelId, uId).response);
});

app.post(channelJoinPathV3, (req, res) => {
  const token: string = req.headers.token as string;
  const { channelId } = req.body;
  res.json(channelJoinAssistant(token, channelId).response);
});

// Message functions
app.post(messageSendPathV2, (req, res) => {
  const token: string = req.headers.token as string;
  const { channelId, message } = req.body;
  res.json(messageSendV1Assistant(token, channelId, message).response);
});

app.put(messageEditPathV2, (req, res) => {
  const token: string = req.headers.token as string;
  const { messageId, message } = req.body;
  res.json(messageEditV1Assistant(token, messageId, message).response);
});

app.delete(messageRemovePathV2, (req, res) => {
  const token = req.headers.token as string;
  const messageId = Number(req.query.messageId as string);
  res.json(messageRemoveV1Assistant(token, messageId).response);
});

// Message functions
app.post(messageSendDmPathV2, (req, res) => {
  const token: string = req.headers.token as string;
  const { dmId, message } = req.body;
  res.json(messageSendDMV1Assistant(token, dmId, message).response);
});

app.post(channelLeavePathV2, (req, res) => {
  const token: string = req.headers.token as string;
  const { channelId } = req.body;
  res.json(channelLeaveAssistantV1(token, channelId).response);
});

app.post(channelAddownerPathV2, (req, res) => {
  const token: string = req.headers.token as string;
  const { channelId, uId } = req.body;
  res.json(addOwnerAssistantV1(token, channelId, uId).response);
});

app.post(channelRemoveownerPathV2, (req, res) => {
  const token: string = req.headers.token as string;
  const { channelId, uId } = req.body;
  res.json(removeOwnerAssistantV1(token, channelId, uId).response);
});

app.get(channelMessagesPathV3, (req, res) => {
  const token = req.headers.token as string;
  const channelId = Number(req.query.channelId as string);
  const start = Number(req.query.start as string);
  res.json(channelMessagesAssistantV2(token, channelId, start).response);
});

app.post(standupStartPathV1, (req, res) => {
  const token: string = req.headers.token as string;
  const { channelId, length } = req.body;
  res.json(standUpStartAssistant(token, channelId, length).response);
});

app.get(standupActivePathV1, (req, res) => {
  const token = req.headers.token as string;
  const channelId = Number(req.query.channelId as string);
  res.json(standUpActiveAssistant(token, channelId).response);
});

app.post(standupSendPathV1, (req, res) => {
  const token: string = req.headers.token as string;
  const { channelId, message } = req.body;
  res.json(standUpSendAssistant(token, channelId, message).response);
});

app.delete(clearPathV1, (req: Request, res: Response) => {
  clearV1();
  saveData();
  res.json({});
});

/// ////////////////////////
//  Iteration 3 Functions //
/// ////////////////////////
app.get(notificationsGetPathV1, (req, res) => {
  const token = req.headers.token as string;
  res.json(notificationsGetAssistant(token).response);
});

app.get(searchPathV1, (req, res) => {
  const token = req.headers.token as string;
  const queryStr = req.query.queryStr as string;
  res.json(searchAssistant(token, queryStr).response);
});

/// ////////////////////////
//  Message Functions     //
/// ////////////////////////
app.post(messageSharePathV1, (req, res) => {
  const token: string = req.headers.token as string;
  const { ogMessageId, message, channelId, dmId } = req.body;
  res.json(messageShareAssistant(token, ogMessageId, message, channelId, dmId).response);
  saveData();
});

app.post(messageReactPathV1, (req, res) => {
  const token: string = req.headers.token as string;
  const { messageId, reactId } = req.body;
  res.json(messageReactAssistant(token, messageId, reactId).response);
  saveData();
});

app.post(messageUnreactPathV1, (req, res) => {
  const token: string = req.headers.token as string;
  const { messageId, reactId } = req.body;
  res.json(messageUnreactAssistant(token, messageId, reactId).response);
  saveData();
});

app.post(messagePinPathV1, (req, res) => {
  const token: string = req.headers.token as string;
  const { messageId } = req.body;
  res.json(messagePinAssistant(token, messageId).response);
  saveData();
});

app.post(messageUnpinPathV1, (req, res) => {
  const token: string = req.headers.token as string;
  const { messageId } = req.body;
  res.json(messageUnpinAssistant(token, messageId).response);
  saveData();
});

app.post(messageSendLaterPathV1, (req, res) => {
  const token: string = req.headers.token as string;
  const { channelId, message, timeSent } = req.body;
  res.json(messageSendlaterAssistant(token, channelId, message, timeSent).response);
  saveData();
});

app.post(messageSendLaterDmPathV1, (req, res) => {
  const token: string = req.headers.token as string;
  const { dmId, message, timeSent } = req.body;
  res.json(messageSendlaterDmAssistant(token, dmId, message, timeSent).response);
  saveData();
});

app.post(authPasswordResetRequestPathV1, (req, res) => {
  const token: string = req.headers.token as string;
  const { email } = req.body;
  res.json(authPasswordResetRequestAssistant(token, email).response);
  saveData();
});

app.post(authPasswordResetResetPathV1, (req, res) => {
  const { resetCode, newPassword } = req.body;
  res.json(authPasswordResetResetAssistant(resetCode, newPassword).response);
  saveData();
});

app.post(userProfileUploadPhotoPathV1, (req, res) => {
  const token: string = req.headers.token as string;
  const { imgUrl, xStart, yStart, xEnd, yEnd } = req.body;
  res.json(userProfileUploadPhotoAssistant(token, imgUrl, xStart, yStart, xEnd, yEnd).response);
  saveData();
});

app.get(userStatsPathV1, (req, res) => {
  const token = req.headers.token as string;
  res.json(userStatsAssistant(token).response);
});

app.get(usersStatsPathV1, (req, res) => {
  const token = req.headers.token as string;
  res.json(usersStatsAssistant(token).response);
});

app.delete(adminUserRemovePathV1, (req: Request, res: Response) => {
  const token: string = req.headers.token as string;
  const uId = Number(req.query.uId as string);
  res.json(adminUserRemoveAssistant(token, uId).response);
});

app.post(adminUserPermissionsPathV1, (req, res) => {
  const token: string = req.headers.token as string;
  const { uId, permissionId } = req.body;
  res.json(adminUserPermissionsAssistant(token, uId, permissionId).response);
});

// FOR TESTING PURPOSES ONLY
app.get(testCodePath, (req, res, next) => {
  const authUserId = Number(req.query.authUserId as string);
  res.json(testCodeAssistant(authUserId).response);
});

restoreData();

// for photos
// access photos with url: localhost:2204(or wtv port number)/profiles/1.jpg (or wtv file name)
app.use('/profiles', express.static('src/profiles'));

// handles errors nicely
app.use(errorHandler());

// for logging errors
app.use(morgan('dev'));

// start server
const server = app.listen(PORT, HOST, () => {
  console.log(`⚡️ Server listening on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
