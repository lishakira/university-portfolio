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
  requeststandupStart,
} from '../testpaths';
// ========================================================================= //
//constants for testing input:

//for user inputs
const userJames = { email: "james@hotmail.com", password: "password", nameFirst: "James", nameLast: "Humphries" };
const userTom = { email: "tom@hotmail.com", password: "password", nameFirst: "Tom", nameLast: "Holland" };
const userAndrew = {email: "andrew@gmail.com", password: "password", nameFirst: "Andrew", nameLast: "Taylor"};
const Crunchie1 = { name: 'Crunchie', isPublic: true };
const Crunchie2 = { name: 'Crunchie2', isPublic: false };

const isPublicChannel = true;

beforeEach(() => {
  requestClear();
});


/*
Iteration 2
*/
describe('testing channelInvite', () => {

  test('invalid input (1) - invalid Token', () => {
    const James = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const Tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const CrunchieChannel = requestChannelsCreate(James.token, Crunchie1.name, Crunchie1.isPublic);
    expect(requestChannelInvite(James.token + 10, CrunchieChannel.channelId, Tom.authUserId).statusCode).toStrictEqual(HTTPError403);
  });

  test('invalid input (2) - channelId does not refer to a valid channel', () => {
    // Trying to add in Tom to Crunchie Channel
    const James = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const Tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const CrunchieChannel = requestChannelsCreate(James.token, Crunchie1.name, Crunchie1.isPublic);
    expect(requestChannelInvite(James.token, CrunchieChannel.channelId + 10, Tom.authUserId).statusCode).toStrictEqual(HTTPError400);
  });

  test('invalid input (3) - uId does not refer to a valid user', () => {
    // Trying to add in Tom to Crunchie Channel
    const James = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const Tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const CrunchieChannel = requestChannelsCreate(James.token, Crunchie1.name, Crunchie1.isPublic);
    expect(requestChannelInvite(James.token, CrunchieChannel.channelId, Tom.authUserId + 10).statusCode).toStrictEqual(HTTPError400);
  });

  test('invalid input (4) - uId refers to a user who is already a member of the channel', () => {
    // Trying to add in James to Crunchie Channel
    const James = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const Tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const CrunchieChannel = requestChannelsCreate(James.token, Crunchie1.name, Crunchie1.isPublic);
    expect(requestChannelInvite(James.token, CrunchieChannel.channelId, James.authUserId).statusCode).toStrictEqual(HTTPError400);
  });

  test('invalid input (5) - channelId is valid and the authorised user is not a member of the channel', () => {
    // Trying to add in James to Crunchie Channel
    const James = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const Tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const CrunchieChannel = requestChannelsCreate(James.token, Crunchie1.name, Crunchie1.isPublic);
    expect(requestChannelInvite(Tom.token, CrunchieChannel.channelId, Tom.authUserId).statusCode).toStrictEqual(HTTPError403);
  });

  test('valid input - register Tom to channel', () => {
    // Trying to add in James to Crunchie Channel
    const James = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const Tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const CrunchieChannel = requestChannelsCreate(James.token, Crunchie1.name, Crunchie1.isPublic);
    expect(requestChannelInvite(James.token, CrunchieChannel.channelId, Tom.authUserId)).toStrictEqual({});
  });

  test('valid input - register Tom to channel and then Max', () => {
    // Trying to add in James to Crunchie Channel
    const James = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const Tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const Andrew = requestAuthRegister(userAndrew.email, userAndrew.password, userAndrew.nameFirst, userAndrew.nameLast);
    const CrunchieChannel = requestChannelsCreate(James.token, Crunchie1.name, Crunchie1.isPublic);
    requestChannelInvite(James.token, CrunchieChannel.channelId, Tom.authUserId);
    expect(requestChannelInvite(Tom.token, CrunchieChannel.channelId, Andrew.authUserId)).toStrictEqual({});
  });

});

