// ========================================================================= //
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
} from '../testpaths';
// ========================================================================= //

//constants for testing input:
const errorResponse = { error: expect.any(String) };
const OK = 200;

//for user inputs
const userJames = { email: "james@hotmail.com", password: "password", nameFirst: "James", nameLast: "Humphries" };
const userTom = { email: "tom@hotmail.com", password: "password", nameFirst: "Tom", nameLast: "Holland" };

//for channel inputs
/*
const channel1 = { name: 'Crunchie', isPublic: true };
const channelNameLong = { name: 'somethingmorethan20chars', isPublic: true }
const channelNameShort = { name: '', isPublic: true }
*/

//tests:
beforeEach(() => {
  requestClear();
});

describe('testing channelsCreate', () => {
  
  test('invalid input (1) - name length too long', () => {
    //creates user with authUserId = 1
    const user = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    expect(requestChannelsCreate(user.token, 'somethingmorethan20chars', true).statusCode).toStrictEqual(HTTPError400);
  });

  test('invalid input (2) - name length too short', () => {
    const user = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    expect(requestChannelsCreate(user.token, '', true).statusCode).toStrictEqual(HTTPError400);
  });

  test('invalid input (3) - channel name registered twice', () => {
    const user = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    requestChannelsCreate(user.token, 'Crunchie', true);
    expect(requestChannelsCreate(user.token, 'Crunchie', true).statusCode).toStrictEqual(HTTPError400);
  });

  test('invalid input (4) - id is not registered', () => {
    //creates user with userId 1
    const user = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    //attempts to create channel using userId 100
    expect(requestChannelsCreate(user.token + 100, 'Crunchie', true).statusCode).toStrictEqual(HTTPError403);
  });
  
  test('valid input (1) - create 1 channel', () => {
    //creates user with authUserId = 1
    const user = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    expect(requestChannelsCreate(user.token, 'Crunchie', true)).toStrictEqual({ channelId: expect.any(Number) });
  });
  
});

describe('testing channelsList', () => {
  /*
  test('invalid input (1) - no channels', () => {
    const user = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    expect(requestChannelsList(user.token).statusCode).toStrictEqual(HTTPError400);
  });
  */
  test('invalid input (2) - userId not valid', () => {
    const user = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    expect(requestChannelsList('100').statusCode).toStrictEqual(HTTPError403);
  });
  test('valid input (1) - list 1 channel', () => {
    const user = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const channel1 = requestChannelsCreate(user.token, 'Crunchie', true);
    expect(requestChannelsList(user.token)).toStrictEqual(
      { channels: [
        {
          channelId: channel1.channelId,  
          name: 'Crunchie'
        }
      ]}
    );
  });
  test('valid input (2) - user is author and member of more than 1 channels', () => {
    const user = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const channel1 = requestChannelsCreate(user.token, 'Crunchie', true);
    const channel2 = requestChannelsCreate(user.token, 'Something', true);
    const channel3 = requestChannelsCreate(user.token, 'Random', false);
    expect(requestChannelsList(user.token)).toStrictEqual(
      { channels: [
        {
          channelId: channel1.channelId,
          name: 'Crunchie'
        },
        {
          channelId: channel2.channelId,  
          name: 'Something'
        },
        {
          channelId: channel3.channelId,  
          name: 'Random'
        }
      ]}
    );
  });
  //NOTE!! add more tests using channelsInvite
});

