// ========================================================================= //
// Wrapper functions
import { getData } from '../dataStore';
import { timeSentCalculation } from '../other';
import { getEndTime } from '../standupFunctions';
import {
  requestAuthRegister,
  requestClear,
  requestChannelsCreate,
  requestMessageSendDm,
  requestMessageRemove,
  requestMessageEdit,
  requestMessageSend,
  requestDmCreate,
  requestSendDmMessage,
  requestChannelInvite,
  requestChannelJoin,
  requestChannelMessages,
  requestDmMessages,
  HTTPError400,
  HTTPError403,
  requestMessagePin,
  requestMessageUnpin,
  requestMessageSendLater,
  requestMessageSendLaterDm,
  requestMessageReact, 
  requestMessageUnreact,
  requestMessageShare,
} from '../testpaths';
// ========================================================================= //
const userJames = { email: "james@hotmail.com", password: "passwordJames", nameFirst: "James", nameLast: "Humphries"};
const userTom = { email: "tom@hotmail.com", password: "passwordTom", nameFirst: "Tom", nameLast: "Holland" };
const userMax = { email: "max@hotmail.com", password: "passwordMax", nameFirst: "Max", nameLast: "Verstappen" };
const userAndrew = {email: "andrew@gmail.com", password: "passwordAndrew", nameFirst: "Andrew", nameLast: "Taylor"};

const messageJames = "Hello darkness my old friend";
const messageJames2 = "Functional tests almost take longer than the actual scrips";

const messageBeeMovieA = "According to all known laws of aviation, there is no way that a bee should be able to fly.Its wings are too small to get its fat little body off the ground.                                     ";
const messageBeeMovieB = "The bee, of course, flies anyway because bees don't care what humans think is impossible. Cut to Barry's room, where he's picking out what to wear.                                               ";
const messageBeeMovieC = "Barry	Yellow, black. Yellow, black. Yellow, black. Yellow, black. Ooh, black and yellow! Yeah, let's shake it up a little. Barry uses honey from a dispenser to style his hair, rinse his mouth, and then applies it to his armpits."
const messageBeeMovie = messageBeeMovieA + messageBeeMovieB + messageBeeMovieC + messageBeeMovieA + messageBeeMovieB + messageBeeMovieC + messageBeeMovieA + messageBeeMovieB + messageBeeMovieC + messageBeeMovieA + messageBeeMovieB + messageBeeMovieC;
const messageExample = "I am really deprived of sleep!";

const messageShared = "I am sharing this because this is awesome!";
const timeDelay = 1;
const taggingMessage = "@maxverstappen@andrewtaylor yo what's up!"

beforeEach(() => {
  requestClear();
});

/*  Iteration 2  */
describe('message send functional tests', () => {
  
  test('message send successful', () => {
    const jamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const jamesToken = jamesObject.token;
    const channelId = requestChannelsCreate(jamesToken, 'Crunchie', true).channelId;
    expect(requestMessageSend(jamesToken, channelId, messageJames)).toStrictEqual({ messageId: expect.any(Number) });
  });
  
  test('message send successful, create 4 messages and check implementation order', () => {
    const jamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const jamesToken = jamesObject.token;
    const channelId = requestChannelsCreate(jamesToken, 'Crunchie', true).channelId;
    requestMessageSend(jamesToken, channelId, "I was first");
    requestMessageSend(jamesToken, channelId, "I was second");
    requestMessageSend(jamesToken, channelId, "I was third");
    requestMessageSend(jamesToken, channelId, "I was fourth");
    const channelMessageObject = requestChannelMessages(jamesToken, channelId, 0);
    expect(channelMessageObject.messages[0].message).toStrictEqual("I was fourth");
  });

  test('message send failure - channelId does not refer to a valid channel', () => {
    const jamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tomToken = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast).token;
    const jamesToken = jamesObject.token;
    const channelId = requestChannelsCreate(jamesToken, 'Crunchie', true).channelId;
    // - channelId does not refer to a valid channel
    expect(requestMessageSend(jamesToken, channelId + 10, messageJames).statusCode).toStrictEqual(HTTPError400);
    // - length of message is less than 1 or over 1000 characters
    expect(requestMessageSend(jamesToken,channelId, "").statusCode).toStrictEqual(HTTPError400);
    // - length of message is less than 1 or over 1000 characters
    expect(requestMessageSend(jamesToken,channelId, messageBeeMovie).statusCode).toStrictEqual(HTTPError400);
    // - channelId is valid and the authorised user is not a member of the channel
    expect(requestMessageSend(tomToken, channelId, messageJames).statusCode).toStrictEqual(HTTPError403);
  });
});

