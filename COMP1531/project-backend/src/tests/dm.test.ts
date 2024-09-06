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
  requestDmMessages,
  requestSendDmMessage,
  requestChannelInvite,
  requestChannelDetails,
  requestChannelJoin,
  requestChannelLeave,
  requestAddOwner,
  requestRemoveOwner,
  requestChannelMessages,
  requestUsersAll,
  HTTPError400,
  HTTPError403,
} from '../testpaths';
// ========================================================================= //

// inputs
const userJames = { email: "james@hotmail.com", password: "password", nameFirst: "James", nameLast: "Humphries"};
const userTom = { email: "tom@hotmail.com", password: "password", nameFirst: "Tom", nameLast: "Holland" };
const userMax = { email: "max@hotmail.com", password: "password", nameFirst: "Max", nameLast: "Verstappen" };
const userFernando = { email: "fernando@hotmail.com", password: "password", nameFirst: "Fernando", nameLast: "Alonso" };
const messageBeeMovieA = "According to all known laws of aviation, there is no way that a bee should be able to fly.Its wings are too small to get its fat little body off the ground.                                     ";
const messageBeeMovieB = "The bee, of course, flies anyway because bees don't care what humans think is impossible. Cut to Barry's room, where he's picking out what to wear.                                               ";
const messageBeeMovieC = "Barry Yellow, black. Yellow, black. Yellow, black. Yellow, black. Ooh, black and yellow! Yeah, let's shake it up a little. Barry uses honey from a dispenser to style his hair, rinse his mouth, and then applies it to his armpits."

// outputs
const errorResponse = { error: 'error' };
const OK = 200;

beforeEach(() => {
  requestClear();
});

describe('testing /dm/create/v1', () => {
  
  test('invalid input - any uId is not a valid user', () => {
		// user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);

		const users = [];
		users.push(user1.authUserId);
		users.push(user2.authUserId + 1);
    expect(requestDmCreate(user1.token, users).statusCode).toStrictEqual(HTTPError400);
  });
  test('invalid input - duplicate uIds', () => {
		// user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);

		const users = [];
		users.push(user1.authUserId);
		users.push(user2.authUserId);
		users.push(user1.authUserId);
    expect(requestDmCreate(user1.token, users).statusCode).toStrictEqual(HTTPError400);
  });
  test('valid input', () => {
    // user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);

    // makes a new dm consisting of user1 and user2
		const dmId1 = requestDmCreate(user1.token, [user2.authUserId]);

    const expectedOutput = {
      name: userJames.nameFirst.toLowerCase() + userJames.nameLast.toLowerCase() + ', ' + userTom.nameFirst.toLowerCase() + userTom.nameLast.toLowerCase(),
      members: [user1.authUserId, user2.authUserId],
    }
    
    const receivedOutput = requestDmDetails(user2.token, dmId1.dmId)
    // console.log(receivedOutput);
    const filteredReceivedOutput = {
      name: receivedOutput.name,
      members: [],
    }

    for (const element in receivedOutput.members) {
      filteredReceivedOutput.members.push(receivedOutput.members[element].uId);
    }
    // tests whether dm/create/v1 makes a dm with the correct details or not
    expect(filteredReceivedOutput).toStrictEqual(expectedOutput);
    // tests whether dm/create/v1 returns the correct output format
    expect(requestDmCreate(user1.token, [user2.authUserId])).toStrictEqual({ dmId: expect.any(Number) });
    
  });
  test('valid input', () => {
    // user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    // user3 should have uId = 3
    const user3 = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);
    
    // makes a new dm consisting of user1 and user3 and user2
		const dmId1 = requestDmCreate(user2.token, [user1.authUserId, user3.authUserId]);

    const expectedOutput = {
      name: userJames.nameFirst.toLowerCase() + userJames.nameLast.toLowerCase() + ', ' + userMax.nameFirst.toLowerCase() + userMax.nameLast.toLowerCase() + ', ' + userTom.nameFirst.toLowerCase() + userTom.nameLast.toLowerCase(),
      members: [user2.authUserId, user1.authUserId, user3.authUserId],
    }
    
    const receivedOutput = requestDmDetails(user2.token, dmId1.dmId)
    // console.log(receivedOutput);
    const filteredReceivedOutput = {
      name: receivedOutput.name,
      members: [],
    }

    for (const element in receivedOutput.members) {
      filteredReceivedOutput.members.push(receivedOutput.members[element].uId);
    }
    // tests whether dm/create/v1 makes a dm with the correct details or not
    expect(filteredReceivedOutput).toStrictEqual(expectedOutput);
    // tests whether dm/create/v1 returns the correct output format
    expect(requestDmCreate(user1.token, [user2.authUserId])).toStrictEqual({ dmId: expect.any(Number) });
    
  });
});


