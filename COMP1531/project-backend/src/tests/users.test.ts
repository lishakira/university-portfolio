// ========================================================================= //
// Wrapper functions
import { getData } from '../dataStore';
import {
  requestAuthRegister,
  requestClear,
  requestUserProfile,
  requestChannelsCreate,
  requestDmCreate,
  requestUserProfileSetName,
  requestUserProfileSetEmail,
  requestUserProfileSetHandle,
  requestUsersAll,
  HTTPError400,
  HTTPError403,
  requestUserStats,
  requestUsersStats,
  requestUserProfileUploadPhoto,
} from '../testpaths';
// ========================================================================= //

/////////////////
// Iteration 2 //
/////////////////
beforeEach(() => {
  requestClear();
});

// Output Constants
const OK = 200;
const errorResponse = { error: expect.any(String) };

// User Constants
const userShakira = { email: "shakira@gmail.com", password: "password", nameFirst: "Shakira", nameLast: "Li" };
const userJames = { email: "james@gmail.com", password: "password", nameFirst: "James", nameLast: "Humphries"};
const userAndrew = {email: "andrew@gmail.com", password: "password", nameFirst: "Andrew", nameLast: "Taylor"};
const userMax = { email: "max@hotmail.com", password: "password", nameFirst: "Max", nameLast: "Verstappen" };
////////////////////////////
// /user/profile/v2 Tests //
////////////////////////////

describe('Testing user/profile/v2', () => {
  test('Invalid or unregistered uId', () => {
    const unregisteredUser = {
      token: "1531",
      authUserId: 1511,
    };
    
    expect(requestUserProfile(unregisteredUser.token, unregisteredUser.authUserId).statusCode).toStrictEqual(HTTPError403);
  });

  test('Invalid or unregistered uId - multiple users', () => {
    const tokenJames = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tokenAndrew = requestAuthRegister(userAndrew.email, userAndrew.password, userAndrew.nameFirst, userAndrew.nameLast);
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    
    const unregisteredUser = {
      token: "1531",
      authUserId: 1511,
    };

    expect(requestUserProfile(unregisteredUser.token, unregisteredUser.authUserId).statusCode).toStrictEqual(HTTPError403);
  });

  test('Invalid or unregistered uId - multiple users', () => {
    const tokenJames = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    expect(requestUserProfile(tokenJames.token, tokenShakira.authUserId + 10).statusCode).toStrictEqual(HTTPError400);
  });
  test('Test successful registered user information', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    
    const output = {
      user: {
        uId: tokenShakira.authUserId,
        email: userShakira.email,
        nameFirst: userShakira.nameFirst,
        nameLast: userShakira.nameLast,
        handleStr: userShakira.nameFirst.toLowerCase() + userShakira.nameLast.toLowerCase(),
        profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
      }
    };

    expect(requestUserProfile(tokenShakira.token, tokenShakira.authUserId)).toStrictEqual(output);  
  });

  test('Test successful registered user information - multiple users', () => {
    const tokenJames = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tokenAndrew = requestAuthRegister(userAndrew.email, userAndrew.password, userAndrew.nameFirst, userAndrew.nameLast);
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    
    const outputJames = {
      user: {
        uId: tokenJames.authUserId,
        email: userJames.email,
        nameFirst: userJames.nameFirst,
        nameLast: userJames.nameLast,
        handleStr: userJames.nameFirst.toLowerCase() + userJames.nameLast.toLowerCase(),
        profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
      }
    };
    const outputAndrew = {
      user: {
        uId: tokenAndrew.authUserId,
        email: userAndrew.email,
        nameFirst: userAndrew.nameFirst,
        nameLast: userAndrew.nameLast,
        handleStr: userAndrew.nameFirst.toLowerCase() + userAndrew.nameLast.toLowerCase(),
        profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
      }
    };
    const outputShakira = {
      user: {
        uId: tokenShakira.authUserId,
        email: userShakira.email,
        nameFirst: userShakira.nameFirst,
        nameLast: userShakira.nameLast,
        handleStr: userShakira.nameFirst.toLowerCase() + userShakira.nameLast.toLowerCase(),
        profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
      }
    };

    expect(requestUserProfile(tokenJames.token, tokenJames.authUserId)).toStrictEqual(outputJames);  
    expect(requestUserProfile(tokenAndrew.token, tokenAndrew.authUserId)).toStrictEqual(outputAndrew);  
    expect(requestUserProfile(tokenShakira.token, tokenShakira.authUserId)).toStrictEqual(outputShakira);  
  });
});