describe('message edit functional tests', () => {
  test('message edit successful', () => {
    const jamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const jamesToken = jamesObject.token;
    const channelId = requestChannelsCreate(jamesToken, 'Crunchie', true).channelId;
    const messageId = requestMessageSend(jamesToken, channelId, messageJames).messageId;
    expect(requestMessageEdit(jamesToken, messageId, messageJames2)).toStrictEqual({ });
  });

  test('message edit successful, remove the message', () => {
    const jamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const jamesToken = jamesObject.token;
    const channelId = requestChannelsCreate(jamesToken, 'Crunchie', true).channelId;
    const messageId = requestMessageSend(jamesToken, channelId, messageJames).messageId;
    expect(requestMessageEdit(jamesToken, messageId, "")).toStrictEqual({ });
  });

  test('message edit failure - length of message is over 1000 characters', () => {
    const jamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const jamesToken = jamesObject.token;
    const channelId = requestChannelsCreate(jamesToken, 'Crunchie', true).channelId;
    const messageId = requestMessageSend(jamesToken, channelId, messageJames).messageId;
    expect(requestMessageEdit(jamesToken, messageId, messageBeeMovie).statusCode).toStrictEqual(HTTPError400);
  });

  test('message edit failure - messageId does not refer to a valid message within a channel/DM that the authorised user has joined', () => {
    const jamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tomToken = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast).token;
    const jamesToken = jamesObject.token;
    const channelId = requestChannelsCreate(jamesToken, 'Crunchie', true).channelId;
    requestMessageSend(jamesToken, channelId, messageJames).messageId;
    const messageIdTom = requestMessageSend(tomToken, channelId, messageJames).messageId;
    expect(requestMessageEdit(jamesToken, messageIdTom, messageJames2).statusCode).toStrictEqual(HTTPError400);
  });

  test('message edit failure - the message was not sent by the authorised user making this request', () => {
    const jamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tomToken = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast).token;
    const jamesToken = jamesObject.token;
    const channelId = requestChannelsCreate(jamesToken, 'Crunchie', true).channelId;
    const messageId = requestMessageSend(jamesToken, channelId, messageJames).messageId;
    const messageIdTom = requestMessageSend(tomToken, channelId, messageJames).messageId;;
    expect(requestMessageEdit(tomToken, messageId, messageJames2).statusCode).toStrictEqual(HTTPError403);
  });

  test('message edit failure - the authorised user does not have owner permissions in the channel/DM', () => {
    const jamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tomToken = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast).token;
    const jamesToken = jamesObject.token;
    const channelId = requestChannelsCreate(jamesToken, 'Crunchie', true).channelId;
    const messageId = requestMessageSend(jamesToken, channelId, messageJames).messageId;
    expect(requestMessageEdit(tomToken, messageId, messageJames2).statusCode).toStrictEqual(HTTPError403);
  });
  
}); 

describe('message remove functional tests', () => {

  test('message remove failure - messageId does not refer to a valid message within a channel/DM that the authorised user has joined', () => {

    const jamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tomToken = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast).token;
    const jamesToken = jamesObject.token;
    const channelId = requestChannelsCreate(jamesToken, 'Crunchie', true).channelId;
    const messageTom = requestMessageSend(tomToken, channelId, messageBeeMovieA);
    // This fails since the user has not been added to the channel
    expect(requestMessageRemove(jamesToken, messageTom.messageId).statusCode).toStrictEqual(HTTPError400);
  });

  test('message remove failure - the message was not sent by the authorised user making this request but requestie is not in channel', () => {
    const jamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const MaxObject = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);
    const tomToken = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast).token;
    const jamesToken = jamesObject.token;

    const channelId = requestChannelsCreate(jamesToken, 'Crunchie', true).channelId;
    const messageIdTom = requestMessageSend(tomToken, channelId, messageJames).messageId;
    expect(requestMessageRemove(MaxObject.token, messageIdTom).statusCode).toStrictEqual(HTTPError400);
  });

  test('message remove failure - the message was not sent by the authorised user making this request', () => {
    const jamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tomToken = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast).token;
    const jamesToken = jamesObject.token;
    const channelId = requestChannelsCreate(jamesToken, 'Crunchie', true).channelId;
    const messageId = requestMessageSend(jamesToken, channelId, messageJames).messageId;
    requestMessageSend(tomToken, channelId, messageJames).messageId;;
    expect(requestMessageRemove(tomToken, messageId).statusCode).toStrictEqual(HTTPError403);
  });

  test('message remove success - the authorised user has owner permissions in the channel/DM', () => {
    const globalOwner = requestAuthRegister(userAndrew.email, userAndrew.password, userAndrew.nameFirst, userAndrew.nameLast);
    const jamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const MaxObject = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);
    const jamesToken = jamesObject.token;
    const channelId = requestChannelsCreate(jamesToken, 'Crunchie', true).channelId;
    expect(requestChannelInvite(jamesToken, channelId, MaxObject.authUserId)).toStrictEqual({});
    const message1 = requestMessageSend(MaxObject.token, channelId, messageBeeMovieA);

    expect(requestMessageRemove(jamesToken, message1.messageId)).toStrictEqual({});
    // Already deleated
    expect(requestMessageRemove(jamesToken, message1.messageId).statusCode).toStrictEqual(HTTPError400);
  });

  test('message remove success when two messages were present - the authorised user has owner permissions in the channel/DM', () => {
    const globalOwner = requestAuthRegister(userAndrew.email, userAndrew.password, userAndrew.nameFirst, userAndrew.nameLast);
    const jamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const MaxObject = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);

    const jamesToken = jamesObject.token;
    const channelId = requestChannelsCreate(jamesToken, 'Crunchie', true).channelId;

    expect(requestChannelInvite(jamesToken, channelId, MaxObject.authUserId)).toStrictEqual({});
    const message1 = requestMessageSend(MaxObject.token, channelId, messageBeeMovieA);

    expect(requestMessageRemove(jamesToken, message1.messageId)).toStrictEqual({});
    // Already deleated
    expect(requestMessageRemove(jamesToken, message1.messageId).statusCode).toStrictEqual(HTTPError400);
  });

  test('message remove success - removing in DM', () => {
    const jamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tomObject = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const jamesDm = requestDmCreate(jamesObject.token, [tomObject.authUserId]);
    const message1 = requestMessageSendDm(jamesObject.token, jamesDm.dmId, "Hello");

    expect(requestMessageRemove(jamesObject.token, message1.messageId)).toStrictEqual({});
  });

});

