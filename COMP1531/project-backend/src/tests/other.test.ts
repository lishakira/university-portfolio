import request from 'sync-request';
import config from '../config.json';
// Wrapper functions
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
  requestSearch,
  HTTPError400,
  HTTPError403,
} from '../testpaths';

const OK = 200;
const port = config.port;
const url = config.url;

// inputs
const userJames = { email: "james@hotmail.com", password: "password", nameFirst: "James", nameLast: "Humphries"};
const userTom = { email: "tom@hotmail.com", password: "password", nameFirst: "Tom", nameLast: "Holland" };
const userMax = { email: "max@hotmail.com", password: "password", nameFirst: "Max", nameLast: "Verstappen" };
const userFernando = { email: "fernando@hotmail.com", password: "password", nameFirst: "Fernando", nameLast: "Alonso" };

const messageBromine = "unique element - bromine";
const messageCopper = "unique element - copper";
const messageSilver = "unique element - silver";
const messageUranium = "unique element - uranium";

const messageBromine1 = "bromine";
const messageBromine2 = "bromine can be in a state of gas";
const messageBromine3 = "bromine is not safe to consume for anyone of any age";

const messageSilver1 = "silver is used in jewelry";
const messageSilver2 = "personally, i prefer silver over gold"

/*
Iteration 2
*/
test('Test successful echo', () => {
  const res = request(
    'GET',
      `${url}:${port}/echo`,
      {
        qs: {
        echo: 'Hello',
        }
      }
  );
  const bodyObj = JSON.parse(res.body as string);
  expect(res.statusCode).toBe(OK);
  expect(bodyObj).toEqual('Hello');
});


import { clearV1, searchV1 } from '../other';

test('Test clear function', () => {
  expect(clearV1()).toStrictEqual({ });
});

beforeEach(() => {
  requestClear();
});

describe('testing /search/v1', () => {

  test('error - query string too short', () => {
    const queryStr = "";
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    expect(requestSearch(user1.token, queryStr).statusCode).toStrictEqual(HTTPError400);
  });
  test('error - query string too long', () => {
    const queryStr = `this is just a test, do not think heavily of this at all. this is just a test, do not think heavily of 
                      this at all. this is just a test, do not think heavily of this at all. this is just a test, do not think 
                      heavily of this at all. this is just a test, do not think heavily of this at all. this is just a test, do 
                      not think heavily of this at all. this is just a test, do not think heavily of this at all. this is just 
                      a test, do not think heavily of this at all. this is just a test, do not think heavily of this at all. 
                      this is just a test, do not think heavily of this at all. this is just a test, do not think heavily of 
                      this at all. this is just a test, do not think heavily of this at all. this is just a test, do not think 
                      heavily of this at all. this is just a test, do not think heavily of this at all. this is just a test, 
                      do not think heavily of this at all. this is just a test, do not think heavily of this at all. this is 
                      just a test, do not think heavily of this at all. this is just a test, do not think heavily of this at all.`;
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    expect(requestSearch(user1.token, queryStr).statusCode).toStrictEqual(HTTPError400);
  });
  test('valid input', () => {
		// user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    // user3 should have uId = 3
    const user3 = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);

    // makes channel called testchannel by user1, member is only user1
    /*
    channel1 contains bromine and uranium
    */
    const channel1 = requestChannelsCreate(user1.token, "testchannel1", true);
    const message1 = requestMessageSend(user1.token, channel1.channelId, messageBromine);
    const message2 = requestMessageSend(user1.token, channel1.channelId, messageBromine3);
    const message3 = requestMessageSend(user1.token, channel1.channelId, messageUranium);
    
    // makes channel called testchannel by user2, member is only user2
    /*
    channel2 contains calcium and copper
    */
   const channel2 = requestChannelsCreate(user2.token, "testchannel2", true);
   const message4 = requestMessageSend(user2.token, channel2.channelId, messageCopper);
   const message5 = requestMessageSend(user2.token, channel2.channelId, messageUranium);
    
    // makes a new dm consisting of all users
    /*
    dm1 contains potassium, gold, silver
    */
		const dmId1 = requestDmCreate(user2.token, [user1.authUserId, user3.authUserId]);
    const message6 = requestSendDmMessage(user2.token, dmId1.dmId, messageBromine2);
    const message7 = requestSendDmMessage(user3.token, dmId1.dmId, messageSilver);
    const message8 = requestSendDmMessage(user3.token, dmId1.dmId, messageSilver1);
    
    // makes a new dm consisting of users 1 and 3
    /*
    dm2 contains bromine and silver
    */
   const dmId2 = requestDmCreate(user1.token, [user3.authUserId]);
    const message9 = requestSendDmMessage(user1.token, dmId2.dmId, messageBromine1);
    const message10 = requestSendDmMessage(user3.token, dmId2.dmId, messageSilver);
    const message11 = requestSendDmMessage(user3.token, dmId2.dmId, messageSilver2);
    const message12 = requestSendDmMessage(user1.token, dmId2.dmId, messageCopper);
    
    // found all 4 messages containing queryStr in both channels and dms
    // console.log(requestSearch(user1.token, 'bromine'));
    const expectedOutput1 = [messageBromine, messageBromine1, messageBromine2, messageBromine3];
    for (const element in expectedOutput1) {
      expect(requestSearch(user1.token, 'bromine')).toContain(expectedOutput1[element]);
    }

    // there are 4 messages containing queryStr but user is only enrolled in dms containing queryStr
    // console.log(requestSearch(user3.token, 'bromine'));
    const expectedOutput2 = [messageBromine1, messageBromine2];
    for (const element in expectedOutput2) {
      expect(requestSearch(user3.token, 'bromine')).toContain(expectedOutput2[element]);
    }
    
    // there are 2 messages containing queryStr but user is only enrolled in channels containing queryStr
    // console.log(requestSearch(user2.token, 'copper'));
    const expectedOutput3 = [messageCopper];
    for (const element in expectedOutput3) {
      expect(requestSearch(user2.token, 'copper')).toContain(expectedOutput3[element]);
    }
    
    // there are 4 messages containing queryStr but only 2 is found in the dm the user is enrolled in
    // console.log(requestSearch(user2.token, 'silver'));
    const expectedOutput4 = [messageSilver, messageSilver1];
    for (const element in expectedOutput4) {
      expect(requestSearch(user2.token, 'silver')).toContain(expectedOutput4[element]);
    }
    
    // there exists 2 message containing queryStr but only 1 is found in the channel the user is enrolled in
    // console.log(requestSearch(user1.token, 'uranium'));
    const expectedOutput5 = [messageUranium];
    for (const element in expectedOutput5) {
      expect(requestSearch(user1.token, 'uranium')).toContain(expectedOutput5[element]);
    }

  });

});