/////////////////////////
// /users/all/v1 Tests //
/////////////////////////
describe('Testing users/all/v1', () => {
  test('Test successful one user', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    
    const output = {
      users: [
        {
          uId: tokenShakira.authUserId,
          email: userShakira.email,
          nameFirst: userShakira.nameFirst,
          nameLast: userShakira.nameLast,
          handleStr: userShakira.nameFirst.toLowerCase() + userShakira.nameLast.toLowerCase(),
          profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
        }
      ],
    };

    expect(requestUsersAll(tokenShakira.token)).toStrictEqual(output);  
  });

  test('Test successful one user - updated nameFirst and nameLast', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const newNameFirst = "Shakira 1531";
    const newNameLast = "Li 1511";
    requestUserProfileSetName(tokenShakira.token, newNameFirst, newNameLast);
    
    const output = {
      users: [
        {
          uId: tokenShakira.authUserId,
          email: userShakira.email,
          nameFirst: newNameFirst,
          nameLast: newNameLast,
          handleStr: userShakira.nameFirst.toLowerCase() + userShakira.nameLast.toLowerCase(),
          profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
        }
      ],
    };

    expect(requestUsersAll(tokenShakira.token)).toStrictEqual(output);  
  });

  test('Test successful one user - updated email', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const newEmail = "shakirali@yahoo.com";
    requestUserProfileSetEmail(tokenShakira.token, newEmail);
    
    const output = {
      users: [
        {
          uId: tokenShakira.authUserId,
          email: newEmail,
          nameFirst: userShakira.nameFirst,
          nameLast: userShakira.nameLast,
          handleStr: userShakira.nameFirst.toLowerCase() + userShakira.nameLast.toLowerCase(),
          profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
        }
      ],
    };

    expect(requestUsersAll(tokenShakira.token)).toStrictEqual(output);  
  });

  test('Test successful one user - updated handleStr', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const newHandleStr = "shakirali1531";
    requestUserProfileSetHandle(tokenShakira.token, newHandleStr);
    
    const output = {
      users: [
        {
          uId: tokenShakira.authUserId,
          email: userShakira.email,
          nameFirst: userShakira.nameFirst,
          nameLast: userShakira.nameLast,
          handleStr: newHandleStr,
          profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
        }
      ],
    };

    expect(requestUsersAll(tokenShakira.token)).toStrictEqual(output);  
  });
  
  test('Test successful multiple users', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const tokenJames = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const tokenAndrew = requestAuthRegister(userAndrew.email, userAndrew.password, userAndrew.nameFirst, userAndrew.nameLast);

    const output = {
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

    expect(requestUsersAll(tokenAndrew.token)).toStrictEqual(output);  
  });

  test('Test successful multiple users - updated details', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);

    const tokenJames = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const newEmailJames = "james.humphries@gmail.com";
    const newHandleStrJames = "james1531"
    requestUserProfileSetEmail(tokenJames.token, newEmailJames);
    requestUserProfileSetHandle(tokenJames.token, newHandleStrJames);

    const tokenAndrew = requestAuthRegister(userAndrew.email, userAndrew.password, userAndrew.nameFirst, userAndrew.nameLast);
    const newLastNameAndrew = "Smith";
    const newHandleStrAndrew = "andrewtaylorsmith";
    requestUserProfileSetName(tokenAndrew.token, userAndrew.nameFirst, newLastNameAndrew);
    requestUserProfileSetHandle(tokenAndrew.token, newHandleStrAndrew);

    const output = {
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
          email: newEmailJames,
          nameFirst: userJames.nameFirst,
          nameLast: userJames.nameLast,
          handleStr: newHandleStrJames,
          profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
        },
        {
          uId: tokenAndrew.authUserId,
          email: userAndrew.email,
          nameFirst: userAndrew.nameFirst,
          nameLast: newLastNameAndrew,
          handleStr: newHandleStrAndrew,
          profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
        },
      ],
    };

    expect(requestUsersAll(tokenAndrew.token)).toStrictEqual(output);  
  });
  
});