describe('message send DM functional tests', () => {

  test('message sendDm failure - length of message is over 1000 characters', () => {
    const jamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tomObject = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const maxObject = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);
    const jamesToken = jamesObject.token;
    const users = [];
    users.push(maxObject.authUserId);
		users.push(tomObject.authUserId);
    const jamesDm = requestDmCreate(jamesObject.token, users);
    expect(requestMessageSendDm(jamesToken, jamesDm.dmId, messageBeeMovie).statusCode).toStrictEqual(HTTPError400);
  });

  test('message sendDm failure - dmId is invalid', () => {
    const jamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tomObject = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const maxObject = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);
    const jamesToken = jamesObject.token;
    const users = [];
    users.push(maxObject.authUserId);
		users.push(tomObject.authUserId); 
    const jamesDm = requestDmCreate(jamesObject.token, users);
    expect(requestMessageSendDm(jamesToken, jamesDm.dmId + 10, "hello there").statusCode).toStrictEqual(HTTPError400);
 });

  test('message sendDm failure - length of message is less than 1', () => {
    const jamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tomObject = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const maxObject = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);
    const jamesToken = jamesObject.token;
    const users = [];
    users.push(maxObject.authUserId);
		users.push(tomObject.authUserId); 
    const jamesDm = requestDmCreate(jamesObject.token, users);
    expect(requestMessageSendDm(jamesToken, jamesDm.dmId, "").statusCode).toStrictEqual(HTTPError400);
 });

  test('message sendDm failure - authUserId is not in DM', () => {
    const jamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tomObject = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const maxObject = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);
    const users = [];
    users.push(maxObject.authUserId);
    const jamesDm = requestDmCreate(jamesObject.token, users);
    expect(requestMessageSendDm(tomObject.token, jamesDm.dmId, "message").statusCode).toStrictEqual(HTTPError403);
  });

  test('message sendDm successful', () => {
    const jamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tomObject = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const maxObject = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);
    const jamesToken = jamesObject.token;
    const channelId = requestChannelsCreate(jamesToken, 'Crunchie', true).channelId;
    requestMessageSend(jamesToken, channelId, "I was first").messageId;
    const users = [];
    users.push(maxObject.authUserId);
		users.push(tomObject.authUserId);
    const jamesDm = requestDmCreate(jamesObject.token, users);
    expect(requestMessageSendDm(jamesToken, jamesDm.dmId, messageJames)).toStrictEqual({ messageId: expect.any(Number) });

  });

});

// To meet time restrictions, going to combine pin and unpin tests together
describe('message pin functional tests', () => {

  test('message pin and unpin failure - Combined for increased speed', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const andrew = requestAuthRegister(userAndrew.email, userAndrew.password, userAndrew.nameFirst, userAndrew.nameLast);
    const jamesDm = requestDmCreate(james.token, [tom.authUserId]);
    const messageId = requestMessageSendDm(james.token, jamesDm.dmId, "Hello");
    const crunchie = requestChannelsCreate(james.token, "Crunchie", true);
    const jamesCh = requestMessageSend(james.token, crunchie.channelId, "crunchie");
    // - token is invalid
    expect(requestMessagePin(james.token + 1,messageId.messageId).statusCode).toStrictEqual(HTTPError403);
    // - token is invalid
    expect(requestMessageUnpin(james.token + 1,messageId.messageId).statusCode).toStrictEqual(HTTPError403);
    // - messageId is not a valid message within a channel or DM that the authorised user has joined
    expect(requestMessagePin(james.token ,messageId.messageId + 10).statusCode).toStrictEqual(HTTPError400);
    // - messageId is not a valid message within a channel or DM that the authorised user has joined
    expect(requestMessagePin(james.token ,jamesCh.messageId + 10).statusCode).toStrictEqual(HTTPError400);

    // - the message is not already pinned
    expect(requestMessageUnpin(james.token,messageId.messageId).statusCode).toStrictEqual(HTTPError400);
    // - the message is not already pinned
    expect(requestMessageUnpin(james.token,jamesCh.messageId).statusCode).toStrictEqual(HTTPError400);

    // Toggle the pin
    requestMessagePin(james.token,messageId.messageId);
    requestMessagePin(james.token,jamesCh.messageId);
    // - the message is already pinned
    expect(requestMessagePin(james.token,messageId.messageId).statusCode).toStrictEqual(HTTPError400);
    // - the message is already pinned
    expect(requestMessagePin(james.token,jamesCh.messageId).statusCode).toStrictEqual(HTTPError400);

    // - messageId refers to a valid message in a joined channel/DM and the authorised user does not have owner permissions in the channel/DM
    expect(requestMessagePin(andrew.token,messageId.messageId).statusCode).toStrictEqual(HTTPError403);
    // - messageId refers to a valid message in a joined channel/DM and the authorised user does not have owner permissions in the channel/DM
    expect(requestMessagePin(andrew.token ,jamesCh.messageId).statusCode).toStrictEqual(HTTPError403);

    // - messageId is not a valid message within a channel or DM that the authorised user has joined
    expect(requestMessageUnpin(james.token ,messageId.messageId + 10).statusCode).toStrictEqual(HTTPError400);
    // - messageId is not a valid message within a channel or DM that the authorised user has joined
    expect(requestMessageUnpin(james.token ,jamesCh.messageId + 10).statusCode).toStrictEqual(HTTPError400);

    // - messageId refers to a valid message in a joined channel/DM and the authorised user does not have owner permissions in the channel/DM
    expect(requestMessageUnpin(andrew.token,messageId.messageId).statusCode).toStrictEqual(HTTPError403);
    // - messageId refers to a valid message in a joined channel/DM and the authorised user does not have owner permissions in the channel/DM
    expect(requestMessageUnpin(andrew.token ,jamesCh.messageId).statusCode).toStrictEqual(HTTPError403);

    // Valid unpin
    expect(requestMessageUnpin(james.token ,jamesCh.messageId)).toStrictEqual({});

  });

});


