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
const userMax = { email: "max@hotmail.com", password: "password", nameFirst: "Max", nameLast: "Verstappen" };
const userShakira = { email: "shakira@gmail.com", password: "password", nameFirst: "Shakira", nameLast: "Li" };
const userAndrew = {email: "andrew@gmail.com", password: "password", nameFirst: "Andrew", nameLast: "Taylor"};
const messageJames = "Hello darkness my old friend";
const messageJames2 = "Functional tests almost take longer than the actual scripts";
const messageBeeMovieA = "According to all known laws of aviation, there is no way that a bee should be able to fly.Its wings are too small to get its fat little body off the ground."; 
//for channel inputs

const Crunchie1 = { name: 'Crunchie', isPublic: true };
const CrunchiePrivate = { name: 'CrunchiePrivate', isPublic: false };
const channelNameLong = { name: 'somethingmorethan20chars', isPublic: true }
const channelNameShort = { name: '', isPublic: true }


//tests:
beforeEach(() => {
  requestClear();
});

describe('testing creating a channel and listing it', () => {
  
  test('Printing entire list for public and private channel', () => {
    //creates user with authUserId = 1
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const crunchieChan = requestChannelsCreate(james.token, Crunchie1.name, Crunchie1.isPublic);
    const crunchieChanPrivate = requestChannelsCreate(james.token, CrunchiePrivate.name, false);
    const allChannels = requestChannelsListAll(james.token);
    // console.log("User: " + JSON.stringify(james));
    // console.log("crunchieChan: " + JSON.stringify(crunchieChan));
    // console.log("crunchieChanPrivate: " + JSON.stringify(crunchieChanPrivate));
    // console.log("ListAll: " + JSON.stringify(allChannels));
    expect(allChannels).toStrictEqual(
      { channels: [
        {
          channelId: crunchieChan.channelId,
          name: Crunchie1.name
        },
        {
          channelId: crunchieChanPrivate.channelId,  
          name: CrunchiePrivate.name
        }
      ]}
    );
  });

  test('Test for adding in users and printing the entire list', () => {
    const James = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const Tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const Max = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);
    const crunchieChan = requestChannelsCreate(James.token, Crunchie1.name, Crunchie1.isPublic);
    const crunchieChanPrivate = requestChannelsCreate(James.token, CrunchiePrivate.name, false);
    const allChannels = requestChannelsListAll(James.token);
    expect(requestChannelInvite(James.token, crunchieChan.channelId, Tom.authUserId)).toEqual({});
    expect(requestChannelJoin(Max.token, crunchieChan.channelId)).toEqual({});
    const chanDetails = requestChannelDetails(James.token, crunchieChan.channelId);
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
    },
    {
      uId: Max.authUserId,
      email: userMax.email,
      nameFirst: userMax.nameFirst,
      nameLast: userMax.nameLast,
      handleStr: userMax.nameFirst.toLowerCase() + userMax.nameLast.toLowerCase(),
      profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
    }];
    expect(chanDetails).toStrictEqual(
      { name: Crunchie1.name, isPublic: Crunchie1.isPublic, 
        ownerMembers: ownerMembersDeets, 
        allMembers: allMembersDeets
        }
    );

  });
  
  test('Send a message from the authorised user to the channel specified by channelId.', () => {
    const james = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const crunchieChan = requestChannelsCreate(james.token, Crunchie1.name, Crunchie1.isPublic);
    const crunchieChanPrivate = requestChannelsCreate(james.token, CrunchiePrivate.name, false);
    const allChannels = requestChannelsListAll(james.token);
    requestMessageSend(james.token, crunchieChan.channelId, messageJames2);
    requestMessageSend(james.token, crunchieChan.channelId, messageJames);
    requestMessageSend(james.token, crunchieChan.channelId, messageJames2);
    expect(allChannels).toStrictEqual(
      { channels: [
        {
          channelId: crunchieChan.channelId,
          name: Crunchie1.name
        },
        {
          channelId: crunchieChanPrivate.channelId,  
          name: CrunchiePrivate.name
        }
      ]}
    );
  }); 
  
  test('Create a DM message, and remove a user.', () => {
    const James = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const Tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const dm1 = requestDmCreate(James.token, [Tom.authUserId]);
    const dm2 = requestDmCreate(James.token, [Tom.authUserId]);

    const dmListJames = requestDmList(James.token);
    //  { dmId, name }
    const JamesInfo = requestUserProfile(James.token, James.authUserId);
    const TomInfo = requestUserProfile(Tom.token, Tom.authUserId);

    const handleDm1 = JamesInfo.handleStr + ', ' + TomInfo.handleStr;
    const handleDm2 = JamesInfo.handleStr + ', ' + TomInfo.handleStr;
    const expectedListJames = [{dmId: dm1, name: handleDm1}, {dmId: dm2, name: handleDm2}];
    // console.log("User: " + JSON.stringify(James));
    // console.log("UserJamesInfo: " + JSON.stringify(JamesInfo));
    const dm1Object = requestDmDetails(James.token, dm1.dmId);
    const dm2Object = requestDmDetails(James.token, dm2.dmId);
    requestDmLeave(Tom.token, dm1.dmId);
    const expectdm1Object = {name: handleDm1, members: [JamesInfo, TomInfo] };
    const expectdm2Object = {name: handleDm2, members: [JamesInfo, TomInfo] };

    // console.log("dm1Object: " + JSON.stringify(dm1Object));
    // console.log("dm2Object: " + JSON.stringify(dm2Object));

  });

  test('Create a DM message, edit it and then leave the dm.', () => {
    const James = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const Tom = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);

    const crunchieChan = requestChannelsCreate(James.token, Crunchie1.name, Crunchie1.isPublic);
    requestMessageSend(James.token, crunchieChan.channelId, messageBeeMovieA);
    const dm1 = requestDmCreate(James.token, [Tom.authUserId]);
    const dmListJames = requestDmList(James.token);
    //  { dmId, name }
    const JamesInfo = requestUserProfile(James.token, James.authUserId).user;
    const TomInfo = requestUserProfile(Tom.token, Tom.authUserId).user;

    const handleDm1 = JamesInfo.handleStr + ', ' + TomInfo.handleStr;
    const expectedListJames = {dms: [{dmId: dm1.dmId, name: handleDm1} ] };

    const dm1Object = requestDmDetails(James.token, dm1.dmId);
    const expectdm1Object = {name: handleDm1, members: [JamesInfo, TomInfo] };

    expect(dmListJames).toEqual(expectedListJames);
    expect(dm1Object).toEqual(expectdm1Object);

  });

});