////////////////////////////////////
// /user/profile/setname/v1 Tests //
////////////////////////////////////
describe('Testing user/setname/v1', () => {
  test('Test new nameFirst too short', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const newNameFirst = '';
    const newNameLast = 'Li';
    expect(requestUserProfileSetName(tokenShakira.token, newNameFirst, newNameLast).statusCode).toStrictEqual(HTTPError400);
  });

  test('Test new nameLast too short', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const newNameFirst = 'Shakira';
    const newNameLast = '';
    expect(requestUserProfileSetName(tokenShakira.token, newNameFirst, newNameLast).statusCode).toStrictEqual(HTTPError400);
  });

  test('Test new nameFirst too long', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const newNameFirst = 'aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz';
    const newNameLast = 'Li';
    expect(requestUserProfileSetName(tokenShakira.token, newNameFirst, newNameLast).statusCode).toStrictEqual(HTTPError400);
  });

  test('Test new nameLast too long', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const newNameFirst = 'Shakira';
    const newNameLast = 'aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz';
    expect(requestUserProfileSetName(tokenShakira.token, newNameFirst, newNameLast).statusCode).toStrictEqual(HTTPError400);
  });

  test('Test successful change of name - alphabetic', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const newNameFirst = 'Shakira';
    const newNameLast = 'Li';
    expect(requestUserProfileSetName(tokenShakira.token, newNameFirst, newNameLast)).toStrictEqual({});

    const output = {
      user: {
        uId: tokenShakira.authUserId,
        email: userShakira.email,
        nameFirst: newNameFirst,
        nameLast: newNameLast,
        handleStr: userShakira.nameFirst.toLowerCase() + userShakira.nameLast.toLowerCase(),
        profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
      }
    };

    expect(requestUserProfile(tokenShakira.token, tokenShakira.authUserId)).toStrictEqual(output);  
  });

  test('Test successful change of name - numeric nameFirst', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const newNameFirst = '1531';
    const newNameLast = 'Li';
    expect(requestUserProfileSetName(tokenShakira.token, newNameFirst, newNameLast)).toStrictEqual({});

    const output = {
      user: {
        uId: tokenShakira.authUserId,
        email: userShakira.email,
        nameFirst: newNameFirst,
        nameLast: newNameLast,
        handleStr: userShakira.nameFirst.toLowerCase() + userShakira.nameLast.toLowerCase(),
        profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
      }
    };

    expect(requestUserProfile(tokenShakira.token, tokenShakira.authUserId)).toStrictEqual(output);  
  });

  test('Test successful change of name - numeric nameLast', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const newNameFirst = 'Shakira';
    const newNameLast = '1531';
    expect(requestUserProfileSetName(tokenShakira.token, newNameFirst, newNameLast)).toStrictEqual({});

    const output = {
      user: {
        uId: tokenShakira.authUserId,
        email: userShakira.email,
        nameFirst: newNameFirst,
        nameLast: newNameLast,
        handleStr: userShakira.nameFirst.toLowerCase() + userShakira.nameLast.toLowerCase(),
        profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
      }
    };

    expect(requestUserProfile(tokenShakira.token, tokenShakira.authUserId)).toStrictEqual(output);  
  });

  test('Test successful change of name - includes non-alphanumeric nameFirst', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const newNameFirst = '@Shakira~';
    const newNameLast = 'Li';
    expect(requestUserProfileSetName(tokenShakira.token, newNameFirst, newNameLast)).toStrictEqual({});

    const output = {
      user: {
        uId: tokenShakira.authUserId,
        email: userShakira.email,
        nameFirst: newNameFirst,
        nameLast: newNameLast,
        handleStr: userShakira.nameFirst.toLowerCase() + userShakira.nameLast.toLowerCase(),
        profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
      }
    };

    expect(requestUserProfile(tokenShakira.token, tokenShakira.authUserId)).toStrictEqual(output);  
  });

  test('Test successful change of name - includes non-alphanumeric nameLast', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const newNameFirst = 'Shakira';
    const newNameLast = '@Li~';
    expect(requestUserProfileSetName(tokenShakira.token, newNameFirst, newNameLast)).toStrictEqual({});

    const output = {
      user: {
        uId: tokenShakira.authUserId,
        email: userShakira.email,
        nameFirst: newNameFirst,
        nameLast: newNameLast,
        handleStr: userShakira.nameFirst.toLowerCase() + userShakira.nameLast.toLowerCase(),
        profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
      }
    };

    expect(requestUserProfile(tokenShakira.token, tokenShakira.authUserId)).toStrictEqual(output);  
  });
});

