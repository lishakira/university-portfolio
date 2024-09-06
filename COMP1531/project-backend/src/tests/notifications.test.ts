import { timeSentCalculation } from '../other';
import { getEndTime } from '../standupFunctions';
import {
  requestAuthRegister,
  requestClear,
  requestUserProfile,
  requestChannelsCreate,
  requestChannelsList,
  requestChannelsListAll,
  requestMessageSendDm,
  requestMessageRemove,
  requestMessageEdit,
  requestMessageSend,
  requestMessageShare,
  requestDmCreate,
  requestDmList,
  requestDmRemove,
  requestDmDetails,
  requestDmLeave,
  requestSendDmMessage,
  requestChannelInvite,
  requestChannelDetails,
  requestChannelJoin,
  requestChannelLeave,
  requestAddOwner,
  requestRemoveOwner,
  requestChannelMessages,
  requestUsersAll,
  requestDmMessages,
  HTTPError400,
  HTTPError403,
  requestMessagePin,
  requestMessageUnpin,
  requestMessageSendLater,
  requestMessageSendLaterDm,
  requestMessageReact, 
  requestMessageUnreact,
  requestNotificationsGet,
} from '../testpaths';

const errorResponse = { error: 'error' };
const OK = 200;
const userJames = { email: "james@hotmail.com", password: "password", nameFirst: "James", nameLast: "Humphries"};
const userTom = { email: "tom@hotmail.com", password: "password", nameFirst: "Tom", nameLast: "Holland" };
const userMax = { email: "max@hotmail.com", password: "password", nameFirst: "Max", nameLast: "Verstappen" };
const userAndrew = {email: "andrew@gmail.com", password: "password", nameFirst: "Andrew", nameLast: "Taylor"};
const messageJames = "Hello darkness my old friend";
const messageJames2 = "Functional tests almost take longer than the actual scrips";
const badUserExample = { email: "apple", password: "password", nameFirst: "James", nameLast: "Humphries" };

const messageBeeMovieA = "According to all known laws of aviation, there is no way that a bee should be able to fly.Its wings are too small to get its fat little body off the ground.                                     ";
const messageBeeMovieB = "The bee, of course, flies anyway because bees don't care what humans think is impossible. Cut to Barry's room, where he's picking out what to wear.                                               ";
const messageBeeMovieC = "Barry	Yellow, black. Yellow, black. Yellow, black. Yellow, black. Ooh, black and yellow! Yeah, let's shake it up a little. Barry uses honey from a dispenser to style his hair, rinse his mouth, and then applies it to his armpits."
const messageBeeMovie = messageBeeMovieA + messageBeeMovieB + messageBeeMovieC + messageBeeMovieA + messageBeeMovieB + messageBeeMovieC + messageBeeMovieA + messageBeeMovieB + messageBeeMovieC + messageBeeMovieA + messageBeeMovieB + messageBeeMovieC;

beforeEach(() => {
    requestClear();
  });