describe('testing /dm/list/v1', () => {
  
  test('valid input - user does not belong to any DM', () => {
    // user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    // user3 should have uId = 3
    const user3 = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);
    // user4 should have uId = 4
    const user4 = requestAuthRegister(userFernando.email, userFernando.password, userFernando.nameFirst, userFernando.nameLast);

    // makes a new dm consisting of user1 and user2
		const dmId1 = requestDmCreate(user1.token, [user2.authUserId]);
    
    // makes a new dm consisting of user2 and user3
		const dmId2 = requestDmCreate(user2.token, [user3.authUserId]);

    expect(requestDmList(user4.token)).toStrictEqual({ dms : [] });
  });
  test('valid input - user does belong to a single DM', () => {
    // user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    // user3 should have uId = 3
    const user3 = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);
    // user4 should have uId = 4
    const user4 = requestAuthRegister(userFernando.email, userFernando.password, userFernando.nameFirst, userFernando.nameLast);

    // makes a new dm consisting of user1 and user2
		const dmId1 = requestDmCreate(user1.token, [user2.authUserId]);
    
    // makes a new dm consisting of user2 and user3
		const dmId2 = requestDmCreate(user2.token, [user3.authUserId]);

    const expectedOutput = [dmId1.dmId];
    const receivedOutput = requestDmList(user1.token);
    const filteredReceivedOutput = [];
    for (const element in receivedOutput.dms) {
      filteredReceivedOutput.push(receivedOutput.dms[element].dmId);
    }
    
    expect(filteredReceivedOutput).toStrictEqual(expectedOutput);
  });
  test('valid input - user does belong to multiple DMs', () => {
    // user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    // user3 should have uId = 3
    const user3 = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);
    // user4 should have uId = 4
    const user4 = requestAuthRegister(userFernando.email, userFernando.password, userFernando.nameFirst, userFernando.nameLast);
    
    // makes a new dm consisting of user1 and user2
		const dmId1 = requestDmCreate(user1.token, [user2.authUserId]);
    
    // makes a new dm consisting of user2 and user3
		const dmId2 = requestDmCreate(user2.token, [user3.authUserId]);
    
    const expectedOutput = [dmId1.dmId, dmId2.dmId];
    const receivedOutput = requestDmList(user2.token);
    const filteredReceivedOutput = [];
    for (const element in receivedOutput.dms) {
      filteredReceivedOutput.push(receivedOutput.dms[element].dmId);
    }

    expect(filteredReceivedOutput).toStrictEqual(expectedOutput);
  });
});