describe('message sendlater channel functional tests', () => {

  test('message sendlater failure - invalid token', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const crunchie = requestChannelsCreate(james.token, "Crunchie", true);
    const timeSend = getEndTime(timeDelay);
    expect(requestMessageSendLater(james.token + 1, crunchie.channelId,  "hello there", timeSend).statusCode).toStrictEqual(HTTPError403);
  });

  test('message sendlater failure - channelId does not refer to a valid channel', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const crunchie = requestChannelsCreate(james.token, "Crunchie", true);
    const timeSend = getEndTime(timeDelay);
    expect(requestMessageSendLater(james.token, crunchie.channelId + 10,  "hello there", timeSend).statusCode).toStrictEqual(HTTPError400);
  });

  test('message sendlater failure - length of message is less than 1 or over 1000 characters', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const crunchie = requestChannelsCreate(james.token, "Crunchie", true);
    const timeSend = getEndTime(timeDelay);
    expect(requestMessageSendLater(james.token, crunchie.channelId,  "", timeSend).statusCode).toStrictEqual(HTTPError400);
  });

  test('message sendlater failure - length of message is less than 1 or over 1000 characters', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const crunchie = requestChannelsCreate(james.token, "Crunchie", true);
    const timeSend = getEndTime(timeDelay);
    expect(requestMessageSendLater(james.token, crunchie.channelId,  messageBeeMovie, timeSend).statusCode).toStrictEqual(HTTPError400);
  });

  test('message sendlater failure - timeSent is a time in the past', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const crunchie = requestChannelsCreate(james.token, "Crunchie", true);
    const timeSend = getEndTime(-10);
    expect(requestMessageSendLater(james.token, crunchie.channelId,  "hello there", timeSend).statusCode).toStrictEqual(HTTPError400);
  });

  test('message sendlater failure - channelId is valid and the authorised user is not a member of the channel they are trying to post to', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const crunchie = requestChannelsCreate(james.token, "Crunchie", true);
    const timeSend = getEndTime(timeDelay);
    expect(requestMessageSendLater(tom.token, crunchie.channelId,  "hello there", timeSend).statusCode).toStrictEqual(HTTPError403);
  });

  test('message sendlater success - wait time for message to arrive', async () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const crunchie = requestChannelsCreate(james.token, "Crunchie", true);

    const timeSend = getEndTime(timeDelay);
    requestMessageSend(james.token, crunchie.channelId, "Baseline Message");
    const messageId = requestMessageSendLater(james.token, crunchie.channelId,  "hello there This message is being sent late", timeSend);
    requestMessageSend(james.token, crunchie.channelId, "Cheecky Message");
    await awaitTimeout(timeDelay * 3);
    expect(requestMessageRemove(james.token, messageId.messageId)).toStrictEqual({});
  });


});