/////////////////////////////////////
// /user/profile/setemail/v1 Tests //
/////////////////////////////////////
describe('Testing user/setemail/v1', () => {
  test('Test invalid new email - empty', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const newEmail = '';
    expect(requestUserProfileSetEmail(tokenShakira.token, newEmail).statusCode).toStrictEqual(HTTPError400);
  });

  test('Test invalid new email - missing "@gmail.com": alphabetic', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const newEmail = userShakira.nameFirst;
    expect(requestUserProfileSetEmail(tokenShakira.token, newEmail).statusCode).toStrictEqual(HTTPError400);
  });

  test('Test invalid new email - missing "@gmail.com": numeric', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const newEmail = tokenShakira.token;
    expect(requestUserProfileSetEmail(tokenShakira.token, newEmail).statusCode).toStrictEqual(HTTPError400);
  });

  test('Test invalid new email - missing "@gmail.com": alphanumeric', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const newEmail = userShakira.nameFirst + tokenShakira.token;
    expect(requestUserProfileSetEmail(tokenShakira.token, newEmail).statusCode).toStrictEqual(HTTPError400);
  });

  test('Test invalid new email - missing "@gmail"', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const newEmail = userShakira.nameFirst + ".com";
    expect(requestUserProfileSetEmail(tokenShakira.token, newEmail).statusCode).toStrictEqual(HTTPError400);
  });

  test('Test invalid new email - missing "com"', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const newEmail = "shakira@gmail.";
    expect(requestUserProfileSetEmail(tokenShakira.token, newEmail).statusCode).toStrictEqual(HTTPError400);
  });

  test('Test new email is already taken', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const tokenJames = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const newEmail = userJames.email;
    expect(requestUserProfileSetEmail(tokenShakira.token, newEmail).statusCode).toStrictEqual(HTTPError400);
  });

  test('Test successful change of email address', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const newEmail = "newshakira@gmail.com";
    expect(requestUserProfileSetEmail(tokenShakira.token, newEmail)).toStrictEqual({});

    const output = {
      user: {
        uId: tokenShakira.authUserId,
        email: newEmail,
        nameFirst: userShakira.nameFirst,
        nameLast: userShakira.nameLast,
        handleStr: userShakira.nameFirst.toLowerCase() + userShakira.nameLast.toLowerCase(),
        profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
      }
    };

    expect(requestUserProfile(tokenShakira.token, tokenShakira.authUserId)).toStrictEqual(output);  
  });
});