describe('testing /dm/remove/v1', () => {
  
  test('invalid input - invalid dmId', () => {
    // user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);

    // makes a new dm consisting of user1 and user2
		const dmId1 = requestDmCreate(user1.token, [user2.authUserId]);
    
    expect(requestDmRemove(user1.token, dmId1.dmId + 1).statusCode).toStrictEqual(HTTPError400);
  });

  test('invalid input - valid dmId but user is not member of the DM', () => {
    // user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    // user3 should have uId = 3
    const user3 = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);

    // makes a new dm consisting of user1 and user2
		const dmId1 = requestDmCreate(user1.token, [user2.authUserId]);

    expect(requestDmRemove(user3.token, dmId1.dmId).statusCode).toStrictEqual(HTTPError403);
  });

  test('invalid input - valid dmId but user is not the original creator of the DM', () => {
    // user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    
    // makes a new dm consisting of user1 and user2
		const dmId1 = requestDmCreate(user1.token, [user2.authUserId]);

    expect(requestDmRemove(user2.token, dmId1.dmId).statusCode).toStrictEqual(HTTPError403);
  });

  test('invalid input - dmId is valid and the authorised user is no longer in the DM', () => {
    // user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    
    // makes a new dm consisting of user1 and user2
		const dmId1 = requestDmCreate(user1.token, [user2.authUserId]);
    requestDmLeave(user1.token, dmId1.dmId);
    expect(requestDmRemove(user1.token, dmId1.dmId).statusCode).toStrictEqual(HTTPError403);
  });

  test('valid input', () => {
    // user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    // user3 should have uId = 3
    const user3 = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);
    // user4 should have uId = 4
    const user4 = requestAuthRegister(userFernando.email, userFernando.password, userFernando.nameFirst, userFernando.nameLast);

    // makes a new dm consisting of user1 and user2
		const dmId1 = requestDmCreate(user1.token, [user2.authUserId]);
    // makes a new dm consisting of user3 and user4
		const dmId2 = requestDmCreate(user3.token, [user2.authUserId, user4.authUserId]);

    // should successfully remove dmId1
    expect(requestDmRemove(user1.token, dmId1.dmId)).toStrictEqual({ });
    // should fail as dmId1 does not exist anymore
    expect(requestDmDetails(user1.token, dmId1.dmId).statusCode).toStrictEqual(HTTPError400);
    
    const expectedOutput = [dmId2.dmId];
    const receivedOutput = requestDmList(user2.token);
    const filteredReceivedOutput = [];
    for (const element in receivedOutput.dms) {
      filteredReceivedOutput.push(receivedOutput.dms[element].dmId);
    }
    expect(filteredReceivedOutput).toStrictEqual(expectedOutput);
  });
  // TEMP LINE, TO SEE FROM THE TERMINAL
  const user3 = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);
});

describe('testing /dm/details/v1', () => {
  
  test('invalid input - invalid dmId', () => {
    // user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);

    // makes a new dm consisting of user1 and user2
		const dmId1 = requestDmCreate(user1.token, [user2.authUserId]);
    
    expect(requestDmDetails(user1.token, dmId1.dmId + 1).statusCode).toStrictEqual(HTTPError400);
  });
  test('invalid input - valid dmId but user is not member of the DM', () => {
    // user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    // user3 should have uId = 3
    const user3 = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);
    // user4 should have uId = 4
    const user4 = requestAuthRegister(userFernando.email, userFernando.password, userFernando.nameFirst, userFernando.nameLast);

    // makes a new dm consisting of user1 and user2
		const dmId1 = requestDmCreate(user1.token, [user2.authUserId]);
    
    // makes a new dm consisting of user2 and user3
		const dmId2 = requestDmCreate(user2.token, [user3.authUserId]);

    expect(requestDmDetails(user4.token, dmId1.dmId).statusCode).toStrictEqual(HTTPError400);
  });
  test('valid input', () => {
    // user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    // user3 should have uId = 3
    const user3 = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);

    // makes a new dm consisting of user1 and user2
		const dmId1 = requestDmCreate(user1.token, [user2.authUserId]);
    
    // makes a new dm consisting of user2 and user3
		const dmId2 = requestDmCreate(user2.token, [user3.authUserId]);
    const expectedOutput = {
      name: '',
      members: [],
    };
    const user2Dms = requestDmList(user2.token);
    for (const element in user2Dms.dms) {
      if (dmId1.dmId === user2Dms.dms[element].dmId) {
        expectedOutput.name = user2Dms.dms[element].name;
        expectedOutput.members = [user1.authUserId, user2.authUserId];
      }
    };

    const receivedOutput = requestDmDetails(user2.token, dmId1.dmId);
    // console.log(receivedOutput);
    const filteredReceivedOutput = {
      name: receivedOutput.name,
      members: [],
    };
    for (const element in receivedOutput.members) {
      filteredReceivedOutput.members.push(receivedOutput.members[element].uId);
    }

    expect(filteredReceivedOutput).toStrictEqual(expectedOutput);
  });

});