describe('message sendlaterDm functional tests', () => {

  test('message sendlaterDm failure - invalid token', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const jamesDm = requestDmCreate(james.token, [tom.authUserId]);
    const timeSend = getEndTime(timeDelay);
    expect(requestMessageSendLaterDm(james.token + 1, jamesDm.dmId,  "hello there", timeSend).statusCode).toStrictEqual(HTTPError403);
  });

  test('message sendlaterDm failure - dmId does not refer to a valid DM', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const jamesDm = requestDmCreate(james.token, [tom.authUserId]);
    const timeSend = getEndTime(timeDelay);
    expect(requestMessageSendLaterDm(james.token, jamesDm.dmId + 10,  "hello there", timeSend).statusCode).toStrictEqual(HTTPError400);
  });

  test('message sendlaterDm failure - length of message is less than 1 or over 1000 characters', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const jamesDm = requestDmCreate(james.token, [tom.authUserId]);
    const timeSend = getEndTime(timeDelay);
    expect(requestMessageSendLaterDm(james.token, jamesDm.dmId,  "", timeSend).statusCode).toStrictEqual(HTTPError400);
  });

  test('message sendlaterDm failure - length of message is less than 1 or over 1000 characters', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const jamesDm = requestDmCreate(james.token, [tom.authUserId]);
    const timeSend = getEndTime(timeDelay);
    expect(requestMessageSendLaterDm(james.token, jamesDm.dmId,  messageBeeMovie, timeSend).statusCode).toStrictEqual(HTTPError400);
  });

  test('message sendlaterDm failure - timeSent is a time in the past', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const jamesDm = requestDmCreate(james.token, [tom.authUserId]);
    const timeSend = getEndTime(-20);
    expect(requestMessageSendLaterDm(james.token, jamesDm.dmId,  "hello there", timeSend).statusCode).toStrictEqual(HTTPError400);
  });

  test('message sendlaterDm failure - dmId is valid and the authorised user is not a member of the DM they are trying to post to', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const andrew = requestAuthRegister(userAndrew.email, userAndrew.password, userAndrew.nameFirst, userAndrew.nameLast);
    const jamesDm = requestDmCreate(james.token, [tom.authUserId]);
    const timeSend = getEndTime(timeDelay);
    expect(requestMessageSendLaterDm(andrew.token, jamesDm.dmId,  "hello there", timeSend).statusCode).toStrictEqual(HTTPError403);
  });
  
  test('message sendlaterDm success - wait time for message to arrive', async () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const timeSend = getEndTime(timeDelay);
    const jamesDm = requestDmCreate(james.token, [tom.authUserId]);
    requestMessageSendDm(james.token, jamesDm.dmId,  "Baseline Message");
    const messageId = requestMessageSendLaterDm(james.token, jamesDm.dmId,  "Sending Later", timeSend);
    requestMessageSendDm(james.token, jamesDm.dmId,  "Checky Message");
    await awaitTimeout(timeDelay * 3);
    const dmMessageObject = requestDmMessages(james.token, jamesDm.dmId, 0);
    expect(dmMessageObject.messages[0].messageId).toStrictEqual(messageId.messageId);
  });
  
});

describe ('Message React Tests', () => {
  test('Error with message ID - dm', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const jamesDm = requestDmCreate(james.token, [tom.authUserId]);
    requestMessageSendDm(james.token, jamesDm.dmId,  "Message To React To");
    expect(requestMessageReact(tom.token, (jamesDm.dmId + 1), 1)).toStrictEqual({statusCode: HTTPError400});
  }); 
  test('Error with message ID - channel', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const channel = requestChannelsCreate(james.token, "Testchannel", true);
    const jamesCh = requestMessageSend(james.token, channel.channelId, "crunchie");
    expect(requestMessageReact(james.token, (jamesCh.messageId + 1), 1)).toStrictEqual({statusCode: HTTPError400});
  }); 
  test('React ID is invalid - not equal to 1.', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const channel = requestChannelsCreate(james.token, "Testchannel", true);
    const jamesCh = requestMessageSend(james.token, channel.channelId, "crunchie");
    expect(requestMessageReact(james.token, jamesCh.messageId, 999)).toStrictEqual({statusCode: HTTPError400});
  }); 
  test('User in CHANNEL already reacted', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const channel = requestChannelsCreate(james.token, "Testchannel", true);
    const jamesCh = requestMessageSend(james.token, channel.channelId, "crunchie");
    requestMessageReact(james.token, jamesCh.messageId, 1);
    expect(requestMessageReact(james.token, jamesCh.messageId, 1)).toStrictEqual({statusCode: HTTPError400});
  }); 
  test('User in DM already reacted', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const andrew = requestAuthRegister(userAndrew.email, userAndrew.password, userAndrew.nameFirst, userAndrew.nameLast);
    const jamesDm = requestDmCreate(james.token, [tom.authUserId]);
    const messageId = requestMessageSendDm(james.token, jamesDm.dmId, "Hello");
    requestMessageReact(tom.token, messageId.messageId, 1);
    expect(requestMessageReact(tom.token, messageId.messageId, 1)).toStrictEqual({statusCode: HTTPError400});
  }); 
  test('Working For channel', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const channel = requestChannelsCreate(james.token, "Testchannel", true);
    const jamesCh = requestMessageSend(james.token, channel.channelId, "crunchie");
    expect(requestMessageReact(james.token, jamesCh.messageId, 1)).toStrictEqual({});
    expect(requestMessageUnreact(james.token, jamesCh.messageId, 1)).toStrictEqual({});
  }); 
  test('Working For Dm', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const jamesDm = requestDmCreate(james.token, [tom.authUserId]);
    requestMessageSendDm(james.token,jamesDm.dmId, "Dm Message for Reactions");
    expect(requestMessageReact(tom.token, jamesDm.dmId, 1)).toStrictEqual({});
    expect(requestMessageUnreact(tom.token, jamesDm.dmId, 1)).toStrictEqual({});
  }); 
});