//////////////////////////////////////
// /user/profile/sethandle/v1 Tests //
//////////////////////////////////////
describe('Testing user/sethandle/v1', () => {
  test('Test new handle too short - empty', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const newHandle = '';
    expect(requestUserProfileSetHandle(tokenShakira.token, newHandle).statusCode).toStrictEqual(HTTPError400);
  });

  test('Test new handle too short - with characters', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const newHandle = 'li';
    expect(requestUserProfileSetHandle(tokenShakira.token, newHandle).statusCode).toStrictEqual(HTTPError400);
  });

  test('Test new handle too long', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const newHandle = 'abcdefghijklmnopqrstuvwxyz';
    expect(requestUserProfileSetHandle(tokenShakira.token, newHandle).statusCode).toStrictEqual(HTTPError400);
  });

  test('Test new handle includes non-alphanumeric characters', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const newHandle = 'shakira_li';
    expect(requestUserProfileSetHandle(tokenShakira.token, newHandle).statusCode).toStrictEqual(HTTPError400);
  });

  test('Test new handle is already taken', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const tokenJames = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const newHandle = userJames.nameFirst.toLowerCase() + userJames.nameLast.toLowerCase();
    expect(requestUserProfileSetHandle(tokenShakira.token, newHandle).statusCode).toStrictEqual(HTTPError400);
  });

  test('Test successful change of handle - alphabetic', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const newHandle = 'newshakirali';
    expect(requestUserProfileSetHandle(tokenShakira.token, newHandle)).toStrictEqual({});

    const output = {
      user: {
        uId: tokenShakira.authUserId,
        email: userShakira.email,
        nameFirst: userShakira.nameFirst,
        nameLast: userShakira.nameLast,
        handleStr: newHandle,
        profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
      }
    };

    expect(requestUserProfile(tokenShakira.token, tokenShakira.authUserId)).toStrictEqual(output);  
  });

  test('Test successful change of handle - numeric', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const newHandle = '15311511';
    expect(requestUserProfileSetHandle(tokenShakira.token, newHandle)).toStrictEqual({});

    const output = {
      user: {
        uId: tokenShakira.authUserId,
        email: userShakira.email,
        nameFirst: userShakira.nameFirst,
        nameLast: userShakira.nameLast,
        handleStr: newHandle,
        profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
      }
    };

    expect(requestUserProfile(tokenShakira.token, tokenShakira.authUserId)).toStrictEqual(output);  
  });

  test('Test successful change of handle - alphanumeric', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const newHandle = 'shakirali1531';
    expect(requestUserProfileSetHandle(tokenShakira.token, newHandle)).toStrictEqual({});

    const output = {
      user: {
        uId: tokenShakira.authUserId,
        email: userShakira.email,
        nameFirst: userShakira.nameFirst,
        nameLast: userShakira.nameLast,
        handleStr: newHandle,
        profileImgUrl: "http://127.0.0.1:2195/profiles/startingimage.jpg",
      }
    };

    expect(requestUserProfile(tokenShakira.token, tokenShakira.authUserId)).toStrictEqual(output);  
  });
});

describe('testing usersStats', () => {
  
  test('valid input (1) - Testing userStats with no channels or dms', () => {
    const user = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const userStats = requestUserStats(user.token);
    expect(userStats.userStats.channelsJoined[0].numChannelsJoined).toStrictEqual(0);
    expect(userStats.userStats.dmsJoined[0].numDmsJoined).toStrictEqual(0);
  });

  test('valid input (1) - Testing userStats with single channel', () => {
    const user = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const andrew = requestAuthRegister(userAndrew.email, userAndrew.password, userAndrew.nameFirst, userAndrew.nameLast);
    const shakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    requestChannelsCreate(user.token, 'Crunchie', true);
    requestDmCreate(andrew.token, [user.authUserId]);
    requestDmCreate(andrew.token, [user.authUserId, shakira.authUserId]);
    const userStats = requestUserStats(user.token);
    const userAndrewStats = requestUserStats(andrew.token);
    const workSpaceStats = requestUsersStats(user.token);
    expect(userStats.userStats.channelsJoined[1].numChannelsJoined).toStrictEqual(1);
    expect(userStats.userStats.dmsJoined[2].numDmsJoined).toStrictEqual(2);
    expect(userStats.userStats.involvementRate).toStrictEqual(1);
    expect(workSpaceStats.workspaceStats.channelsExist[1].numChannelsExist).toStrictEqual(1);
    expect(workSpaceStats.workspaceStats.dmsExist[2].numDmsExist).toStrictEqual(2);
    expect(workSpaceStats.workspaceStats.utilizationRate).toStrictEqual(1);
  });

  test('valid input (1) - Testing usersStats with 1/2 efficiency', () => {
    const user = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const andrew = requestAuthRegister(userAndrew.email, userAndrew.password, userAndrew.nameFirst, userAndrew.nameLast);
    requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    requestAuthRegister(userMax.email, userMax.password, userMax.nameFirst, userMax.nameLast);
    requestChannelsCreate(user.token, 'Crunchie', true);
    requestDmCreate(andrew.token, [user.authUserId]);
    const userStats = requestUserStats(user.token);
    const workSpaceStats = requestUsersStats(user.token);
    expect(userStats.userStats.channelsJoined[1].numChannelsJoined).toStrictEqual(1);
    expect(userStats.userStats.dmsJoined[1].numDmsJoined).toStrictEqual(1);
    expect(userStats.userStats.involvementRate).toStrictEqual(1);
    expect(workSpaceStats.workspaceStats.channelsExist[1].numChannelsExist).toStrictEqual(1);
    expect(workSpaceStats.workspaceStats.dmsExist[1].numDmsExist).toStrictEqual(1);
    expect(workSpaceStats.workspaceStats.utilizationRate).toStrictEqual(0.5);
  });
});