describe('testing channelsListall', () => {
  /*
  test('invalid input (1) - no channels', () => {
    const user = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    expect(requestChannelsListAll(user.token).statusCode).toStrictEqual(HTTPError400);
  });
  */
  test('invalid input (2) - userId not valid', () => {
    const user = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    expect(requestChannelsListAll('100').statusCode).toStrictEqual(HTTPError403);
  });
  test('valid input (1) - output 1 channel', () => {
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const channel1 = requestChannelsCreate(user1.token, 'Crunchie', true);
    expect(requestChannelsListAll(user1.token)).toStrictEqual(
      { channels: [
        {
          channelId: channel1.channelId, 
          name: 'Crunchie'
        }
      ]}
    );
  });
  test('valid input (2) - output both private and public channel', () => {
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const channel1 = requestChannelsCreate(user1.token, 'Crunchie', true);
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const channel2 = requestChannelsCreate(user2.token, 'Something', false);
    expect(requestChannelsListAll(user1.token)).toStrictEqual(
      { channels: [
        {
          channelId: channel1.channelId, 
          name: 'Crunchie'
        },
        {
          channelId: channel2.channelId,  
          name: 'Something'
        }
      ]}
    );
  });
  //NOTE!! add more tests using channelsInvite 

});
/*
// restarts database before each test
beforeEach(() => {
  clearV1();
});

describe('Testing autoTest', () => {


  test('Test when no channels - channelsListAll', () => {
    const user1 = authRegisterV1(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const uIdZerg = user1.authUserId;
    clearV1();
    let res = channelsListallV1(uIdZerg)['channels']
    expect(res).toStrictEqual([]);

  });



  test('Test when one channel exists private', () => {
    const user1 = authRegisterV1(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const userTomObject = authRegisterV1(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const user1Id = user1.authUserId;
    const userTomId = userTomObject.authUserId;
    const channel1 = channelsCreateV1(user1Id, "zergs lair", false);
    const channel1Id = channel1.channelId;
    channelInviteV1(user1Id, channel1Id, userTomId);
    let deets = {'channelId': channel1Id, 'name': 'andy'};
    let res = channelsListallV1(userTomId)['channels'];
    let channelDetail = {'channelId': channel1Id, 'name': 'zergs lair'}
    expect(res).toEqual(expect.arrayContaining([expect.objectContaining(channelDetail)]));

  });
  test('Test when one channel exists public', () => {
    const uIdZerg = authRegisterV1(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast)['authUserId'];
    const chId = channelsCreateV1(uIdZerg, "woodys toybox", true)['channelId'];
    let res = channelsListallV1(uIdZerg)['channels'];
    let channelDetail = {'channelId': chId, 'name': 'woodys toybox'};
    expect(res).toEqual(expect.arrayContaining([expect.objectContaining(channelDetail)]));
  });

  test('Test when multiple channels exist', () => {
    const uIdBuzz = authRegisterV1(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast)['authUserId'];
    const chId = channelsCreateV1(uIdBuzz, "woodys toybox", true)['channelId'];
    const chId2 = channelsCreateV1(uIdBuzz, "toybox", true)['channelId'];
    let channelDetail = {'channelId': chId, 'name': 'woodys toybox'};
    let channelDetail2 = {'channelId': chId2, 'name': 'toybox'};
    let res = channelsListallV1(uIdBuzz)['channels'];
    // sort according to channelId values
    expect(res).toStrictEqual([channelDetail, channelDetail2]);

  });

  // Testing channelsListV1

  test('Test member in no channels', () => {
    const user1 = authRegisterV1(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const uId = user1.authUserId;
    let res = channelsListV1(uId)['channels']
    expect(res).toStrictEqual([]);

  });

  test('Test channel owner in channel > Create channel then list details', () => {
    const user1 = authRegisterV1(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const uId = user1.authUserId;
    let chId = channelsCreateV1(uId, 'andy', true)['channelId'];
    let deets = {'channelId': chId, 'name': 'andy'};
    expect(channelsListV1(uId)['channels']).toContainEqual(deets);
  });

  test('Test channel member in channel > Create channel then list details', () => {
    const uId = authRegisterV1(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast)['authUserId'];
    const uIdWoody = authRegisterV1(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast)['authUserId'];
    let chId = channelsCreateV1(uId, 'andy', true)['channelId'];
    channelInviteV1(uId, chId, uIdWoody);
    let deets = {'channelId': chId, 'name': 'andy'};
    expect(channelsListV1(uId)['channels']).toContainEqual(deets);

  });

  test('Test user in multiple channels > Create channel then list details', () => {
    const uId = authRegisterV1(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast)['authUserId'];
    const uIdWoody = authRegisterV1(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast)['authUserId'];
    let chId = channelsCreateV1(uId, 'andy', true)['channelId'];
    let chId2 = channelsCreateV1(uId, 'ZERG', true)['channelId'];
    channelInviteV1(uId, chId, uIdWoody);
    let expectedDeets = [{'channelId': chId, 'name': 'andy'}, {'channelId': chId2, 'name': 'ZERG'}];
    let deets = channelsListV1(uId)['channels'];
    deets.sort((a, b) => (a['channelId']- b['channelId']));
    expectedDeets.sort((a, b) => (a['channelId']- b['channelId']));
    expect(expectedDeets).toStrictEqual(deets);

  });




});

describe('Testing channelsCreateV1', () => {
  test('invalid input (1) - name length too long', () => {
    const user1 = authRegisterV1("james.p.h@hotmail.com", "password", "nameFirst", "nameLast");
    const user1Id = user1.authUserId;
    expect(channelsCreateV1(user1Id, 'somethingmorethan20chars', true).statusCode).toStrictEqual(HTTPError400);
  });

  test('invalid input (2) - name length too short', () => {
    const user1 = authRegisterV1("james.p.h@hotmail.com", "password", "nameFirst", "nameLast");
    const user1Id = user1.authUserId;
    expect(channelsCreateV1(user1Id, '', true).statusCode).toStrictEqual(HTTPError400);
  });

  test('invalid input (3) - channel name registered twice', () => {
    const user1 = authRegisterV1("james.p.h@hotmail.com", "password", "nameFirst", "nameLast");
    const user1Id = user1.authUserId;
    channelsCreateV1(user1Id, 'sameChannel', true);
    expect(channelsCreateV1(user1Id, 'sameChannel', true).statusCode).toStrictEqual(HTTPError400);
  });

  test('invalid input (4) - id is not registered', () => {

    const user1 = authRegisterV1("james.p.h@hotmail.com", "password", "nameFirst", "nameLast");
    const user1Id = user1.authUserId;
    expect(channelsCreateV1(user1Id + 9, 'someChannel', true).statusCode).toStrictEqual(HTTPError400);

  });
  

  test('valid input (1) - create 1 channel', () => {
    const user1 = authRegisterV1("james.p.h@hotmail.com", "password", "nameFirst", "nameLast");
    const user2 = authRegisterV1("james2.p.h@hotmail.com", "password", "nameFirst", "nameLast");
    const user1Id = user1.authUserId;
    const channel1 = channelsCreateV1(user1Id, "COMP1531", true);
    const channel1Id = channel1.channelId;
    expect(channel1).toStrictEqual({ channelId: channel1Id });
  });

  test('valid input (2) - create 2 channels', () => {
    const user1 = authRegisterV1("james.p.h@hotmail.com", "password", "nameFirst", "nameLast");
    const user2 = authRegisterV1("james2.p.h@hotmail.com", "password", "nameFirst", "nameLast");
    const user1Id = user1.authUserId;
    const user2Id = user2.authUserId;
    const channel1 = channelsCreateV1(user1Id, "COMP1531", true);
    const channel2 = channelsCreateV1(user1Id, "COMM1140", true);
    const channel1Id = channel1.channelId;
    const channel2Id = channel2.channelId;
    expect(channel1).toStrictEqual({ channelId: channel1Id });
    expect(channel2).toStrictEqual({ channelId: channel2Id });
  });
});
/*
describe('Test for channelsListV1', () => {
  
  test('1. Test invalid authUserId address', () => {
    expect(channelsListV1(-1)['channels']).toEqual([]);
  });
  test('2. Test invalid - no classes', () => {
    const user1 = authRegisterV1("james.p.h@hotmail.com", "password", "nameFirst", "nameLast");
    const user1Id = user1.authUserId;
    expect(channelsListV1(user1Id)['channels']).toEqual([]);
  });
  test('3. Test valid - class public', () => {
    const user1 = authRegisterV1("james.p.h@hotmail.com", "password", "nameFirst", "nameLast");
    const user1Id = user1.authUserId;
    const channel1 = channelsCreateV1(user1Id, "COMP1531", true);
    const channel1Id = channel1.channelId;
    expect(channelsListV1(user1Id)['channels']).toEqual([{channelId: channel1Id, name: "COMP1531"}]);
  });
  test('4. Test valid - class private', () => {
    const user1 = authRegisterV1("james.p.h@hotmail.com", "password", "nameFirst", "nameLast");
    const user1Id = user1.authUserId;
    const channel1 = channelsCreateV1(user1Id, "COMP1531", false);
    const channel1Id = channel1.channelId;
    expect(channelsListV1(user1Id)['channels']).toEqual([{channelId: channel1Id, name: "COMP1531"}]);
  });
  test('5. Test valid - multiple classes', () => {
    const user1 = authRegisterV1("james.p.h@hotmail.com", "password", "nameFirst", "nameLast");
    const user1Id = user1.authUserId;
    const channel1 = channelsCreateV1(user1Id, "COMP1531", true);
    const channel2 = channelsCreateV1(user1Id, "COMM1140", false);
    const channel1Id = channel1.channelId;
    const channel2Id = channel2.channelId;
    expect(channelsListV1(user1Id)['channels']).toEqual([{channelId: channel1Id, name: "COMP1531"}, {channelId: channel2Id, name: "COMM1140"}]);
  });
  
});

describe('Test for channelsListAllV1', () => {
  
  test('1. Test invalid authUserId address', () => {

    expect(channelsListallV1(-1)['channels']).toEqual([]);
  });
  test('2. Test invalid - no classes', () => {
    const user1 = authRegisterV1("james.p.h@hotmail.com", "password", "nameFirst", "nameLast");
    const user1Id = user1.authUserId;
    expect(channelsListallV1(user1Id)['channels']).toEqual([]);
  });
  test('3. Test valid - class public', () => {
    const user1 = authRegisterV1("james.p.h@hotmail.com", "password", "nameFirst", "nameLast");
    const user2 = authRegisterV1("james2.p.h@hotmail.com", "password", "nameFirst", "nameLast");
    const user1Id = user1.authUserId;
    const channel1 = channelsCreateV1(user1Id, "COMP1531", true);
    const channel1Id = channel1.channelId;
    expect(channelsListallV1(user1Id)['channels']).toEqual([{channelId: channel1Id, name: "COMP1531"}]);
  });
  test('4. Test valid - class private', () => {
    const user1 = authRegisterV1("james.p.h@hotmail.com", "password", "nameFirst", "nameLast");
    const user2 = authRegisterV1("james2.p.h@hotmail.com", "password", "nameFirst", "nameLast");
    const user1Id = user1.authUserId;
    const channel1 = channelsCreateV1(user1Id, "COMP1531", false);
    const channel1Id = channel1.channelId;
    expect(channelsListallV1(user1Id)['channels']).toEqual([{channelId: channel1Id, name: "COMP1531"}]);
  });
  test('5. Test valid - multiple classes', () => {
    const user1 = authRegisterV1("james.p.h@hotmail.com", "password", "nameFirst", "nameLast");
    const user1Id = user1.authUserId;
    const channel1 = channelsCreateV1(user1Id, "COMP1531", true);
    const channel2 = channelsCreateV1(user1Id, "COMM1140", false);
    const channel1Id = channel1.channelId;
    const channel2Id = channel2.channelId;
    expect(channelsListallV1(user1Id)['channels']).toEqual([{channelId: channel1Id, name: "COMP1531"}, {channelId: channel2Id, name: "COMM1140"}]);
  });
  test('6. Test valid - multiple classes but not in the class', () => {
    const user1 = authRegisterV1("james.p.h@hotmail.com", "password", "nameFirst", "nameLast");
    const user2 = authRegisterV1("james2.p.h@hotmail.com", "password", "nameFirst", "nameLast");
    const user1Id = user1.authUserId;
    const user2Id = user2.authUserId;
    const channel1 = channelsCreateV1(user1Id, "COMP1531", true);
    const channel2 = channelsCreateV1(user1Id, "COMM1140", true);
    const channel1Id = channel1.channelId;
    const channel2Id = channel2.channelId;
    expect(channelsListallV1(user2Id)['channels']).toEqual([{channelId: channel1Id, name: "COMP1531"}, {channelId: channel2Id, name: "COMM1140"}]);
  });

});*/