describe('Notifications tests', () => {
  
  test('no notifications', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    expect(requestNotificationsGet(james.token)).toStrictEqual({notifications: []});
  });
  test('Message to channel', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const crunchie = requestChannelsCreate(james.token, "Crunchie", true);
    const channelAdd = requestChannelInvite(james.token, crunchie.channelId, tom.authUserId); // notifications shoudl be called here with 
    expect(requestNotificationsGet(tom.token)).toStrictEqual({notifications: [{channelId: crunchie.channelId, dmId: -1, notificationMessage: `jameshumphries added you to Crunchie`}]});
  });
  test('Message to dm', () => {
    const jamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tomObject = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const jamesDm = requestDmCreate(jamesObject.token, [tomObject.authUserId]);
    expect(requestNotificationsGet(tomObject.token)).toStrictEqual({notifications: [{channelId: -1, dmId: jamesDm.dmId, notificationMessage: `jameshumphries added you to jameshumphries, tomholland` }]});
  });
  test('Message react to channel', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const crunchie = requestChannelsCreate(james.token, "Crunchie", true);
    const channelAdd = requestChannelInvite(james.token, crunchie.channelId, tom.authUserId);
    const message = requestMessageSend(tom.token, crunchie.channelId, "I was first");
    requestMessageReact(james.token, message.messageId, 1);
    expect(requestNotificationsGet(tom.token)).toStrictEqual({notifications: [{channelId: crunchie.channelId, dmId: -1, notificationMessage: `jameshumphries reacted to your message in Crunchie` }, {channelId: crunchie.channelId, dmId: -1, notificationMessage: `jameshumphries added you to Crunchie`}]});
  });
  test('Message react to dm', () => {
    const jamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tomObject = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const jamesDm = requestDmCreate(jamesObject.token, [tomObject.authUserId]);
    const messageId = requestMessageSendDm(tomObject.token, jamesDm.dmId, "Hello");
    requestMessageReact(jamesObject.token, messageId.messageId, 1);
    expect(requestNotificationsGet(tomObject.token)).toStrictEqual({notifications: [{channelId: -1, dmId: jamesDm.dmId, notificationMessage: `jameshumphries reacted to your message in jameshumphries, tomholland` }, {channelId: -1, dmId: jamesDm.dmId, notificationMessage: `jameshumphries added you to jameshumphries, tomholland` } ]});
  })
  
 
  test('tagged user is not in the channel the message is in', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const crunchie = requestChannelsCreate(james.token, "Crunchie", true);
    const messageId = requestMessageSend(james.token, crunchie.channelId, "I was first @tomholland");
    expect(requestNotificationsGet(tom.token)).toStrictEqual({notifications: []});
  });
  test('tagged user is not in the DM the message is in', () => {
    const jamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tomObject = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const jamesDm = requestDmCreate(jamesObject.token, []);
    const messageId = requestMessageSendDm(jamesObject.token, jamesDm.dmId, "Hello @tomholland");
    const output = (requestNotificationsGet(tomObject.token));
    expect(output).toStrictEqual({notifications: []});
  });
  test('tagged user does not exists', () => {
    const jamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tomObject = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const jamesDm = requestDmCreate(jamesObject.token, [tomObject.authUserId]);
    const messageId = requestMessageSendDm(jamesObject.token, jamesDm.dmId, "Hello @maxverstappen");
    const output = (requestNotificationsGet(tomObject.token));
    expect(output).toStrictEqual({notifications: [
      {
        "channelId": -1,
        "dmId": 1,
        "notificationMessage": "jameshumphries added you to jameshumphries, tomholland",
      }
    ]});
  });
  test('message tagged in channel', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const crunchie = requestChannelsCreate(james.token, "Crunchie", true);
    const channelAdd1 = requestChannelJoin(tom.token, crunchie.channelId);
    const messageId = requestMessageSend(james.token, crunchie.channelId, "I was first @tomholland");
    expect(requestNotificationsGet(tom.token)).toStrictEqual({notifications: [{channelId: crunchie.channelId, dmId: -1, notificationMessage: `jameshumphries tagged you in Crunchie: I was first @tomholl` }]});
  });
  test('message tagged in dm', () => {
    const jamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tomObject = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const jamesDm = requestDmCreate(jamesObject.token, [tomObject.authUserId]);
    const messageId = requestMessageSendDm(jamesObject.token, jamesDm.dmId, "Hello @tomholland");
    const output = (requestNotificationsGet(tomObject.token));
    expect(output).toStrictEqual(
      {notifications: [
        {
        channelId: -1, 
        dmId: jamesDm.dmId, 
        notificationMessage: `jameshumphries tagged you in jameshumphries, tomholland: Hello @tomholland` 
        },
        {
        channelId: -1, 
        dmId: jamesDm.dmId, 
        notificationMessage: `jameshumphries added you to jameshumphries, tomholland` 
        }
    ]});
  });
  test('message tagged in channel - message tags multiple people', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const max = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);
    const crunchie = requestChannelsCreate(james.token, "Crunchie", true);
    const channelAdd1 = requestChannelJoin(tom.token, crunchie.channelId);
    const channelAdd2 = requestChannelJoin(max.token, crunchie.channelId);
    const messageId = requestMessageSend(james.token, crunchie.channelId, "I was first @tomholland@maxverstappen");
    // console.log(requestChannelDetails(james.token, crunchie.channelId));
    expect(requestNotificationsGet(tom.token)).toStrictEqual({notifications: [{channelId: crunchie.channelId, dmId: -1, notificationMessage: `jameshumphries tagged you in Crunchie: I was first @tomholl` }]});
    expect(requestNotificationsGet(max.token)).toStrictEqual({notifications: [{channelId: crunchie.channelId, dmId: -1, notificationMessage: `jameshumphries tagged you in Crunchie: I was first @tomholl` }]});
  });
  test('message tagged in channel - using messageEdit', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const crunchie = requestChannelsCreate(james.token, "Crunchie", true);
    const channelAdd1 = requestChannelJoin(tom.token, crunchie.channelId);
    const messageId = requestMessageSend(james.token, crunchie.channelId, "I was first");
    expect(requestNotificationsGet(tom.token)).toStrictEqual({notifications: []});
    requestMessageEdit(james.token, messageId.messageId, "I was first @tomholland");
    expect(requestNotificationsGet(tom.token)).toStrictEqual({notifications: [{channelId: crunchie.channelId, dmId: -1, notificationMessage: `jameshumphries tagged you in Crunchie: I was first @tomholl` }]});
  });
  test('message tagged in dm - using messageEdit', () => {
    const jamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tomObject = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const jamesDm = requestDmCreate(jamesObject.token, [tomObject.authUserId]);
    const messageId = requestMessageSendDm(jamesObject.token, jamesDm.dmId, "Hello");
    expect(requestNotificationsGet(tomObject.token)).toStrictEqual({notifications: [{channelId: -1, dmId: jamesDm.dmId, notificationMessage: `jameshumphries added you to jameshumphries, tomholland` }]});

    expect(requestNotificationsGet(tomObject.token)).toStrictEqual({notifications: [{
      channelId: -1, 
      dmId: jamesDm.dmId, 
      notificationMessage: `jameshumphries added you to jameshumphries, tomholland` 
      }
    ]});
    requestMessageEdit(jamesObject.token, messageId.messageId, "Hello @tomholland");
    const output = (requestNotificationsGet(tomObject.token));
    expect(output).toStrictEqual(
      {notifications: [
        {
        channelId: -1, 
        dmId: jamesDm.dmId, 
        notificationMessage: `jameshumphries tagged you in jameshumphries, tomholland: Hello @tomholland` 
        },
        {
        channelId: -1, 
        dmId: jamesDm.dmId, 
        notificationMessage: `jameshumphries added you to jameshumphries, tomholland` 
        }
    ]});
  });
  test('tagging using messageShare', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const max = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);
    
    const crunchie = requestChannelsCreate(james.token, "Crunchie", true);
    const channelAdd1 = requestChannelJoin(tom.token, crunchie.channelId);
    const messageId = requestMessageSend(james.token, crunchie.channelId, "I was first");
    
    const testChannel = requestChannelsCreate(tom.token, "Testing", true);
    const channelAdd2 = requestChannelJoin(max.token, testChannel.channelId);
    const newMessage = requestMessageShare(tom.token, messageId.messageId, '@maxverstappen', testChannel.channelId, -1);

    expect(requestNotificationsGet(max.token)).toStrictEqual({notifications: [{channelId: testChannel.channelId, dmId: -1, notificationMessage: `tomholland tagged you in Testing: I was first - @maxve` }]});
  });
}); 