describe('testing upload photo', () => {
  
  test('invalid input (2) - image uploaded is not a JPG', async () => {
    const user = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const imageUrl = "http://www.stockphotosecrets.com/wp-content/uploads/2018/08/hide-the-pain-stockphoto-840x560.jpa";
    expect(requestUserProfileUploadPhoto(user.token, imageUrl, 0,0,10,10).statusCode).toStrictEqual(HTTPError400);
    await awaitTimeout(0.4);
  });

  test('invalid input (3) - xEnd is less than or equal to xStart or yEnd is less than or equal to yStart', async () => {
    const user = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const imageUrl = "http://www.stockphotosecrets.com/wp-content/uploads/2018/08/hide-the-pain-stockphoto-840x560.jpg";
    expect(requestUserProfileUploadPhoto(user.token, imageUrl, 100,0,10,10).statusCode).toStrictEqual(HTTPError400);
    await awaitTimeout(0.4);
  });

  test('invalid input (4) - xEnd is less than or equal to xStart or yEnd is less than or equal to yStart', async () => {
    const user = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const imageUrl = "http://www.stockphotosecrets.com/wp-content/uploads/2018/08/hide-the-pain-stockphoto-840x560.jpg";
    expect(requestUserProfileUploadPhoto(user.token, imageUrl, 0,100,10,10).statusCode).toStrictEqual(HTTPError400);
    await awaitTimeout(0.4);
  });

  test('invalid input (5) - any of xStart, yStart, xEnd, yEnd are not within the dimensions of the image at the URL', async () => {
    const user = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const imageUrl = "http://www.stockphotosecrets.com/wp-content/uploads/2018/08/hide-the-pain-stockphoto-840x560.jpg";
    expect(requestUserProfileUploadPhoto(user.token, imageUrl, 0,-100,10,10).statusCode).toStrictEqual(HTTPError400);
    await awaitTimeout(0.4);
  });

  test('invalid input (6) - any of xStart, yStart, xEnd, yEnd are not within the dimensions of the image at the URL', async () => {
    const user = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const imageUrl = "http://www.stockphotosecrets.com/wp-content/uploads/2018/08/hide-the-pain-stockphoto-840x560.jpg";
    expect(requestUserProfileUploadPhoto(user.token, imageUrl, -10,0,10,10).statusCode).toStrictEqual(HTTPError400);
    await awaitTimeout(0.4);
  });
  
  test('valid Input', async () => {
    const user = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const imageUrl = "http://www.stockphotosecrets.com/wp-content/uploads/2018/08/hide-the-pain-stockphoto-840x560.jpg";
    expect(requestUserProfileUploadPhoto(user.token, imageUrl, 0,0,800,500)).toStrictEqual({});
    await awaitTimeout(0.4);
  });
  /* Tests that are not working
  test('invalid input (1) - imgUrl returns an HTTP status other than 200, or any other errors occur when attempting to retrieve the image', async () => {
    const user = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const imageUrl = "http://www.stockphotosecrets.com/wp-content/uploads/2018/08/hide-the-pain-stockphot-840x560.jpg";
    expect(requestuserProfileUploadPhoto(user.token, imageUrl, 0,0,10,10).statusCode).toStrictEqual(HTTPError400);
    await awaitTimeout(0.4);
  });
  test('invalid input (7) - any of xStart, yStart, xEnd, yEnd are not within the dimensions of the image at the URL', async () => {
    const user = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const imageUrl = "http://www.stockphotosecrets.com/wp-content/uploads/2018/08/hide-the-pain-stockphoto-840x560.jpg";
    expect(requestuserProfileUploadPhoto(user.token, imageUrl, 0,0,10,10000).statusCode).toStrictEqual(HTTPError400);
    await awaitTimeout(0.4);
  });

  test('invalid input (8) - any of xStart, yStart, xEnd, yEnd are not within the dimensions of the image at the URL', async () => {
    const user = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const imageUrl = "http://www.stockphotosecrets.com/wp-content/uploads/2018/08/hide-the-pain-stockphoto-840x560.jpg";
    expect(requestuserProfileUploadPhoto(user.token, imageUrl, 0,0,10000,10).statusCode).toStrictEqual(HTTPError400);
    await awaitTimeout(0.4);
  });
  */



});