describe('testing /dm/leave/v1', () => {
  
  test('invalid input - invalid dmId', () => {
    // user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);

    // makes a new dm consisting of user1 and user2
		const dmId1 = requestDmCreate(user1.token, [user2.authUserId]);
    
    expect(requestDmLeave(user1.token, dmId1.dmId + 1).statusCode).toStrictEqual(HTTPError400);
  });

  test('invalid input - valid dmId but user is not member of the DM', () => {
    // user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    // user3 should have uId = 3
    const user3 = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);
    // user4 should have uId = 4
    const user4 = requestAuthRegister(userFernando.email, userFernando.password, userFernando.nameFirst, userFernando.nameLast);

    // makes a new dm consisting of user1 and user2
		const dmId1 = requestDmCreate(user1.token, [user2.authUserId]);
    
    // makes a new dm consisting of user2 and user3
		const dmId2 = requestDmCreate(user2.token, [user3.authUserId]);

    expect(requestDmLeave(user4.token, dmId1.dmId).statusCode).toStrictEqual(HTTPError400);
  });
  
  test('invalid input - valid dmId but user is no longer a member of the DM', () => {
    // user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);

    // makes a new dm consisting of user1 and user2
		const dmId1 = requestDmCreate(user1.token, [user2.authUserId]);
    // user2 leaves dmId1
    requestDmLeave(user2.token, dmId1.dmId);

    // tests whether the user who left can still access the dm's details or not
    expect(requestDmDetails(user2.token, dmId1.dmId).statusCode).toStrictEqual(HTTPError400);
  });

  test('valid input - member leaves', () => {
    // user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    // makes a new dm consisting of user1 and user2
		const dmId1 = requestDmCreate(user1.token, [user2.authUserId]);

    const expectedOutput = {
      name: userJames.nameFirst.toLowerCase() + userJames.nameLast.toLowerCase() + ', ' + userTom.nameFirst.toLowerCase() + userTom.nameLast.toLowerCase(),
      members: [user1.authUserId],
    }
    
    // tests whether dm/leave/v1 returns the correct output format
    expect(requestDmLeave(user2.token, dmId1.dmId)).toStrictEqual({ });

    const receivedOutput = requestDmDetails(user1.token, dmId1.dmId)
    const filteredReceivedOutput = {
      name: receivedOutput.name,
      members: [],
    }
    for (const element in receivedOutput.members) {
      filteredReceivedOutput.members.push(receivedOutput.members[element].uId);
    }

    // tests whether dm/leave/v1 updates the dm's details
    expect(filteredReceivedOutput).toStrictEqual(expectedOutput);
  });

  test('valid input - creator leaves', () => {
    // user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    // makes a new dm consisting of user1 and user2
		const dmId1 = requestDmCreate(user1.token, [user2.authUserId]);

    const expectedOutput = {
      name: userJames.nameFirst.toLowerCase() + userJames.nameLast.toLowerCase() + ', ' + userTom.nameFirst.toLowerCase() + userTom.nameLast.toLowerCase(),
      members: [user2.authUserId],
    }
    
    // tests whether dm/leave/v1 returns the correct output format
    expect(requestDmLeave(user1.token, dmId1.dmId)).toStrictEqual({ });

    const receivedOutput = requestDmDetails(user2.token, dmId1.dmId)
    const filteredReceivedOutput = {
      name: receivedOutput.name,
      members: [],
    }
    for (const element in receivedOutput.members) {
      filteredReceivedOutput.members.push(receivedOutput.members[element].uId);
    }

    // tests whether dm/leave/v1 updates the dm's details
    expect(filteredReceivedOutput).toStrictEqual(expectedOutput);
  });
  
});