describe ('Message Unreact Tests', () => {
  test('Error with message ID - dm', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const jamesDm = requestDmCreate(james.token, [tom.authUserId]);
    const messageId = requestMessageSendDm(james.token, jamesDm.dmId, "Hello");
    expect(requestMessageUnreact(tom.token, (messageId.messageId + 1), 1)).toStrictEqual({statusCode: 400});
  }); 
  test('Error with message ID - channel', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const channel = requestChannelsCreate(james.token, "Testchannel", true);
    const jamesCh = requestMessageSend(james.token, channel.channelId, "crunchie");
    requestMessageReact(james.token, jamesCh.messageId, 1);
    expect(requestMessageUnreact(james.token, (jamesCh.messageId + 1), 1)).toStrictEqual({statusCode: 400});
  }); 
  test('Invalid react Id', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const channel = requestChannelsCreate(james.token, "Testchannel", true);
    const jamesCh = requestMessageSend(james.token, channel.channelId, "crunchie");
    requestMessageReact(james.token, jamesCh.messageId, 1);
    expect(requestMessageUnreact(james.token, jamesCh.messageId, -1)).toStrictEqual({statusCode: 400});
  });
  test('React does not exist in channel', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const channel = requestChannelsCreate(james.token, "Testchannel", true);
    const jamesCh = requestMessageSend(james.token, channel.channelId, "crunchie");
    expect(requestMessageUnreact(james.token, jamesCh.messageId, 1)).toStrictEqual({statusCode: 400});
  });
  test('React does not exist in dm', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const jamesDm = requestDmCreate(james.token, [tom.authUserId]);
    const messageId = requestMessageSendDm(james.token, jamesDm.dmId, "Hello");
    expect(requestMessageUnreact(tom.token, messageId.messageId, 1)).toStrictEqual({statusCode: 400});
  });
  test('Working For channel', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const channel = requestChannelsCreate(james.token, "Testchannel", true);
    const jamesCh = requestMessageSend(james.token, channel.channelId, "crunchie");
    expect(requestMessageReact(james.token, jamesCh.messageId, 1)).toStrictEqual({});
    expect(requestMessageUnreact(james.token, jamesCh.messageId, 1)).toStrictEqual({});
    expect(requestMessageReact(james.token, jamesCh.messageId, 1)).toStrictEqual({});
  }); 
  test('Working For Dm', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const jamesDm = requestDmCreate(james.token, [tom.authUserId]);
    const messageId = requestMessageSendDm(james.token, jamesDm.dmId, "Hello");
    expect(requestMessageReact(tom.token, messageId.messageId, 1)).toStrictEqual({});
    expect(requestMessageUnreact(tom.token, messageId.messageId, 1)).toStrictEqual({});
    expect(requestMessageReact(tom.token, messageId.messageId, 1)).toStrictEqual({});
  }); 
});