const awaitTimeout = (delay: number): any =>
  new Promise(resolve => setTimeout(resolve, delay * 1000));

/////////////////
// Iteration 1 //
/////////////////
/*
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

/*import { clearV1 } from '../other';
import { authRegisterV1 } from "../auth";
import { userProfileV1 } from "../users";
import { getData, setData } from "../dataStore";

describe('Testing userProfileV1 Error Cases', () => {
  test('both authUserId and uID does not refer to a valid user', () => {
    clearV1();
    expect(userProfileV1(1, 1)).toStrictEqual({error: 'error'});
  });
  test('uID does not refer to a valid user', () => {
    clearV1();
    const userId1 = authRegisterV1("maximilianfalco@gmail.com", "password", "nameFirst", "nameLast");
    const userId2 = authRegisterV1("james.p.h@hotmail.com", "password", "nameFirst", "nameLast");
    expect(userProfileV1(userId1.authUserId, userId2.authUserId + 1000)).toStrictEqual({error: 'error'});
  });
  test('authUserId does not refer to a valid user', () => {
    clearV1();
    const userId1 = authRegisterV1("maximilianfalco@gmail.com", "password", "nameFirst", "nameLast");
    const userId2 = authRegisterV1("james.p.h@hotmail.com", "password", "nameFirst", "nameLast");
    expect(userProfileV1(userId1.authUserId + 1000, userId2.authUserId)).toStrictEqual({error: 'error'});
  });
});

describe('Testing userProfileV1 Valid Input', () => {
  test('Referring to one\'s self', () => {
    clearV1();
    const input = {
      email: "maximilianfalco@gmail.com",
      password: "password",
      nameFirst: "Maximilian",
      nameLast: "Widjaya",
    }
    const userId1 = authRegisterV1(input.email, input.password, input.nameFirst, input.nameLast);
    const user = {
      uId: userId1.authUserId,
      email: input.email,
      nameFirst: input.nameFirst,
      nameLast: input.nameLast,
      handleStr: input.nameFirst.toLowerCase() + input.nameLast.toLowerCase(),
    };
    expect(userProfileV1(userId1.authUserId, userId1.authUserId)).toStrictEqual({
      user
    });
  });
  test('Referring to another person', () => {
    clearV1();
    const input1 = {
      email: "maximilianfalco@gmail.com",
      password: "password",
      nameFirst: "Maximilian",
      nameLast: "Widjaya",
    }
    const input2 = {
      email: "james.p.h@hotmail.com",
      password: "password",
      nameFirst: "James",
      nameLast: "Humphries",
    }
    const userId1 = authRegisterV1(input1.email, input1.password, input1.nameFirst, input1.nameLast);
    const userId2 = authRegisterV1(input2.email, input2.password, input2.nameFirst, input2.nameLast);
    const dataStore = getData();
    const userLength = dataStore.users.length;
    const user = {
      uId: userId2.authUserId,
      email: input2.email,
      nameFirst: input2.nameFirst,
      nameLast: input2.nameLast,
      handleStr: input2.nameFirst.toLowerCase() + input2.nameLast.toLowerCase(),
    };
    expect(userProfileV1(userId1.authUserId, userId2.authUserId)).toStrictEqual({
      user,
    });
  });
});
*/