describe('testing channelDetails', () => {
  
  test('invalid input (1) - channelId does not refer to a valid channel', () => {
    const James = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const CrunchieChannel = requestChannelsCreate(James.token, Crunchie1.name, Crunchie1.isPublic);
    expect(requestChannelDetails(James.token, CrunchieChannel.channelId + 10).statusCode).toStrictEqual(HTTPError400); 
  });
  
  test('invalid input (2) - invalid Token', () => {
    const James = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const CrunchieChannel = requestChannelsCreate(James.token, Crunchie1.name, Crunchie1.isPublic);
    expect(requestChannelDetails(James.token + 10, CrunchieChannel.channelId).statusCode).toStrictEqual(HTTPError403); 
  });

  test('invalid input (3) - channelId is valid and the authorised user is not a member of the channel', () => {
    const James = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const Tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const CrunchieChannel = requestChannelsCreate(James.token, Crunchie1.name, Crunchie1.isPublic);
    expect(requestChannelDetails(Tom.token, CrunchieChannel.channelId).statusCode).toStrictEqual(HTTPError403); 
  });
  
  test('valid input details (1)', () => {
    // Trying to add in James to Crunchie Channel
    const James = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const CrunchieChannel = requestChannelsCreate(James.token, Crunchie1.name, Crunchie1.isPublic);
    const ownerMembersDeets = [{
      uId: James.authUserId,
      email: userJames.email,
      nameFirst: userJames.nameFirst,
      nameLast: userJames.nameLast,
      handleStr: userJames.nameFirst.toLowerCase() + userJames.nameLast.toLowerCase(),
      profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
    }];
    const allMembersDeets = [{
      uId: James.authUserId,
      email: userJames.email,
      nameFirst: userJames.nameFirst,
      nameLast: userJames.nameLast,
      handleStr: userJames.nameFirst.toLowerCase() + userJames.nameLast.toLowerCase(),
      profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
    }];
    const channelDetails = {name: Crunchie1.name, isPublic: Crunchie1.isPublic, ownerMembers: ownerMembersDeets, allMembers: allMembersDeets}; 
    expect(requestChannelDetails(James.token, CrunchieChannel.channelId)).toStrictEqual(channelDetails);
  });

  test('valid input details (2) - with channelInvite', () => {
    // Trying to add in James to Crunchie Channel
    const James = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const CrunchieChannel = requestChannelsCreate(James.token, Crunchie1.name, Crunchie1.isPublic);
    const Tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    requestChannelInvite(James.token, CrunchieChannel.channelId, Tom.authUserId);
    const ownerMembersDeets = [{
      uId: James.authUserId,
      email: userJames.email,
      nameFirst: userJames.nameFirst,
      nameLast: userJames.nameLast,
      handleStr: userJames.nameFirst.toLowerCase() + userJames.nameLast.toLowerCase(),
      profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
    }];
    const allMembersDeets = [{
      uId: James.authUserId,
      email: userJames.email,
      nameFirst: userJames.nameFirst,
      nameLast: userJames.nameLast,
      handleStr: userJames.nameFirst.toLowerCase() + userJames.nameLast.toLowerCase(),
      profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
    },
    {
      uId: Tom.authUserId,
      email: userTom.email,
      nameFirst: userTom.nameFirst,
      nameLast: userTom.nameLast,
      handleStr: userTom.nameFirst.toLowerCase() + userTom.nameLast.toLowerCase(),
      profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
    }];
    const channelDetails = {name: Crunchie1.name, isPublic: Crunchie1.isPublic, ownerMembers: ownerMembersDeets, allMembers: allMembersDeets}; 
    expect(requestChannelDetails(James.token, CrunchieChannel.channelId)).toStrictEqual(channelDetails);
  });

});
describe('testing channelJoin', () => {

  test('invalid input (1) - channelId does not refer to a valid channel', () => {
    const James = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const CrunchieChannel = requestChannelsCreate(James.token, Crunchie1.name, Crunchie1.isPublic);
    const Tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    expect(requestChannelJoin(Tom.token, CrunchieChannel.channelId + 10).statusCode).toStrictEqual(HTTPError400); 
  });

  test('invalid input (2) - invalid token', () => {
    const James = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const CrunchieChannel = requestChannelsCreate(James.token, Crunchie1.name, Crunchie1.isPublic);
    const Tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    expect(requestChannelJoin(Tom.token + 10, CrunchieChannel.channelId).statusCode).toStrictEqual(HTTPError403); 
  });

  test('invalid input (3) - the authorised user is already a member of the channel', () => {
    const James = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const CrunchieChannel = requestChannelsCreate(James.token, Crunchie1.name, Crunchie1.isPublic);
    const Tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    requestChannelInvite(James.token, CrunchieChannel.channelId, Tom.authUserId);
    expect(requestChannelJoin(Tom.token, CrunchieChannel.channelId).statusCode).toStrictEqual(HTTPError400); 
  });
  
  //
  // ADD MORE TESTS FOR THIS
  //
  test('invalid input (4) -  channelId refers to a channel that is private and the authorised user is not already a channel member and is not a global owner', () => {
    const James = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const CrunchiePriv = requestChannelsCreate(James.token, Crunchie2.name, Crunchie2.isPublic);
    const Tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    expect(requestChannelJoin(Tom.token, CrunchiePriv.channelId).statusCode).toStrictEqual(HTTPError403); 
  });

  test('valid input (1) - user joins public channel', () => {
    const James = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const CrunchieChannel = requestChannelsCreate(James.token, Crunchie1.name, Crunchie1.isPublic);
    const Tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    expect(requestChannelJoin(Tom.token, CrunchieChannel.channelId)).toStrictEqual({}); 
  });

});
describe('Testing channelMessagesV1 Error Cases', () => {

  test('invalid input (1) - invalid token', () => {
    const userId1 = requestAuthRegister("maximilianfalco@gmail.com", "password", "nameFirst", "nameLast");
    const channelId1 = requestChannelsCreate(userId1.token, 'testChannel', true);
    expect(requestChannelMessages(userId1.token + 1, channelId1.channelId, 0).statusCode).toStrictEqual(HTTPError403);
  });
  test('invalid input (2) - channelId does not refer to a valid channel / no active channels', () => {
    const userId1 = requestAuthRegister("maximilianfalco@gmail.com", "password", "nameFirst", "nameLast");
    expect(requestChannelMessages(userId1.token, 100, 0).statusCode).toStrictEqual(HTTPError400);
  });
  test('invalid input (3) - channelId does not refer to a valid channel', () => {
    const userId1 = requestAuthRegister("maximilianfalco@gmail.com", "password", "nameFirst", "nameLast");
    const channelId1 = requestChannelsCreate(userId1.token, 'testChannel', true);
    expect(requestChannelMessages(userId1.token, channelId1.channelId + 1, 0).statusCode).toStrictEqual(HTTPError400);
  });
  test('invalid input (4) - channelId is valid and the authorised user is not a member of the channel', () => {
    const userId1 = requestAuthRegister("maximilianfalco@gmail.com", "password", "nameFirst", "nameLast");
    const userId2 = requestAuthRegister("james.p.h@hotmail.com", "password", "nameFirst", "nameLast");
    const channelId1 = requestChannelsCreate(userId1.token, 'testChannel', true);
    expect(requestChannelMessages(userId2.token, channelId1.channelId, 0).statusCode).toStrictEqual(HTTPError403);
  });
  test('invalid input (5) - start is greater than the total number of messages in the channel', () => {
    const userId1 = requestAuthRegister("maximilianfalco@gmail.com", "password", "nameFirst", "nameLast");
    const channelId1 = requestChannelsCreate(userId1.token, 'testChannel', true);
    const numberBiggerThanZero = 1;
    expect(requestChannelMessages(userId1.token, channelId1.channelId, numberBiggerThanZero).statusCode).toStrictEqual(HTTPError400);
  });
});
/*
*/
describe('Testing channelMessagesV1 Valid Input Cases', () => {
  test('Has zero messages', () => {
    const userId1 = requestAuthRegister("maximilianfalco@gmail.com", "password", "nameFirst", "nameLast");
    const channelId1 = requestChannelsCreate(userId1.token, 'testChannel', true);
    const expectedMessages = [];
    const start = 0;
    const sampleArray = [];
    const startPoint = sampleArray.length - start - 1;
    let end = startPoint - 50;
    if (end < 0) {
      end = -1;
    }
    for (let i = startPoint; i > end; i--) {
      expectedMessages.push(sampleArray[i]);
    }
    const receivedOutput = requestChannelMessages(userId1.token, channelId1.channelId, start);
    // console.log(receivedOutput);

    expect(receivedOutput).toStrictEqual({
      messages: expectedMessages,
      start: start,
      end: end,
    });
  });
  
});
/*
describe('Testing channelDetailsV1 function', () => {
  test('1. Invalid input - invalid authUserId', () => {
    const user1 = authRegisterV1("jovanka@hotmail.com", "password", "nameFirst", "nameLast");  
    const user1Id = Object.values(user1)[0];
    const channel1 = channelsCreateV1(user1Id, "COMP1531", true);
    const channel1Id = Object.values(channel1)[0];
    expect(channelDetailsV1("", channel1Id).statusCode).toStrictEqual(HTTPError400);
  });
  test('2. Invalid input - invalid channelId', () => {
    const user1 = authRegisterV1("jovanka@hotmail.com", "password", "nameFirst", "nameLast");  
    const user1Id = Object.values(user1)[0];
    const channel1 = channelsCreateV1(user1Id, "COMP1531", true);
    const channel1Id = Object.values(channel1)[0];
    expect(channelDetailsV1(user1Id, "").statusCode).toStrictEqual(HTTPError400);
  });
  test('3. Invalid input - invalid authuserId/ not part of the channel', () => {
    const user1 = authRegisterV1("jovanka@hotmail.com", "password", "nameFirst", "nameLast");  
    const user2 = authRegisterV1("jovanka2@gmail.com", "password123", "FirstName", "LastName"); 
    const user1Id = Object.values(user1)[0];
    const user2Id = Object.values(user2)[0];
    const channel1 = channelsCreateV1(user1Id, "COMP1531", true);
    const channel1Id = Object.values(channel1)[0];
    expect(channelDetailsV1(user2Id, channel1Id).statusCode).toStrictEqual(HTTPError400);
  });
  test('4. Valid input single member in channel', () => {
    const user1 = authRegisterV1("jovanka@hotmail.com", "password", "nameFirst", "nameLast");  
    const user1Id = Object.values(user1)[0];
    const isPublicChannel = true;
    const channel1 = channelsCreateV1(user1Id, "COMP1531", isPublicChannel);
    const channel1Id = Object.values(channel1)[0];
    expect(channelDetailsV1(user1Id, channel1Id)).toStrictEqual({
      name: "COMP1531",
      isPublic: isPublicChannel,
      ownerMembers: [user1Id],
      allMembers: [user1Id],
    });
  });
  test('5. Valid input multiple members in channel', () => {
    const user1 = authRegisterV1("jovanka@hotmail.com", "password", "nameFirst", "nameLast");  
    const user2 = authRegisterV1("jovanka2@hotmail.com", "password", "nameFirst", "nameLast");  
    const user1Id = Object.values(user1)[0];
    const user2Id = Object.values(user2)[0];
    const isPublicChannel = true;
    const channel1 = channelsCreateV1(user1Id, "COMP1531", isPublicChannel);
    const channel1Id = Object.values(channel1)[0];
    // Add member to channel
    channelJoinV1(user2Id,channel1Id);
    expect(channelDetailsV1(user1Id, channel1Id)).toStrictEqual({
      name: "COMP1531",
      isPublic: isPublicChannel,
      ownerMembers: [user1Id],
      allMembers: [user1Id, user2Id],
    });
  });

});


describe('Testing channelJoinV1 function', () => {
  test('1. Invalid input - invalid authUserId', () => {
    const user1 = authRegisterV1("jovanka@hotmail.com", "password", "nameFirst", "nameLast");  
    const user1Id = Object.values(user1)[0];
    const channel1 = channelsCreateV1(user1Id, "COMP1531", true);
    const channel1Id = Object.values(channel1)[0];
    expect(channelJoinV1("", channel1Id).statusCode).toStrictEqual(HTTPError400);
  });
  test('2. Invalid input - invalid channelId', () => {
    const user1 = authRegisterV1("jovanka@hotmail.com", "password", "nameFirst", "nameLast");  
    const user1Id = Object.values(user1)[0];
    const channel1 = channelsCreateV1(user1Id, "COMP1531", true);
    const channel1Id = Object.values(channel1)[0];
    expect(channelJoinV1(user1Id, "").statusCode).toStrictEqual(HTTPError400);
  });
  test('3. Invalid input - invalid authuserId/ already part of the channel', () => {
    const user1 = authRegisterV1("jovanka@hotmail.com", "password", "nameFirst", "nameLast");  
    const user1Id = Object.values(user1)[0];
    const channel1 = channelsCreateV1(user1Id, "COMP1531", true);
    const channel1Id = Object.values(channel1)[0];
    expect(channelJoinV1(user1Id, channel1Id).statusCode).toStrictEqual(HTTPError400);
  });
  test('4. Invalid input - trying to add a member to a private channel and not a global owner', () => {
    const user1 = authRegisterV1("jovanka@hotmail.com", "password", "nameFirst", "nameLast");  
    const user2 = authRegisterV1("jovanka2@hotmail.com", "password", "nameFirst", "nameLast");  
    const user1Id = Object.values(user1)[0];
    const user2Id = Object.values(user2)[0];
    const isPublicChannel = false;
    const channel1 = channelsCreateV1(user1Id, "COMP1531", isPublicChannel);
    const channel1Id = Object.values(channel1)[0];
    expect(channelJoinV1(user2Id, channel1Id).statusCode).toStrictEqual(HTTPError400);
  });
  test('5. Valid input - add a global owner to a private channel', () => {
    const user1 = authRegisterV1("jovanka@hotmail.com", "password", "nameFirst", "nameLast");  
    const user2 = authRegisterV1("jovanka2@hotmail.com", "password", "nameFirst", "nameLast");  
    const user1Id = Object.values(user1)[0];
    const user2Id = Object.values(user2)[0];
    const isPublicChannel = false;
    const channel1 = channelsCreateV1(user1Id, "COMP1531", isPublicChannel);
    const channel2 = channelsCreateV1(user2Id, "COMM1400", isPublicChannel);
    const channel1Id = Object.values(channel1)[0];
    const channel2Id = Object.values(channel2)[0];
    expect(channelJoinV1(user1Id, channel2Id)).toStrictEqual({});
  });
  test('6. Valid input - adding a member to a public channel', () => {
    const user1 = authRegisterV1("jovanka@hotmail.com", "password", "nameFirst", "nameLast");  
    const user2 = authRegisterV1("jovanka2@hotmail.com", "password", "nameFirst", "nameLast");  
    const user1Id = Object.values(user1)[0];
    const user2Id = Object.values(user2)[0];
    const isPublicChannel = true;
    const channel1 = channelsCreateV1(user1Id, "COMP1531", isPublicChannel);
    const channel1Id = Object.values(channel1)[0];
    expect(channelJoinV1(user2Id, channel1Id)).toStrictEqual({});
  });
});

describe('Testing channelInviteV1 function', () => {
  test('Invalid input (1) - invalid/unregistered channelId', () => {
    const user1 = authRegisterV1("jovanka@hotmail.com", "password", "nameFirst", "nameLast");  
    const user2 = authRegisterV1("jovanka2@hotmail.com", "password", "nameFirst", "nameLast");  
    const user1Id = Object.values(user1)[0];
    const user2Id = Object.values(user2)[0];
    const channel1 = channelsCreateV1(user1Id, 'crunchieChannel', true);
    const channel1Id = Object.values(channel1)[0];
    //input channel with id 11, which is not registered yet
    expect(channelInviteV1(user1Id, channel1Id + 1, user2Id)).toStrictEqual( errorResponse);
  });

  test('Invalid input (2) - invalid/unregistered uId', () => {
    const user1 = authRegisterV1("jovanka@hotmail.com", "password", "nameFirst", "nameLast");  
    const user1Id = Object.values(user1)[0];
    const channel1 = channelsCreateV1(user1Id, 'crunchieChannel', true);
    const channel1Id = Object.values(channel1)[0];
    expect(channelInviteV1(user1Id, channel1Id, "")).toStrictEqual( errorResponse);
  });

  test('Invalid input (2) - invalid authUserId', () => {
    const user1 = authRegisterV1("jovanka@hotmail.com", "password", "nameFirst", "nameLast");  
    const user2 = authRegisterV1("jovanka2@hotmail.com", "password", "nameFirst", "nameLast");  
    const user1Id = Object.values(user1)[0];
    const user2Id = Object.values(user2)[0];
    const channel1 = channelsCreateV1(user1Id, 'crunchieChannel', true);
    const channel1Id = Object.values(channel1)[0];
    expect(channelInviteV1("", channel1Id, user2Id)).toStrictEqual( errorResponse);
  });

  test('Valid input (3) - expect no response', () => {
    //creates user with userId to create the channel and invite someone to the channel
    const user1 = authRegisterV1("jovanka@hotmail.com", "password", "nameFirst", "nameLast");  
    //creates user with userId to be invited to the channel
    const user2 = authRegisterV1("jovanka2@gmail.com", "password123", "FirstName", "LastName"); 
    const user1Id = Object.values(user1)[0];
    const user2Id = Object.values(user2)[0];
    const channel1 = channelsCreateV1(user1Id, "COMP1531", true);
    const channel1Id = Object.values(channel1)[0];
    //user1 invites user2 to crunchieChannel
    expect(channelInviteV1(user1Id, channel1Id, user2Id)).toStrictEqual( {});
  });

  test('Invalid input (4) - uId refers to a user who is already a member of the channel', () => {
    //creates user with userId to create the channel and invite someone to the channel
    const user1 = authRegisterV1("jovanka@hotmail.com", "password", "nameFirst", "nameLast");  
    //creates user with userId to be invited to the channel
    const user2 = authRegisterV1("jovanka2@gmail.com", "password123", "FirstName", "LastName"); 
    const user1Id = Object.values(user1)[0];
    const user2Id = Object.values(user2)[0];
    const channel1 = channelsCreateV1(user1Id, "COMP1531", true);
    const channel1Id = Object.values(channel1)[0];
    //user1 invites user2 to crunchieChannel
    channelInviteV1(user1Id, channel1Id, user2Id);
    expect(channelInviteV1(user2Id, channel1Id, user1Id)).toStrictEqual( errorResponse);
  });

  test('Invalid input (5) - channelId is valid and the authorised user is not a member of the channel', () => {
    const user1 = authRegisterV1("jovanka@hotmail.com", "password", "nameFirst", "nameLast");  
    //creates user with userId to be invited to the channel
    const user2 = authRegisterV1("jovanka2@gmail.com", "password123", "FirstName", "LastName"); 
    const user1Id = Object.values(user1)[0];
    const user2Id = Object.values(user2)[0];
    const channel1 = channelsCreateV1(user1Id, "COMP1531", true);
    const channel1Id = Object.values(channel1)[0];
    expect(channelInviteV1(user2Id, channel1Id, user1Id)).toStrictEqual( errorResponse);
  }); 
  test('Valid input (6) multiple members in channel', () => {
    const user1 = authRegisterV1("jovanka@hotmail.com", "password", "nameFirst", "nameLast");  
    const user2 = authRegisterV1("jovanka2@hotmail.com", "password", "nameFirst", "nameLast");  
    const user1Id = Object.values(user1)[0];
    const user2Id = Object.values(user2)[0];
    const isPublicChannel = true;
    const channel1 = channelsCreateV1(user1Id, "COMP1531", isPublicChannel);
    const channel1Id = Object.values(channel1)[0];
    // Add member to channel
    channelInviteV1(user1Id,channel1Id, user2Id);
    expect(channelDetailsV1(user1Id, channel1Id)).toStrictEqual( {
      name: "COMP1531",
      isPublic: isPublicChannel,
      ownerMembers: [user1Id],
      allMembers: [user1Id, user2Id],
    });
  });
  test('Valid input (7) multiple members in channel private', () => {
    const user1 = authRegisterV1("jovanka@hotmail.com", "password", "nameFirst", "nameLast");  
    const user2 = authRegisterV1("jovanka2@hotmail.com", "password", "nameFirst", "nameLast");  
    const user1Id = Object.values(user1)[0];
    const user2Id = Object.values(user2)[0];
    const isPublicChannel = false;
    const channel1 = channelsCreateV1(user1Id, "COMP1531", isPublicChannel);
    const channel1Id = Object.values(channel1)[0];
    // Add member to channel
    channelInviteV1(user1Id,channel1Id, user2Id);
    expect(channelDetailsV1(user1Id, channel1Id)).toStrictEqual( {
      name: "COMP1531",
      isPublic: isPublicChannel,
      ownerMembers: [user1Id],
      allMembers: [user1Id, user2Id],
    });
  });
});
*/
describe ('Testing channel leave', () => {

  test('Invalid input (1) - invalid token', () => {
    const user = requestAuthRegister("asxschro@gmail.com", "password", "Anton", "Sangalang");
    const channel = requestChannelsCreate(user.token, 'COMP1531', isPublicChannel);
    expect(requestChannelLeave(user.token + 1, channel.channelId).statusCode).toStrictEqual(HTTPError403);
  });

  test('Invalid input (2) - channelId does not refer to a valid channel', () => {
    const user = requestAuthRegister("asxschro@gmail.com", "password", "Anton", "Sangalang");
    const channel = requestChannelsCreate(user.token, 'COMP1531', isPublicChannel);
    expect(requestChannelLeave(user.token, (-100)).statusCode).toStrictEqual(HTTPError400);
  });

  test('Invalid input (3) - the authorised user is the starter of an active standup in the channel', () => {
    const user = requestAuthRegister("asxschro@gmail.com", "password", "Anton", "Sangalang");
    const channel = requestChannelsCreate(user.token, 'COMP1531', isPublicChannel);
    requeststandupStart(user.token,channel.channelId, 40);
    expect(requestChannelLeave(user.token, channel.channelId).statusCode).toStrictEqual(HTTPError400);
  });
  test('Invalid input (4) - channelId is valid and the authorised user is not a member of the channel', () => {
    const user = requestAuthRegister("asxschro@gmail.com", "password", "Anton", "Sangalang");
    const channel = requestChannelsCreate(user.token, 'COMP1531', isPublicChannel);
    const notAUser = requestAuthRegister("jovanka@hotmail.com", "password", "nameFirst", "nameLast");
    expect(requestChannelLeave(notAUser.token, (channel.channelId)).statusCode).toStrictEqual(HTTPError403);
  });
  test('Channel successfully left', () => {
    const user = requestAuthRegister("asxschro@gmail.com", "password", "Anton", "Sangalang");
    const user2 = requestAuthRegister("jovanka@hotmail.com", "password", "nameFirst", "nameLast");
    const channel = requestChannelsCreate(user.token, 'COMP1531', isPublicChannel);
    requestChannelJoin(user2.token, channel.channelId);
    requestChannelLeave(user2.token, channel.channelId);
    expect(requestChannelJoin(user2.token, channel.channelId)).toStrictEqual({});
  });

  test('Channel successfully left - owner leaving', () => {
    const user = requestAuthRegister("asxschro@gmail.com", "password", "Anton", "Sangalang");
    const user2 = requestAuthRegister("jovanka@hotmail.com", "password", "nameFirst", "nameLast");
    const channel = requestChannelsCreate(user.token, 'COMP1531', isPublicChannel);
    requestChannelJoin(user2.token, channel.channelId);
    requestChannelLeave(user.token, channel.channelId);
    expect(requestChannelJoin(user.token, channel.channelId)).toStrictEqual({});
  });

});
describe('Testing Adding Owners', () => {

  test('Invalid input (1) - invalid token', () => {
    const user = requestAuthRegister("asxschro@gmail.com", "password", "Anton", "Sangalang");
    const user2 = requestAuthRegister("asxschrotwo@gmail.com", "password", "AntonTwo", "SangalangTwo");
    const channel = requestChannelsCreate(user.token, 'COMP1531', isPublicChannel);
    expect(requestAddOwner('thisisinvaluid', channel.channelId, user2.authUserId).statusCode).toStrictEqual(HTTPError403);
  });

  test('Invalid input (2) - channelId does not refer to a valid channel', () => {
    const user = requestAuthRegister("asxschro@gmail.com", "password", "Anton", "Sangalang");
    const user2 = requestAuthRegister("asxschrotwo@gmail.com", "password", "AntonTwo", "SangalangTwo");
    const channel = requestChannelsCreate(user.token, 'COMP1531', isPublicChannel);
    expect(requestAddOwner(user.token, (channel.channelId - 2), user2.authUserId).statusCode).toStrictEqual(HTTPError400);
  });

  test('Invalid input (3) - uId does not refer to a valid user', () => {
    const user = requestAuthRegister("asxschro@gmail.com", "password", "Anton", "Sangalang");
    const user2 = requestAuthRegister("asxschrotwo@gmail.com", "password", "AntonTwo", "SangalangTwo");
    const channel = requestChannelsCreate(user.token, 'COMP1531', isPublicChannel);
    expect(requestAddOwner(user.token, channel.channelId, user.authUserId + 10).statusCode).toStrictEqual(HTTPError400);
  });  
  test('Invalid input (4) - uId refers to a user who is already an owner of the channel', () => {
    const user = requestAuthRegister("asxschro@gmail.com", "password", "Anton", "Sangalang");

    const channel = requestChannelsCreate(user.token, 'COMP1531', isPublicChannel);
    expect(requestAddOwner(user.token, channel.channelId, user.authUserId).statusCode).toStrictEqual(HTTPError400);
  });  
  test('Invalid input (5) - channelId is valid and the authorised user does not have owner permissions in the channel', () => {
    const user = requestAuthRegister("asxschro@gmail.com", "password", "Anton", "Sangalang");
    const user2 = requestAuthRegister("asxschrotwo@gmail.com", "password", "AntonTwo", "SangalangTwo");
    const channel = requestChannelsCreate(user.token, 'COMP1531', isPublicChannel);
    requestChannelInvite(user.token, channel.channelId, user2.authUserId);
    expect(requestAddOwner(user2.token, channel.channelId, user2.authUserId).statusCode).toStrictEqual(HTTPError403);
  });

  test('Adding an owner', () => {
    const user = requestAuthRegister("asxschro@gmail.com", "password", "Anton", "Sangalang");
    const user2 = requestAuthRegister("jovanka@hotmail.com", "password", "nameFirst", "nameLast");
    const channel = requestChannelsCreate(user.token, 'COMP1531', isPublicChannel);
    requestChannelJoin(user2.token, channel.channelId);
    expect(requestAddOwner(user.token, channel.channelId, user2.authUserId)).toStrictEqual({});
    expect(requestRemoveOwner(user.token, channel.channelId, user2.authUserId)).toStrictEqual({});
  });
});
describe('Remove Owners Testing', () => {

  test('Invalid input (1) - invalid token', () => {
      const user = requestAuthRegister("asxschro@gmail.com", "password", "Anton", "Sangalang");
      const channel = requestChannelsCreate(user.token, 'COMP1531', isPublicChannel);
      const user2 = requestAuthRegister('asxschro2@gmail.com', "passwword2", "Anton2", "Sangalang2");
      requestChannelJoin(user2.token, channel.channelId);
      requestAddOwner(user.token, channel.channelId, user2.authUserId);
      expect(requestRemoveOwner(user.token + 1, channel.channelId, user2.authUserId).statusCode).toStrictEqual(HTTPError403);
    });

  test('Invalid input (2) - channelId does not refer to a valid channel', () => {
    const user = requestAuthRegister("asxschro@gmail.com", "password", "Anton", "Sangalang");
    const channel = requestChannelsCreate(user.token, 'COMP1531', isPublicChannel);
    const user2 = requestAuthRegister('asxschro2@gmail.com', "passwword2", "Anton2", "Sangalang2");
    requestChannelJoin(user2.token, channel.channelId);
    requestAddOwner(user.token, channel.channelId, user2.authUserId);
    expect(requestRemoveOwner(user.token, (channel.channelId - channel.channelId * 2 + 10), user2.authUserId).statusCode).toStrictEqual(HTTPError400);
  });
  test('Invalid input (3) - uid does not refer to a valid user', () => {
    const user = requestAuthRegister("asxschro@gmail.com", "password", "Anton", "Sangalang");
    const channel = requestChannelsCreate(user.token, 'COMP1531', isPublicChannel);
    const user2 = requestAuthRegister('asxschro2@gmail.com', "passwword2", "Anton2", "Sangalang2");
    requestChannelJoin(user2.token, channel.channelId);
    requestAddOwner(user.token, channel.channelId, user2.authUserId);
    expect(requestRemoveOwner(user.token, channel.channelId, (user2.authUserId + 15)).statusCode).toStrictEqual(HTTPError400);
  });
  test('Invalid input (4) - uId refers to a user who is not an owner of the channel', () => {
    const user = requestAuthRegister("asxschro@gmail.com", "password", "Anton", "Sangalang");
    const channel = requestChannelsCreate(user.token, 'COMP1531', isPublicChannel);
    const user2 = requestAuthRegister('asxschro2@gmail.com', "passwword2", "Anton2", "Sangalang2");
    requestChannelJoin(user2.token, channel.channelId);
    expect(requestRemoveOwner(user.token, channel.channelId, user2.authUserId).statusCode).toStrictEqual(HTTPError400);
  });
  test('Invalid input (5) - uId refers to a user who is currently the only owner of the channel', () => {
    const user = requestAuthRegister("asxschro@gmail.com", "password", "Anton", "Sangalang");
    const channel = requestChannelsCreate(user.token, 'COMP1531', isPublicChannel);
    expect(requestRemoveOwner(user.token, channel.channelId, user.authUserId).statusCode).toStrictEqual(HTTPError400);
  });
  test('Invalid input (5) - channelId is valid and the authorised user does not have owner permissions in the channel', () => {
    const user = requestAuthRegister("asxschro@gmail.com", "password", "Anton", "Sangalang");
    const channel = requestChannelsCreate(user.token, 'COMP1531', isPublicChannel);
    const user2 = requestAuthRegister('asxschro2@gmail.com', "passwword2", "Anton2", "Sangalang2");
    const user3 = requestAuthRegister('asxschro3@gmail.com', "passwword3", "Anton3", "Sangalang3");
    requestChannelJoin(user2.token, channel.channelId);
    requestChannelJoin(user3.token, channel.channelId);
    expect(requestRemoveOwner(user2.token, channel.channelId, user.authUserId).statusCode).toStrictEqual(HTTPError403);
  });

  test('Invalid input (6) - uId refers to a user who is currently the only owner of the channel - multiple owners', () => {
    const user = requestAuthRegister("asxschro@gmail.com", "password", "Anton", "Sangalang");
    const channel = requestChannelsCreate(user.token, 'COMP1531', isPublicChannel);
    const user2 = requestAuthRegister('asxschro2@gmail.com', "passwword2", "Anton2", "Sangalang2");
    const user3 = requestAuthRegister('asxschro3@gmail.com', "passwword3", "Anton3", "Sangalang3");
    requestChannelJoin(user2.token, channel.channelId);
    requestChannelJoin(user3.token, channel.channelId);
    requestAddOwner(user.token, channel.channelId, user2.authUserId);

    expect(requestRemoveOwner(user2.token, channel.channelId, user3.authUserId).statusCode).toStrictEqual(HTTPError400);
  });

  test('Working Test', () => {
    const user = requestAuthRegister("asxschro@gmail.com", "password", "Anton", "Sangalang");
    const channel = requestChannelsCreate(user.token, 'COMP1531', isPublicChannel);
    const user2 = requestAuthRegister('asxschro2@gmail.com', "passwword2", "Anton2", "Sangalang2");
    requestChannelJoin(user2.token, channel.channelId);
    requestAddOwner(user.token, channel.channelId, user2.authUserId);
    expect(requestRemoveOwner(user.token, channel.channelId, user2.authUserId)).toStrictEqual({});
    expect(requestAddOwner(user.token, channel.channelId, user2.authUserId)).toStrictEqual({});
  });
});