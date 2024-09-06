// ========================================================================= //
// Wrapper functions
import {
    requestAuthRegister,
    requestClear,
    requestUserProfile,
    requestUserProfileSetName,
    requestUserProfileSetEmail,
    requestUserProfileSetHandle,
    requestUsersAll,
    requestAdminUserRemove,
    requestAdminUserPermissions,
    requestChannelDetails,
    requestChannelInvite,
    requestChannelsCreate,
    requestAddOwner,
    requestDmCreate,
    requestDmDetails,
    requestDmList,
    requestSendDmMessage, 
    requestMessageSend, 
    requestDmMessages,
    HTTPError400,
    HTTPError403,
} from '../testpaths';
// ========================================================================= //

/////////////////
// Iteration 3 //
/////////////////
beforeEach(() => {
    requestClear();
});
  
// Output Constants
const OK = 200;

// User Constants
const userShakira = { email: "shakira@gmail.com", password: "password", nameFirst: "Shakira", nameLast: "Li" };
const userJames = { email: "james@gmail.com", password: "password", nameFirst: "James", nameLast: "Humphries"};
const userAndrew = {email: "andrew@gmail.com", password: "password", nameFirst: "Andrew", nameLast: "Taylor"};
const userMax = { email: "max@hotmail.com", password: "password", nameFirst: "Max", nameLast: "Verstappen" };

// Permission Constants
const ownerPermission = 1;
const memberPermission = 2;

// Channel Constants
const Crunchie1 = { name: 'Crunchie', isPublic: true };
const Crunchie2 = { name: 'Crunchie2', isPublic: false };
const Crunchie3 = { name: 'Crunchie3', isPublic: true };

// Message Constants
const message1 = "This is a message."
const message2 = "Testing removed user message."