describe('testing /dm/messages/v1', () => {
  
  test('invalid input - invalid dmId', () => {
    // user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);

    // makes a new dm consisting of user1 and user2
		const dmId1 = requestDmCreate(user1.token, [user2.authUserId]);
    
    expect(requestDmMessages(user1.token, dmId1.dmId + 1, 0).statusCode).toStrictEqual(HTTPError400);
  });

  test('invalid input - valid dmId but user is not member of the DM', () => {
    // user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    // user3 should have uId = 3
    const user3 = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);
    // user4 should have uId = 4
    const user4 = requestAuthRegister(userFernando.email, userFernando.password, userFernando.nameFirst, userFernando.nameLast);

    // makes a new dm consisting of user1 and user2
		const dmId1 = requestDmCreate(user1.token, [user2.authUserId]);
    
    // makes a new dm consisting of user2 and user3
		const dmId2 = requestDmCreate(user2.token, [user3.authUserId]);

    expect(requestDmMessages(user4.token, dmId1.dmId, 0).statusCode).toStrictEqual(HTTPError400);
  });

  test('invalid input - start bigger than number of messages in DM', () => {
    // user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);

    // makes a new dm consisting of user1 and user2
		const dmId1 = requestDmCreate(user1.token, [user2.authUserId]);
    
    expect(requestDmMessages(user1.token, dmId1.dmId, 10).statusCode).toStrictEqual(HTTPError400);
  });

  test('valid input - checking order of messages', () => {
    // user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);

    // makes a new dm consisting of user1 and user2
		const dmId1 = requestDmCreate(user1.token, [user2.authUserId]);
    requestSendDmMessage(user1.token, dmId1.dmId, "I was first");
    requestSendDmMessage(user1.token, dmId1.dmId, "I was second");
    requestSendDmMessage(user1.token, dmId1.dmId, "I was third");
    requestSendDmMessage(user1.token, dmId1.dmId, "I was fourth");
    const start = 0;
    const receivedOutput = requestDmMessages(user1.token, dmId1.dmId, start);
    expect(receivedOutput.messages[0].message).toStrictEqual("I was fourth");
  });

  test('valid input - dm with more than 50 messages', () => {
    // user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);

    // makes a new dm consisting of user1 and user2
		const dmId1 = requestDmCreate(user1.token, [user2.authUserId]);
    for (let i: number = 0; i < 100; i++) {
      requestSendDmMessage(user1.token, dmId1.dmId, messageBeeMovieA);
    }
    
    const start = 0;
    const receivedOutput = requestDmMessages(user1.token, dmId1.dmId, start);
    const filteredReceivedOutput = {
      start: receivedOutput.start,
      end: receivedOutput.end,
      numberOfMessages: receivedOutput.messages.length,
    }
    
    const expectedOutput = {
      start: start,
      end: start + 50,
      numberOfMessages: 50,
    }
    expect(filteredReceivedOutput).toStrictEqual(expectedOutput);
  });
/*
  test('valid input - base case', () => {
    // user1 should have uId = 1
    const user1 = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
		// user2 should have uId = 2
    const user2 = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);

    // makes a new dm consisting of user1 and user2
		const dmId1 = requestDmCreate(user1.token, [user2.authUserId]);
    const mssgId1 = requestSendDmMessage(user1.token, dmId1.dmId, messageBeeMovieA);
    const mssgId2 = requestSendDmMessage(user1.token, dmId1.dmId, messageBeeMovieC);
    const mssgId3 = requestSendDmMessage(user1.token, dmId1.dmId, messageBeeMovieB);
    
    const start = 0;
    const receivedOutput = requestDmMessages(user1.token, dmId1.dmId, start);
    const filteredReceivedOutput = {
      start: receivedOutput.start,
      end: receivedOutput.end,
      messages: [],
    }
    for (const element in receivedOutput.messages) {
      filteredReceivedOutput.messages.unshift(receivedOutput.messages[element].message)
    }
    
    const expectedOutput = {
      start: start,
      end: -1,
      messages: [messageBeeMovieB, messageBeeMovieC, messageBeeMovieA],
    }

    // console.log(receivedOutput);

    expect(filteredReceivedOutput).toStrictEqual(expectedOutput);
    expect(requestMessageEdit(user1.token, mssgId3.messageId, "new message")).toStrictEqual({});
    expect(requestMessageRemove(user1.token,mssgId3.messageId)).toStrictEqual({});
  });
*/
});

