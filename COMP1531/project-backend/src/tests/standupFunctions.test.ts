import {
  requestAuthRegister,
  requestClear,
  requestChannelsCreate,
  requeststandupStart,
  requeststandupActive,
  requeststandupSend,
  HTTPError400,
  HTTPError403,
  requestChannelInvite,
  requestChannelMessages,
} from '../testpaths';

const messageBeeMovieA = "According to all known laws of aviation, there is no way that a bee should be able to fly.Its wings are too small to get its fat little body off the ground.                                     ";
const messageBeeMovieB = "The bee, of course, flies anyway because bees don't care what humans think is impossible. Cut to Barry's room, where he's picking out what to wear.                                               ";
const messageBeeMovieC = "Barry	Yellow, black. Yellow, black. Yellow, black. Yellow, black. Ooh, black and yellow! Yeah, let's shake it up a little. Barry uses honey from a dispenser to style his hair, rinse his mouth, and then applies it to his armpits."
const messageBeeMovie = messageBeeMovieA + messageBeeMovieB + messageBeeMovieC + messageBeeMovieA + messageBeeMovieB + messageBeeMovieC + messageBeeMovieA + messageBeeMovieB + messageBeeMovieC + messageBeeMovieA + messageBeeMovieB + messageBeeMovieC;

const userJames = { email: "james@hotmail.com", password: "password", nameFirst: "James", nameLast: "Humphries"};
const userTom = { email: "tom@hotmail.com", password: "Tompassword", nameFirst: "Tom", nameLast: "Holland" };

requestClear();
beforeEach(() => {
  requestClear();
});

//////////////////////////
///       TESTS        ///
//////////////////////////
describe('standup/start tests', () => {

	test('invalid standup/start - Combining tests to decrease functional test times', async () => {
    let JamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    let Tomobject = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    let CrunchieChannel = requestChannelsCreate(JamesObject.token, "Crunchie", true);
    // - invalid token
    expect(requeststandupStart(JamesObject.token + 1, CrunchieChannel.channelId, 0.2).statusCode).toStrictEqual(HTTPError403);
    // - channelId does not refer to a valid channel
    expect(requeststandupStart(JamesObject.token, CrunchieChannel.channelId + 10, 0.2).statusCode).toStrictEqual(HTTPError400);
    // - length is a negative integer
    expect(requeststandupStart(JamesObject.token, CrunchieChannel.channelId, -10).statusCode).toStrictEqual(HTTPError400);
    // - channelId is valid and the authorised user is not a member of the channel
    expect(requeststandupStart(Tomobject.token, CrunchieChannel.channelId, 0.2).statusCode).toStrictEqual(HTTPError403);
    // - an active standup is currently running in the channel
    requeststandupStart(JamesObject.token, CrunchieChannel.channelId, 0.6);
    expect(requeststandupStart(JamesObject.token, CrunchieChannel.channelId, 0.2).statusCode).toStrictEqual(HTTPError400);
    await awaitTimeout(1.6);
	});

  test('valid standup/start', async () => {
    let JamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    let Tomobject = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    expect(Tomobject.authUserId).toStrictEqual(expect.any(Number));
    let CrunchieChannel = requestChannelsCreate(JamesObject.token, "Crunchie", true);
    
    requeststandupStart(JamesObject.token, CrunchieChannel.channelId, 0.6);
    expect(requeststandupStart(JamesObject.token, CrunchieChannel.channelId, 0.2).statusCode).toStrictEqual(HTTPError400);
    await awaitTimeout(1.5);
	});
  
  
});
  
describe('standup/active tests', () => {

	test('invalid standup/active - invalid token', async () => {
    let JamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    let Tomobject = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    let CrunchieChannel = requestChannelsCreate(JamesObject.token, "Crunchie", true);
    let LocalCrunchieChannel = requestChannelsCreate(JamesObject.token, "LocalCrunchie", true);
    requeststandupStart(JamesObject.token, LocalCrunchieChannel.channelId, 0.2);
    expect(requeststandupActive(JamesObject.token + 1, CrunchieChannel.channelId).statusCode).toStrictEqual(HTTPError403);
    await awaitTimeout(0.8);
	});

	test('invalid standup/active - channelId does not refer to a valid channel', async () => {
    let JamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    let CrunchieChannel = requestChannelsCreate(JamesObject.token, "Crunchie", true);
    let LocalCrunchieChannel = requestChannelsCreate(JamesObject.token, "LocalCrunchie", true);
    requeststandupStart(JamesObject.token, LocalCrunchieChannel.channelId, 0.2);
    expect(requeststandupActive(JamesObject.token, CrunchieChannel.channelId + LocalCrunchieChannel.channelId + 2).statusCode).toStrictEqual(HTTPError400);
    await awaitTimeout(0.8);
	});

  test('invalid standup/active - channelId is valid and the authorised user is not a member of the channel', async () => {
    let JamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    let Tomobject = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    let CrunchieChannel = requestChannelsCreate(JamesObject.token, "Crunchie", true);
    requeststandupStart(Tomobject.token, CrunchieChannel.channelId, 0.2);
    expect(requeststandupActive(Tomobject.token, CrunchieChannel.channelId).statusCode).toStrictEqual(HTTPError403);
    await awaitTimeout(0.8);
	});

});