/////////////////////////////////
// /admin/user/remove/v1 Tests //
/////////////////////////////////
describe('Testing admin/user/remove/v1', () => {
    test('403 Error - authUserId is not global owner', () => {
        const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
        const isShakiraGlobalOwner = true;
        const tokenJames = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
        const isJamesGlobalOwner = false;
        const tokenAndrew = requestAuthRegister(userAndrew.email, userAndrew.password, userAndrew.nameFirst, userAndrew.nameLast);
        const isAndrewGlobalOwner = false;

        expect(requestAdminUserRemove(tokenAndrew.token, tokenShakira.authUserId).statusCode).toStrictEqual(HTTPError403);
    });

    test('400 Error - invalid uId', () => {
        const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
        const isShakiraGlobalOwner = true;
        const unregisteredUser = {
            token: "1531",
            authUserId: 1511,
        };

        expect(requestAdminUserRemove(tokenShakira.token, unregisteredUser.authUserId).statusCode).toStrictEqual(HTTPError400);
    });

    test('400 Error - remove only global owner', () => {
        const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
        const isShakiraGlobalOwner = true;
        const tokenJames = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
        const isJamesGlobalOwnder = false;
        const tokenAndrew = requestAuthRegister(userAndrew.email, userAndrew.password, userAndrew.nameFirst, userAndrew.nameLast);
        const isAndrewGlobalOwner = false;

        expect(requestAdminUserRemove(tokenShakira.token, tokenShakira.authUserId).statusCode).toStrictEqual(HTTPError400);
    });
    
    test('Test successful removal of user - userProfile and usersAll output', () => {
        const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
        const isShakiraGlobalOwner = true;
        const tokenJames = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
        const isJamesGlobalOwner = false;
        const tokenAndrew = requestAuthRegister(userAndrew.email, userAndrew.password, userAndrew.nameFirst, userAndrew.nameLast);
        const isAndrewGlobalOwner = false;

        const userProfileOutputBefore = {
            user: {
                uId: tokenAndrew.authUserId,
                email: userAndrew.email,
                nameFirst: userAndrew.nameFirst,
                nameLast: userAndrew.nameLast,
                handleStr: userAndrew.nameFirst.toLowerCase() + userAndrew.nameLast.toLowerCase(),
                profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
            }
        };

        const usersAllOutputBefore = {
            users: [
                {
                    uId: tokenShakira.authUserId,
                    email: userShakira.email,
                    nameFirst: userShakira.nameFirst,
                    nameLast: userShakira.nameLast,
                    handleStr: userShakira.nameFirst.toLowerCase() + userShakira.nameLast.toLowerCase(),
                    profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
                },
                {
                    uId: tokenJames.authUserId,
                    email: userJames.email,
                    nameFirst: userJames.nameFirst,
                    nameLast: userJames.nameLast,
                    handleStr: userJames.nameFirst.toLowerCase() + userJames.nameLast.toLowerCase(),
                    profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
                },
                {
                    uId: tokenAndrew.authUserId,
                    email: userAndrew.email,
                    nameFirst: userAndrew.nameFirst,
                    nameLast: userAndrew.nameLast,
                    handleStr: userAndrew.nameFirst.toLowerCase() + userAndrew.nameLast.toLowerCase(),
                    profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
                },
            ],
        };

        // ---------- Before Removal ---------- //
        expect(requestUserProfile(tokenAndrew.token, tokenAndrew.authUserId)).toStrictEqual(userProfileOutputBefore);
        expect(requestUsersAll(tokenShakira.token)).toStrictEqual(usersAllOutputBefore);

        // ------------- Removal ------------- //
        expect(requestAdminUserRemove(tokenShakira.token, tokenAndrew.authUserId)).toStrictEqual({});
        // ------------- Removal ------------- //

        const userProfileOutputAfter = {
            user: {
                uId: tokenAndrew.authUserId,
                email: userAndrew.email,
                nameFirst: "Removed",
                nameLast: "user",
                handleStr: userAndrew.nameFirst.toLowerCase() + userAndrew.nameLast.toLowerCase(),
                profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
            }
        };

        const usersAllOutputAfter = {
            users: [
                {
                    uId: tokenShakira.authUserId,
                    email: userShakira.email,
                    nameFirst: userShakira.nameFirst,
                    nameLast: userShakira.nameLast,
                    handleStr: userShakira.nameFirst.toLowerCase() + userShakira.nameLast.toLowerCase(),
                    profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
                },
                {
                    uId: tokenJames.authUserId,
                    email: userJames.email,
                    nameFirst: userJames.nameFirst,
                    nameLast: userJames.nameLast,
                    handleStr: userJames.nameFirst.toLowerCase() + userJames.nameLast.toLowerCase(),
                    profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
                },
            ],
        };

        // ---------- After Removal ---------- //
        expect(requestUserProfile(tokenAndrew.token, tokenAndrew.authUserId)).toStrictEqual(userProfileOutputAfter);
        expect(requestUsersAll(tokenShakira.token)).toStrictEqual(usersAllOutputAfter);
    });

    test('Test successful removal of user - one channel', () => {
        const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
        const isShakiraGlobalOwner = true;
        const tokenJames = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
        const isJamesGlobalOwner = false;
        const tokenAndrew = requestAuthRegister(userAndrew.email, userAndrew.password, userAndrew.nameFirst, userAndrew.nameLast);
        const isAndrewGlobalOwner = false;

        const CrunchieChannel = requestChannelsCreate(tokenShakira.token, Crunchie1.name, Crunchie1.isPublic);
        requestChannelInvite(tokenShakira.token, CrunchieChannel.channelId, tokenJames.authUserId);
        requestChannelInvite(tokenShakira.token, CrunchieChannel.channelId, tokenAndrew.authUserId);
        requestMessageSend(tokenAndrew.token, CrunchieChannel.channelId, message1);
        requestMessageSend(tokenShakira.token, CrunchieChannel.channelId, message2);

        const ownerMembersDetailsBefore = [{
            uId: tokenShakira.authUserId,
            email: userShakira.email,
            nameFirst: userShakira.nameFirst,
            nameLast: userShakira.nameLast,
            handleStr: userShakira.nameFirst.toLowerCase() + userShakira.nameLast.toLowerCase(),
            profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
        }];

        const allMembersDetailsBefore = [{
            uId: tokenShakira.authUserId,
            email: userShakira.email,
            nameFirst: userShakira.nameFirst,
            nameLast: userShakira.nameLast,
            handleStr: userShakira.nameFirst.toLowerCase() + userShakira.nameLast.toLowerCase(),
            profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
        },
        {
            uId: tokenJames.authUserId,
            email: userJames.email,
            nameFirst: userJames.nameFirst,
            nameLast: userJames.nameLast,
            handleStr: userJames.nameFirst.toLowerCase() + userJames.nameLast.toLowerCase(),
            profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
        },
        {
            uId: tokenAndrew.authUserId,
            email: userAndrew.email,
            nameFirst: userAndrew.nameFirst,
            nameLast: userAndrew.nameLast,
            handleStr: userAndrew.nameFirst.toLowerCase() + userAndrew.nameLast.toLowerCase(),
            profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
        }];

        const channelDetailsBefore = {name: Crunchie1.name, isPublic: Crunchie1.isPublic, ownerMembers: ownerMembersDetailsBefore, allMembers: allMembersDetailsBefore};

        // ---------- Before Removal ---------- //
        expect(requestChannelDetails(tokenShakira.token, CrunchieChannel.channelId)).toStrictEqual(channelDetailsBefore);

        // ------------- Removal ------------- //
        expect(requestAdminUserRemove(tokenShakira.token, tokenAndrew.authUserId)).toStrictEqual({});
        // ------------- Removal ------------- //

        const ownerMembersDetailsAfter = [{
            uId: tokenShakira.authUserId,
            email: userShakira.email,
            nameFirst: userShakira.nameFirst,
            nameLast: userShakira.nameLast,
            handleStr: userShakira.nameFirst.toLowerCase() + userShakira.nameLast.toLowerCase(),
            profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
        }];

        const allMembersDetailsAfter = [{
            uId: tokenShakira.authUserId,
            email: userShakira.email,
            nameFirst: userShakira.nameFirst,
            nameLast: userShakira.nameLast,
            handleStr: userShakira.nameFirst.toLowerCase() + userShakira.nameLast.toLowerCase(),
            profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
        },
        {
            uId: tokenJames.authUserId,
            email: userJames.email,
            nameFirst: userJames.nameFirst,
            nameLast: userJames.nameLast,
            handleStr: userJames.nameFirst.toLowerCase() + userJames.nameLast.toLowerCase(),
            profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
        }];

        const channelDetailsAfter = {name: Crunchie1.name, isPublic: Crunchie1.isPublic, ownerMembers: ownerMembersDetailsAfter, allMembers: allMembersDetailsAfter};

        // ---------- After Removal ---------- //
        expect(requestChannelDetails(tokenShakira.token, CrunchieChannel.channelId)).toStrictEqual(channelDetailsAfter);
    });

    test('Test successful removal of user - multiple channels', () => {
        const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
        const isShakiraGlobalOwner = true;
        const tokenJames = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
        const isJamesGlobalOwner = false;
        const tokenAndrew = requestAuthRegister(userAndrew.email, userAndrew.password, userAndrew.nameFirst, userAndrew.nameLast);
        const isAndrewGlobalOwner = false;
        const tokenMax = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);
        const isMaxGlobalOwner = false;

        // user to be removed is not an owner
        const CrunchieChannel = requestChannelsCreate(tokenShakira.token, Crunchie1.name, Crunchie1.isPublic);
        requestChannelInvite(tokenShakira.token, CrunchieChannel.channelId, tokenJames.authUserId);
        requestChannelInvite(tokenShakira.token, CrunchieChannel.channelId, tokenAndrew.authUserId);

        const ownerMembersDetailsBefore = [{
            uId: tokenShakira.authUserId,
            email: userShakira.email,
            nameFirst: userShakira.nameFirst,
            nameLast: userShakira.nameLast,
            handleStr: userShakira.nameFirst.toLowerCase() + userShakira.nameLast.toLowerCase(),
            profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
        }];

        const allMembersDetailsBefore = [{
            uId: tokenShakira.authUserId,
            email: userShakira.email,
            nameFirst: userShakira.nameFirst,
            nameLast: userShakira.nameLast,
            handleStr: userShakira.nameFirst.toLowerCase() + userShakira.nameLast.toLowerCase(),
            profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
        },
        {
            uId: tokenJames.authUserId,
            email: userJames.email,
            nameFirst: userJames.nameFirst,
            nameLast: userJames.nameLast,
            handleStr: userJames.nameFirst.toLowerCase() + userJames.nameLast.toLowerCase(),
            profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
        },
        {
            uId: tokenAndrew.authUserId,
            email: userAndrew.email,
            nameFirst: userAndrew.nameFirst,
            nameLast: userAndrew.nameLast,
            handleStr: userAndrew.nameFirst.toLowerCase() + userAndrew.nameLast.toLowerCase(),
            profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
        }];

        const channelDetailsBefore = {name: Crunchie1.name, isPublic: Crunchie1.isPublic, ownerMembers: ownerMembersDetailsBefore, allMembers: allMembersDetailsBefore};

        // to be removed user is the channel creator and co-owner
        const CrunchieChannel2 = requestChannelsCreate(tokenAndrew.token, Crunchie2.name, Crunchie2.isPublic);
        requestChannelInvite(tokenAndrew.token, CrunchieChannel2.channelId, tokenJames.authUserId);
        requestChannelInvite(tokenAndrew.token, CrunchieChannel2.channelId, tokenShakira.authUserId);
        requestAddOwner(tokenAndrew.token, CrunchieChannel2.channelId, tokenShakira.authUserId);

        const ownerMembersDetailsBefore2 = [{
            uId: tokenAndrew.authUserId,
            email: userAndrew.email,
            nameFirst: userAndrew.nameFirst,
            nameLast: userAndrew.nameLast,
            handleStr: userAndrew.nameFirst.toLowerCase() + userAndrew.nameLast.toLowerCase(),
            profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
        },
        {
            uId: tokenShakira.authUserId,
            email: userShakira.email,
            nameFirst: userShakira.nameFirst,
            nameLast: userShakira.nameLast,
            handleStr: userShakira.nameFirst.toLowerCase() + userShakira.nameLast.toLowerCase(),
            profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
        }];

        const allMembersDetailsBefore2 = [{
            uId: tokenAndrew.authUserId,
            email: userAndrew.email,
            nameFirst: userAndrew.nameFirst,
            nameLast: userAndrew.nameLast,
            handleStr: userAndrew.nameFirst.toLowerCase() + userAndrew.nameLast.toLowerCase(),
            profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
        },
        {
            uId: tokenJames.authUserId,
            email: userJames.email,
            nameFirst: userJames.nameFirst,
            nameLast: userJames.nameLast,
            handleStr: userJames.nameFirst.toLowerCase() + userJames.nameLast.toLowerCase(),
            profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
        },
        {
            uId: tokenShakira.authUserId,
            email: userShakira.email,
            nameFirst: userShakira.nameFirst,
            nameLast: userShakira.nameLast,
            handleStr: userShakira.nameFirst.toLowerCase() + userShakira.nameLast.toLowerCase(),
            profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
        }];

        const channelDetailsBefore2 = {name: Crunchie2.name, isPublic: Crunchie2.isPublic, ownerMembers: ownerMembersDetailsBefore2, allMembers: allMembersDetailsBefore2};

        // to be removed user is the sole owner
        const CrunchieChannel3 = requestChannelsCreate(tokenAndrew.token, Crunchie3.name, Crunchie3.isPublic);
        requestChannelInvite(tokenAndrew.token, CrunchieChannel3.channelId, tokenShakira.authUserId);

        const ownerMembersDetailsBefore3 = [{
            uId: tokenAndrew.authUserId,
            email: userAndrew.email,
            nameFirst: userAndrew.nameFirst,
            nameLast: userAndrew.nameLast,
            handleStr: userAndrew.nameFirst.toLowerCase() + userAndrew.nameLast.toLowerCase(),
            profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
        }];

        const allMembersDetailsBefore3 = [{
            uId: tokenAndrew.authUserId,
            email: userAndrew.email,
            nameFirst: userAndrew.nameFirst,
            nameLast: userAndrew.nameLast,
            handleStr: userAndrew.nameFirst.toLowerCase() + userAndrew.nameLast.toLowerCase(),
            profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
        },
        {
            uId: tokenShakira.authUserId,
            email: userShakira.email,
            nameFirst: userShakira.nameFirst,
            nameLast: userShakira.nameLast,
            handleStr: userShakira.nameFirst.toLowerCase() + userShakira.nameLast.toLowerCase(),
            profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
        }];

        const channelDetailsBefore3 = {name: Crunchie3.name, isPublic: Crunchie3.isPublic, ownerMembers: ownerMembersDetailsBefore3, allMembers: allMembersDetailsBefore3};

        const CrunchieChannel4 = requestChannelsCreate(tokenMax.token, 'Dummy Channel', true);

        // ---------- Before Removal ---------- //
        expect(requestChannelDetails(tokenShakira.token, CrunchieChannel.channelId)).toStrictEqual(channelDetailsBefore);
        expect(requestChannelDetails(tokenAndrew.token, CrunchieChannel2.channelId)).toStrictEqual(channelDetailsBefore2);
        expect(requestChannelDetails(tokenAndrew.token, CrunchieChannel3.channelId)).toStrictEqual(channelDetailsBefore3);

        // ------------- Removal ------------- //
        expect(requestAdminUserRemove(tokenShakira.token, tokenAndrew.authUserId)).toStrictEqual({});
        // ------------- Removal ------------- //

        const ownerMembersDetailsAfter = [{
            uId: tokenShakira.authUserId,
            email: userShakira.email,
            nameFirst: userShakira.nameFirst,
            nameLast: userShakira.nameLast,
            handleStr: userShakira.nameFirst.toLowerCase() + userShakira.nameLast.toLowerCase(),
            profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
        }];

        const allMembersDetailsAfter = [{
            uId: tokenShakira.authUserId,
            email: userShakira.email,
            nameFirst: userShakira.nameFirst,
            nameLast: userShakira.nameLast,
            handleStr: userShakira.nameFirst.toLowerCase() + userShakira.nameLast.toLowerCase(),
            profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
        },
        {
            uId: tokenJames.authUserId,
            email: userJames.email,
            nameFirst: userJames.nameFirst,
            nameLast: userJames.nameLast,
            handleStr: userJames.nameFirst.toLowerCase() + userJames.nameLast.toLowerCase(),
            profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
        }];

        const channelDetailsAfter = {name: Crunchie1.name, isPublic: Crunchie1.isPublic, ownerMembers: ownerMembersDetailsAfter, allMembers: allMembersDetailsAfter};

        const ownerMembersDetailsAfter2 = [{
            uId: tokenShakira.authUserId,
            email: userShakira.email,
            nameFirst: userShakira.nameFirst,
            nameLast: userShakira.nameLast,
            handleStr: userShakira.nameFirst.toLowerCase() + userShakira.nameLast.toLowerCase(),
            profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
        }];

        const allMembersDetailsAfter2 = [{
            uId: tokenJames.authUserId,
            email: userJames.email,
            nameFirst: userJames.nameFirst,
            nameLast: userJames.nameLast,
            handleStr: userJames.nameFirst.toLowerCase() + userJames.nameLast.toLowerCase(),
            profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
        },
        {
            uId: tokenShakira.authUserId,
            email: userShakira.email,
            nameFirst: userShakira.nameFirst,
            nameLast: userShakira.nameLast,
            handleStr: userShakira.nameFirst.toLowerCase() + userShakira.nameLast.toLowerCase(),
            profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
        }];

        const channelDetailsAfter2 = {name: Crunchie2.name, isPublic: Crunchie2.isPublic, ownerMembers: ownerMembersDetailsAfter2, allMembers: allMembersDetailsAfter2};

        const ownerMembersDetailsAfter3 = [];

        const allMembersDetailsAfter3 = [{
            uId: tokenShakira.authUserId,
            email: userShakira.email,
            nameFirst: userShakira.nameFirst,
            nameLast: userShakira.nameLast,
            handleStr: userShakira.nameFirst.toLowerCase() + userShakira.nameLast.toLowerCase(),
            profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
        }];

        const channelDetailsAfter3 = {name: Crunchie3.name, isPublic: Crunchie3.isPublic, ownerMembers: ownerMembersDetailsAfter3, allMembers: allMembersDetailsAfter3};

        // ---------- After Removal ---------- //
        expect(requestChannelDetails(tokenShakira.token, CrunchieChannel.channelId)).toStrictEqual(channelDetailsAfter);
        expect(requestChannelDetails(tokenShakira.token, CrunchieChannel2.channelId)).toStrictEqual(channelDetailsAfter2);
        expect(requestChannelDetails(tokenShakira.token, CrunchieChannel3.channelId)).toStrictEqual(channelDetailsAfter3);
    });

    test('Test successful removal of user - one dm', () => {
        const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
        const isShakiraGlobalOwner = true;
        const tokenJames = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
        const isJamesGlobalOwner = false;
        const tokenAndrew = requestAuthRegister(userAndrew.email, userAndrew.password, userAndrew.nameFirst, userAndrew.nameLast);
        const isAndrewGlobalOwner = false;

        const dmId1 = requestDmCreate(tokenShakira.token, [tokenJames.authUserId, tokenAndrew.authUserId]);
        requestSendDmMessage(tokenJames.token, dmId1.dmId, message1);
        requestSendDmMessage(tokenShakira.token, dmId1.dmId, message2);
        const shakiraDms = requestDmList(tokenShakira.token);
        const expectedOutputBefore = {
            name: '',
            members: [tokenShakira.authUserId, tokenJames.authUserId, tokenAndrew.authUserId],
        };

        for (const dmPosition in shakiraDms.dms) {
            if (dmId1.dmId === shakiraDms.dms[dmPosition].dmId) {
                expectedOutputBefore.name = shakiraDms.dms[dmPosition].name;
            }
        };

        const receivedOutputBefore = requestDmDetails(tokenShakira.token, dmId1.dmId);
        const filteredOutputBefore = {
            name: receivedOutputBefore.name,
            members: [],
        };

        for (const membersPosition in receivedOutputBefore.members) {
            filteredOutputBefore.members.push(receivedOutputBefore.members[membersPosition].uId);
        };

        // ---------- Before Removal ---------- //
        expect(filteredOutputBefore).toStrictEqual(expectedOutputBefore);

        // ------------- Removal ------------- //
        expect(requestAdminUserRemove(tokenShakira.token, tokenJames.authUserId)).toStrictEqual({});
        // ------------- Removal ------------- //
        requestDmMessages(tokenAndrew.token, dmId1.dmId, 0);
        
        const expectedOutputAfter = {
            name: '',
            members: [tokenShakira.authUserId, tokenAndrew.authUserId],
        };

        for (const dmPosition in shakiraDms.dms) {
            if (dmId1.dmId === shakiraDms.dms[dmPosition].dmId) {
                expectedOutputAfter.name = shakiraDms.dms[dmPosition].name;
            }
        };

        const receivedOutputAfter = requestDmDetails(tokenShakira.token, dmId1.dmId);
        const filteredOutputAfter = {
            name: receivedOutputAfter.name,
            members: [],
        };

        for (const membersPosition in receivedOutputAfter.members) {
            filteredOutputAfter.members.push(receivedOutputAfter.members[membersPosition].uId);
        };

        // ---------- After Removal ---------- //
        expect(filteredOutputAfter).toStrictEqual(expectedOutputAfter);
    });    

    test('Test successful removal of user - multiple dms', () => {
        const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
        const isShakiraGlobalOwner = true;
        const tokenJames = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
        const isJamesGlobalOwner = false;
        const tokenAndrew = requestAuthRegister(userAndrew.email, userAndrew.password, userAndrew.nameFirst, userAndrew.nameLast);
        const isAndrewGlobalOwner = false;
        const tokenMax = requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);
        const isMaxGlobalOwner = false;

        // to be removed user is not owner
        const dmId1 = requestDmCreate(tokenShakira.token, [tokenJames.authUserId, tokenAndrew.authUserId]);
        const shakiraDmsBefore = requestDmList(tokenShakira.token);
        const expectedOutputBefore = {
            name: '',
            members: [tokenShakira.authUserId, tokenJames.authUserId, tokenAndrew.authUserId],
        };

        for (const dmPosition in shakiraDmsBefore.dms) {
            if (dmId1.dmId === shakiraDmsBefore.dms[dmPosition].dmId) {
                expectedOutputBefore.name = shakiraDmsBefore.dms[dmPosition].name;
            }
        };

        const receivedOutputBefore = requestDmDetails(tokenShakira.token, dmId1.dmId);
        const filteredOutputBefore = {
            name: receivedOutputBefore.name,
            members: [],
        };

        for (const membersPosition in receivedOutputBefore.members) {
            filteredOutputBefore.members.push(receivedOutputBefore.members[membersPosition].uId);
        };

        // to be removed user is sole owner
        const dmId2 = requestDmCreate(tokenJames.token, [tokenShakira.authUserId, tokenAndrew.authUserId]);
        const jamesDms = requestDmList(tokenJames.token);
        const expectedOutputBefore2 = {
            name: '',
            members: [tokenJames.authUserId, tokenShakira.authUserId, tokenAndrew.authUserId],
        };

        for (const dmPosition in jamesDms.dms) {
            if (dmId2.dmId === jamesDms.dms[dmPosition].dmId) {
                expectedOutputBefore2.name = jamesDms.dms[dmPosition].name;
            }
        };

        const receivedOutputBefore2 = requestDmDetails(tokenJames.token, dmId2.dmId);
        const filteredOutputBefore2 = {
            name: receivedOutputBefore2.name,
            members: [],
        };

        for (const membersPosition in receivedOutputBefore2.members) {
            filteredOutputBefore2.members.push(receivedOutputBefore2.members[membersPosition].uId);
        };

        const dmId3 = requestDmCreate(tokenMax.token, []);

        // ---------- Before Removal ---------- //
        expect(filteredOutputBefore).toStrictEqual(expectedOutputBefore);
        expect(filteredOutputBefore2).toStrictEqual(expectedOutputBefore2);

        // ------------- Removal ------------- //
        expect(requestAdminUserRemove(tokenShakira.token, tokenJames.authUserId)).toStrictEqual({});
        // ------------- Removal ------------- //

        const shakiraDmsAfter = requestDmList(tokenShakira.token);
        const expectedOutputAfter = {
            name: '',
            members: [tokenShakira.authUserId, tokenAndrew.authUserId],
        };

        for (const dmPosition in shakiraDmsAfter.dms) {
            if (dmId1.dmId === shakiraDmsAfter.dms[dmPosition].dmId) {
                expectedOutputAfter.name = shakiraDmsAfter.dms[dmPosition].name;
            }
        };

        const receivedOutputAfter = requestDmDetails(tokenShakira.token, dmId1.dmId);
        const filteredOutputAfter = {
            name: receivedOutputAfter.name,
            members: [],
        };

        for (const membersPosition in receivedOutputAfter.members) {
            filteredOutputAfter.members.push(receivedOutputAfter.members[membersPosition].uId);
        };

        const shakiraDmsAfter2 = requestDmList(tokenShakira.token);
        const expectedOutputAfter2 = {
            name: '',
            members: [tokenShakira.authUserId, tokenAndrew.authUserId],
        };

        for (const dmPosition in shakiraDmsAfter2.dms) {
            if (dmId2.dmId === shakiraDmsAfter2.dms[dmPosition].dmId) {
                expectedOutputAfter2.name = shakiraDmsAfter2.dms[dmPosition].name;
            }
        };

        const receivedOutputAfter2 = requestDmDetails(tokenShakira.token, dmId2.dmId);
        const filteredOutputAfter2 = {
            name: receivedOutputAfter2.name,
            members: [],
        };

        for (const membersPosition in receivedOutputAfter2.members) {
            filteredOutputAfter2.members.push(receivedOutputAfter2.members[membersPosition].uId);
        };

        // ---------- After Removal ---------- //
        expect(filteredOutputAfter).toStrictEqual(expectedOutputAfter);
        expect(filteredOutputAfter2).toStrictEqual(expectedOutputAfter2);
    });   
});