describe('message share test', () => {
  test('invalid input 400 - both channelId and dmId are invalid', () => {
		// user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    // user3 should have uId = 3
    const user3 = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);

    // makes channel called testchannel1 by user1, member is user1 and user2
    const channel1 = requestChannelsCreate(user1.token, "testchannel1", true);
    requestChannelJoin(user2.token, channel1.channelId);
    const message1 = requestMessageSend(user1.token, channel1.channelId, messageBeeMovieA);
    
    // makes a new dm consisting of all users
		const dmId1 = requestDmCreate(user2.token, [user1.authUserId, user3.authUserId]);
    const message2 = requestSendDmMessage(user2.token, dmId1.dmId, messageBeeMovieC);
    
    expect(requestMessageShare(user3.token, message1.messageId, messageShared, -1, dmId1.dmId  + 10).statusCode).toStrictEqual(HTTPError400);
  });
  test('invalid input 400 - both channelId and dmId are not -1', () => {
		// user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    // user3 should have uId = 3
    const user3 = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);

    // makes channel called testchannel1 by user1, member is user1 and user2
    const channel1 = requestChannelsCreate(user1.token, "testchannel1", true);
    requestChannelJoin(user2.token, channel1.channelId);
    const message1 = requestMessageSend(user1.token, channel1.channelId, messageBeeMovieA);
    
    // makes a new dm consisting of all users
		const dmId1 = requestDmCreate(user2.token, [user1.authUserId, user3.authUserId]);
    const message2 = requestSendDmMessage(user2.token, dmId1.dmId, messageBeeMovieC);
    
    expect(requestMessageShare(user3.token, message1.messageId, messageShared, channel1.channelId, dmId1.dmId).statusCode).toStrictEqual(HTTPError400);
  });
  test('invalid input 400 - length of message invalid', () => {
		// user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    // user3 should have uId = 3
    const user3 = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);

    // makes channel called testchannel1 by user1, member is user1 and user2
    const channel1 = requestChannelsCreate(user1.token, "testchannel1", true);
    requestChannelJoin(user2.token, channel1.channelId);
    const message1 = requestMessageSend(user1.token, channel1.channelId, messageBeeMovieA);
    
    // makes a new dm consisting of all users
		const dmId1 = requestDmCreate(user2.token, [user1.authUserId, user3.authUserId]);
    const message2 = requestSendDmMessage(user2.token, dmId1.dmId, messageBeeMovieC);
    
    const message = `this is just a test, do not think heavily of this at all. this is just a test, do not think heavily of 
                    this at all. this is just a test, do not think heavily of this at all. this is just a test, do not think 
                    heavily of this at all. this is just a test, do not think heavily of this at all. this is just a test, do 
                    not think heavily of this at all. this is just a test, do not think heavily of this at all. this is just 
                    a test, do not think heavily of this at all. this is just a test, do not think heavily of this at all. 
                    this is just a test, do not think heavily of this at all. this is just a test, do not think heavily of 
                    this at all. this is just a test, do not think heavily of this at all. this is just a test, do not think 
                    heavily of this at all. this is just a test, do not think heavily of this at all. this is just a test, 
                    do not think heavily of this at all. this is just a test, do not think heavily of this at all. this is 
                    just a test, do not think heavily of this at all. this is just a test, do not think heavily of this at all.`;

    expect(requestMessageShare(user3.token, message1.messageId, message, -1, dmId1.dmId).statusCode).toStrictEqual(HTTPError400);
  });
  test('invalid input 400 - messageId does not exist entirely', () => {
		// user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    // user3 should have uId = 3
    const user3 = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);

    // makes channel called testchannel1 by user1, member is user1 and user2
    const channel1 = requestChannelsCreate(user1.token, "testchannel1", true);
    requestChannelJoin(user2.token, channel1.channelId);
    const message1 = requestMessageSend(user1.token, channel1.channelId, messageBeeMovieA);
    
    // makes channel called testchannel2 by user2, member is user2 and user3
    const channel2 = requestChannelsCreate(user2.token, "testchannel2", true);
    requestChannelJoin(user3.token, channel2.channelId);
    const message2 = requestMessageSend(user2.token, channel2.channelId, messageBeeMovieB);
    
    // from channel1 to channel2 (message1) by user2
    expect(requestMessageShare(user2.token, message1.messageId + 1000, messageShared, channel2.channelId, -1).statusCode).toStrictEqual(HTTPError400);
  });
  test('invalid input 400 - ogMessageId does not refer to a valid message within a channel/DM user is enrolled in', () => {
		// user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    // user3 should have uId = 3
    const user3 = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);

    // makes channel called testchannel1 by user1, member is user1 and user2
    const channel1 = requestChannelsCreate(user1.token, "testchannel1", true);
    requestChannelJoin(user2.token, channel1.channelId);
    requestMessageSend(user1.token, channel1.channelId, messageBeeMovieA);
    
    // makes a new dm consisting of users 2 and 3
		const dmId1 = requestDmCreate(user2.token, [user3.authUserId]);
    const message2 = requestSendDmMessage(user2.token, dmId1.dmId, messageBeeMovieC);
    
    // expect(requestMessageShare(user3.token, message1.messageId, messageShared, -1, dmId1.dmId).statusCode).toStrictEqual(HTTPError400);
    expect(requestMessageShare(user1.token, message2.messageId, messageShared, channel1.channelId, -1).statusCode).toStrictEqual(HTTPError400);
  });
  test('invalid input 403 - target channel does not have user as a member', () => {
		// user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    // user3 should have uId = 3
    const user3 = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);

    // makes channel called testchannel1 by user1, member is user1
    const channel1 = requestChannelsCreate(user1.token, "testchannel1", true);
    requestMessageSend(user1.token, channel1.channelId, messageBeeMovieA);
    
    // makes a new dm consisting of all users
		const dmId1 = requestDmCreate(user2.token, [user1.authUserId, user3.authUserId]);
    const message2 = requestSendDmMessage(user2.token, dmId1.dmId, messageBeeMovieC);
    
    expect(requestMessageShare(user3.token, message2.messageId, messageShared, channel1.channelId, -1).statusCode).toStrictEqual(HTTPError403);
  });
  test('invalid input 403 - target DM does not have user as a member', () => {
		// user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    // user3 should have uId = 3
    const user3 = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);

    // makes channel called testchannel1 by user1, member is user1
    const channel1 = requestChannelsCreate(user1.token, "testchannel1", true);
    const message1 = requestMessageSend(user1.token, channel1.channelId, messageBeeMovieA);
    
    // makes a new dm consisting of users 2 and 3
		const dmId1 = requestDmCreate(user2.token, [user3.authUserId]);
    requestSendDmMessage(user2.token, dmId1.dmId, messageBeeMovieC);
    
    expect(requestMessageShare(user1.token, message1.messageId, messageShared, -1, dmId1.dmId).statusCode).toStrictEqual(HTTPError403);
  });
  
  test('valid input - sharing between DMs', () => {
		// user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    // user3 should have uId = 3
    const user3 = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);

    // makes a new dm consisting of all users
		const dmId1 = requestDmCreate(user2.token, [user1.authUserId, user3.authUserId]);
    const message1 = requestSendDmMessage(user2.token, dmId1.dmId, messageBeeMovieC);
    
    // makes a new dm consisting of users 1 and 3
    const dmId2 = requestDmCreate(user1.token, [user3.authUserId]);
    const message2 = requestSendDmMessage(user1.token, dmId2.dmId, messageExample);
    
    // from dm2 to dm1 (message2) by user1
    const newMessage = requestMessageShare(user1.token, message2.messageId, messageShared, -1, dmId1.dmId);
    const dmMessages = requestDmMessages(user1.token, dmId1.dmId, 0);
    const dmMessageIds = [];
    for (const element in dmMessages.messages) {
      dmMessageIds.push(dmMessages.messages[element].messageId);
    }
    expect(newMessage.messageId).toStrictEqual(expect.any(Number));
    expect(dmMessageIds).toContain(newMessage.messageId);
  });
  test('valid input - sharing between channels', () => {
		// user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    // user3 should have uId = 3
    const user3 = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);

    // makes channel called testchannel1 by user1, member is user1 and user2
    const channel1 = requestChannelsCreate(user1.token, "testchannel1", true);
    requestChannelJoin(user2.token, channel1.channelId);
    const message1 = requestMessageSend(user1.token, channel1.channelId, messageBeeMovieA);
    
    // makes channel called testchannel2 by user2, member is user2 and user3
    const channel2 = requestChannelsCreate(user2.token, "testchannel2", true);
    requestChannelJoin(user3.token, channel2.channelId);
    const message2 = requestMessageSend(user2.token, channel2.channelId, messageBeeMovieB);
    
    // from channel1 to channel2 (message1) by user2
    const newMessage = requestMessageShare(user2.token, message1.messageId, messageShared, channel2.channelId, -1);
    const channelMessages = requestChannelMessages(user2.token, channel2.channelId, 0);
    const channelMessageIds = [];
    for (const element in channelMessages.messages) {
      channelMessageIds.push(channelMessages.messages[element].messageId);
    }
    expect(newMessage.messageId).toStrictEqual(expect.any(Number));
    expect(channelMessageIds).toContain(newMessage.messageId);
  });

  test('valid input - sharing from channel to DM', () => {
		// user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    // user3 should have uId = 3
    const user3 = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);

    // makes channel called testchannel1 by user1, member is user1 and user2
    const channel1 = requestChannelsCreate(user1.token, "testchannel1", true);
    requestChannelJoin(user2.token, channel1.channelId);
    const message1 = requestMessageSend(user1.token, channel1.channelId, messageBeeMovieA);
    
    // makes a new dm consisting of all users
		const dmId1 = requestDmCreate(user2.token, [user1.authUserId, user3.authUserId]);
    const message2 = requestSendDmMessage(user2.token, dmId1.dmId, messageBeeMovieC);
    
    // from channel1 to dmId1 (message1) by user2
    const newMessage = requestMessageShare(user2.token, message1.messageId, messageShared, -1, dmId1.dmId);
    const dmMessages = requestDmMessages(user2.token, dmId1.dmId, 0);
    const dmMessageIds = [];
    for (const element in dmMessages.messages) {
      dmMessageIds.push(dmMessages.messages[element].messageId);
    }
    expect(newMessage.messageId).toStrictEqual(expect.any(Number));
    expect(dmMessageIds).toContain(newMessage.messageId);
  });
  test('valid input - sharing from DM to channel', () => {
		// user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    // user3 should have uId = 3
    const user3 = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);

    // makes channel called testchannel1 by user1, member is user1 and user2
    const channel1 = requestChannelsCreate(user1.token, "testchannel1", true);
    requestChannelJoin(user2.token, channel1.channelId);
    const message1 = requestMessageSend(user1.token, channel1.channelId, messageBeeMovieA);
    
    // makes a new dm consisting of all users
		const dmId1 = requestDmCreate(user2.token, [user1.authUserId, user3.authUserId]);
    const message2 = requestSendDmMessage(user2.token, dmId1.dmId, messageBeeMovieC);
    
    // from dmId1 to channel1 (message1) by user2
    const newMessage = requestMessageShare(user2.token, message2.messageId, messageShared, channel1.channelId, -1);
    const channelMessages = requestChannelMessages(user2.token, channel1.channelId, 0);
    const channelMessageIds = [];
    for (const element in channelMessages.messages) {
      channelMessageIds.push(channelMessages.messages[element].messageId);
    }
    expect(newMessage.messageId).toStrictEqual(expect.any(Number));
    expect(channelMessageIds).toContain(newMessage.messageId);
  });
  test('valid input - sharing to same channel/DM as origin', () => {
		// user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);

    // makes channel called testchannel1 by user1, member is user1 and user2
    const channel1 = requestChannelsCreate(user1.token, "testchannel1", true);
    requestChannelJoin(user2.token, channel1.channelId);
    const message1 = requestMessageSend(user1.token, channel1.channelId, messageBeeMovieA);
    
    // from channel1 to channel1 (message1) by user2
    const newMessage = requestMessageShare(user2.token, message1.messageId, messageShared, channel1.channelId, -1);
    const channelMessages = requestChannelMessages(user2.token, channel1.channelId, 0);
    const channelMessageIds = [];
    for (const element in channelMessages.messages) {
      channelMessageIds.push(channelMessages.messages[element].messageId);
    }
    expect(newMessage.messageId).toStrictEqual(expect.any(Number));
    expect(channelMessageIds).toContain(newMessage.messageId);
  });

});
  

const awaitTimeout = (delay: number) =>
  new Promise(resolve => setTimeout(resolve, delay * 1000));