describe('standup/send tests', () => {

	test('invalid standup/send - invalid token', async () => {
    let JamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    let CrunchieChannel = requestChannelsCreate(JamesObject.token, "Crunchie", true);
    let LocalCrunchieChannel = requestChannelsCreate(JamesObject.token, "LocalCrunchie", true);
    requeststandupStart(JamesObject.token, LocalCrunchieChannel.channelId, 0.2);
    expect(requeststandupSend(JamesObject.token + 1, CrunchieChannel.channelId, "This should be logged").statusCode).toStrictEqual(HTTPError403);
    await awaitTimeout(0.8);
	});

	test('invalid standup/send - channelId does not refer to a valid channel', async () => {
    let JamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    let CrunchieChannel = requestChannelsCreate(JamesObject.token, "Crunchie", true);
    let LocalCrunchieChannel = requestChannelsCreate(JamesObject.token, "LocalCrunchie", true);
    requeststandupStart(JamesObject.token, LocalCrunchieChannel.channelId, 0.2);
    expect(requeststandupSend(JamesObject.token, CrunchieChannel.channelId + LocalCrunchieChannel.channelId + 2, "This should be logged").statusCode).toStrictEqual(HTTPError400);
    await awaitTimeout(0.8);
	});

  test('invalid standup/send - length of message is over 1000 characters', async () => {
    let JamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    let CrunchieChannel = requestChannelsCreate(JamesObject.token, "Crunchie", true);
    let LocalCrunchieChannel = requestChannelsCreate(JamesObject.token, "LocalCrunchie", true);
    requeststandupStart(JamesObject.token, LocalCrunchieChannel.channelId, 0.2);
    expect(requeststandupSend(JamesObject.token, CrunchieChannel.channelId, messageBeeMovie).statusCode).toStrictEqual(HTTPError400);
    await awaitTimeout(0.8);
	});

  test('invalid standup/send - an active standup is not currently running in the channel', async () => {
    let JamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    let CrunchieChannel = requestChannelsCreate(JamesObject.token, "Crunchie", true);
    expect(requeststandupSend(JamesObject.token, CrunchieChannel.channelId, "This should be logged").statusCode).toStrictEqual(HTTPError400);
    await awaitTimeout(0.8);
	});

  test('invalid standup/send - channelId is valid and the authorised user is not a member of the channel', async () => {
    let JamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    let Tomobject = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    let CrunchieChannel = requestChannelsCreate(JamesObject.token, "Crunchie", true);
    requeststandupStart(JamesObject.token, CrunchieChannel.channelId, 0.2);
    expect(requeststandupSend(Tomobject.token, CrunchieChannel.channelId, "This should be logged").statusCode).toStrictEqual(HTTPError403);
    await awaitTimeout(0.8);
	});

}); 

describe("Valid StandUp Functional Test", () => {

  test('Valid standup/active - Send messages to the standup', async () => {
    
    let JamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    let Tomobject = requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    let LocalCrunchieChannel = requestChannelsCreate(JamesObject.token, "LocalCrunchie", true);
    requestChannelInvite(JamesObject.token, LocalCrunchieChannel.channelId, Tomobject.authUserId);
    expect(requeststandupActive(JamesObject.token, LocalCrunchieChannel.channelId).isActive === false);
    expect(requeststandupActive(JamesObject.token, LocalCrunchieChannel.channelId).timeFinish === null);
    requeststandupStart(JamesObject.token, LocalCrunchieChannel.channelId, 0.7);
    expect(requeststandupActive(JamesObject.token, LocalCrunchieChannel.channelId).isActive === true);
    requeststandupSend(JamesObject.token, LocalCrunchieChannel.channelId, "This should be logged");
    requeststandupSend(JamesObject.token, LocalCrunchieChannel.channelId, "And this");
    const returnObject = requeststandupSend(Tomobject.token, LocalCrunchieChannel.channelId, "Don't forget about me");
    await awaitTimeout(3.8);
    expect(returnObject).toStrictEqual({});
    const channelMessagesObject = requestChannelMessages(JamesObject.token, LocalCrunchieChannel.channelId, 0);
    // Expected response
    expect(channelMessagesObject.messages[0].message).toStrictEqual("jameshumphries: This should be logged\njameshumphries: And this\ntomholland: Don't forget about me")
	});

});


const awaitTimeout = (delay: number): any =>
  new Promise(resolve => setTimeout(resolve, delay * 1000));