///////////////////////////////////////////
// /admin/userpermission/change/v1 Tests //
///////////////////////////////////////////
describe('Error Testing admin/userpermission/change/v1', () => {
    test('403 Error - authUserId is not global owner: member promotes member', () => {
        const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
        const isShakiraGlobalOwner = true;
        const tokenJames = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
        const isJamesGlobalOwner = false;
        const tokenAndrew = requestAuthRegister(userAndrew.email, userAndrew.password, userAndrew.nameFirst, userAndrew.nameLast);
        const isAndrewGlobalOwner = false;
        const permissionId = ownerPermission;

        expect(requestAdminUserPermissions(tokenAndrew.token, tokenJames.authUserId, permissionId).statusCode).toStrictEqual(HTTPError403);
    });

    test('403 Error - authUserId is not global owner: member demotes owner', () => {
        const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
        const isShakiraGlobalOwner = true;
        const tokenJames = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
        const isJamesGlobalOwner = false;
        const tokenAndrew = requestAuthRegister(userAndrew.email, userAndrew.password, userAndrew.nameFirst, userAndrew.nameLast);
        const isAndrewGlobalOwner = false;
        const permissionId = memberPermission;

        expect(requestAdminUserPermissions(tokenAndrew.token, tokenShakira.authUserId, permissionId).statusCode).toStrictEqual(HTTPError403);
    });

    test('400 Error - invalid uId', () => {
        const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
        const isShakiraGlobalOwner = true;
        const unregisteredUser = {
            token: "1531",
            authUserId: 1511,
        };
        const permissionId = ownerPermission;

        expect(requestAdminUserPermissions(tokenShakira.token, unregisteredUser.authUserId, permissionId).statusCode).toStrictEqual(HTTPError400);
    });

    test('400 Error - demote only global owner', () => {
        const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
        const isShakiraGlobalOwner = true;
        const tokenJames = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
        const isJamesGlobalOwnder = false;
        const permissionId = memberPermission;

        expect(requestAdminUserPermissions(tokenShakira.token, tokenShakira.authUserId, permissionId).statusCode).toStrictEqual(HTTPError400);
    });

    test('400 Error - invalid permissionId: negative number', () => {
        const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
        const isShakiraGlobalOwner = true;
        const tokenJames = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
        const isJamesGlobalOwnder = false;
        const permissionId = -1;

        expect(requestAdminUserPermissions(tokenShakira.token, tokenJames.authUserId, permissionId).statusCode).toStrictEqual(HTTPError400);
    });

    test('400 Error - invalid permissionId: zero', () => {
        const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
        const isShakiraGlobalOwner = true;
        const tokenJames = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
        const isJamesGlobalOwnder = false;
        const permissionId = 0;

        expect(requestAdminUserPermissions(tokenShakira.token, tokenJames.authUserId, permissionId).statusCode).toStrictEqual(HTTPError400);
    });

    test('400 Error - invalid permissionId: positive number', () => {
        const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
        const isShakiraGlobalOwner = true;
        const tokenJames = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
        const isJamesGlobalOwnder = false;
        const permissionId = 12;

        expect(requestAdminUserPermissions(tokenShakira.token, tokenJames.authUserId, permissionId).statusCode).toStrictEqual(HTTPError400);
    });

    test('400 Error - user\'s permissions level = permissionId: member to member', () => {
        const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
        const isShakiraGlobalOwner = true;
        const tokenJames = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
        const isJamesGlobalOwnder = false;
        const permissionId = memberPermission;

        expect(requestAdminUserPermissions(tokenShakira.token, tokenJames.authUserId, permissionId).statusCode).toStrictEqual(HTTPError400);
    });

    test('400 Error - user\'s permissions level = permissionId: owner to owner (1)', () => {
        const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
        const isShakiraGlobalOwner = true;
        const tokenJames = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
        const isJamesGlobalOwnder = false;
        const permissionId = ownerPermission;

        expect(requestAdminUserPermissions(tokenShakira.token, tokenShakira.authUserId, permissionId).statusCode).toStrictEqual(HTTPError400);
    });

    test('400 Error - user\'s permissions level = permissionId: owner to owner (2)', () => {
        const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
        const isShakiraGlobalOwner = true;
        const tokenJames = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
        const isJamesGlobalOwnder = false;
        const permissionId = ownerPermission;
        requestAdminUserPermissions(tokenShakira.token, tokenJames.authUserId, permissionId);

        expect(requestAdminUserPermissions(tokenJames.token, tokenShakira.authUserId, permissionId).statusCode).toStrictEqual(HTTPError400);
    });

    test('Testing successful owner promotes member', () => {
        const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
        let isShakiraGlobalOwner = false;
        const tokenJames = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
        let isJamesGlobalOwner = false;
        const tokenAndrew = requestAuthRegister(userAndrew.email, userAndrew.password, userAndrew.nameFirst, userAndrew.nameLast);
        let isAndrewGlobalOwner = false;
        const permissionId = ownerPermission;
        expect(requestAdminUserPermissions(tokenShakira.token, tokenJames.authUserId, permissionId)).toStrictEqual({});
        isJamesGlobalOwner = true;
    });

    test('Testing successful owner demotes owner', () => {
        const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
        let isShakiraGlobalOwner = true;
        const tokenJames = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
        let isJamesGlobalOwner = false;
        const tokenAndrew = requestAuthRegister(userAndrew.email, userAndrew.password, userAndrew.nameFirst, userAndrew.nameLast);
        let isAndrewGlobalOwner = false;
        const permissionIdJames = ownerPermission;
        const permissionIdShakira = memberPermission;
        requestAdminUserPermissions(tokenShakira.token, tokenJames.authUserId, permissionIdJames);
        isJamesGlobalOwner = true;

        expect(requestAdminUserPermissions(tokenJames.token, tokenShakira.authUserId, permissionIdShakira)).toStrictEqual({});
        isShakiraGlobalOwner = false;
    });
});