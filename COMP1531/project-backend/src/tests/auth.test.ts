// ========================================================================= //
// Wrapper functions
import {
    requestAuthRegister,
    requestAuthLogin,
    requestAuthLogout,
    requestClear,
    requestUserProfile,
    requestAuthPasswordResetRequest,
    requestAuthPasswordResetReset,
    requestCodeDetails, // FOR TESTING PURPOSES ONLY
    HTTPError400,
    HTTPError403,
    HTTPOK,
  } from '../testpaths';
import { codeDetails } from '../auth'
// ========================================================================= //
const errorResponse = { error: 'error' };
const OK = 200;
const NOTOK = 404;

const userJames = { email: "james@hotmail.com", password: "password", nameFirst: "James", nameLast: "Humphries"};
const userTom = { email: "tom@hotmail.com", password: "Tompassword", nameFirst: "Tom", nameLast: "Holland" };
const userShakira = { email: "shakira@gmail.com", password: "password", nameFirst: "Shakira", nameLast: "Li" };

const badUserExample = { email: "apple", password: "password", nameFirst: "James", nameLast: "Humphries" };

beforeEach(() => {
  requestClear();
});

/*
Iteration 2
*/
describe('register user functional tests', () => {

  test.each([
    {
      email: 'a',
      password: userJames.password,
      nameFirst: userJames.nameFirst,
      nameLast: userJames.nameLast,
    },
    {
      email: userJames.email,
      password: "short",
      nameFirst: userJames.nameFirst,
      nameLast: userJames.nameLast,
    },
    {
      email: userJames.email,
      password: userJames.password,
      nameFirst: "",
      nameLast: userJames.nameLast,
    },
    {
      email: userJames.email,
      password: userJames.password,
      nameFirst: userJames.nameFirst,
      nameLast: "",
    },
    {
      email: userJames.email,
      password: userJames.password,
      nameFirst: "aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz",
      nameLast: userJames.nameLast,
    },
    {
      email: userJames.email,
      password: userJames.password,
      nameFirst: userJames.nameFirst,
      nameLast: "aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz",
    },
    {
      email: userTom.email,
      password: userTom.password,
      nameFirst: userTom.nameFirst,
      nameLast: userTom.nameLast,
    },
  ])('$authRegister invalid conditions', ({ email, password, nameFirst, nameLast }) => {
    requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    const res = requestAuthRegister(email, password, nameFirst, nameLast);
    expect(res.statusCode).toStrictEqual(HTTPError400);
  });

  test('successful register of user', () => {
    // For Reference: const userJames = { email: "james@hotmail.com", password: "password", nameFirst: "James", nameLast: "Humphries"};
    expect(requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast)).toStrictEqual({ authUserId: expect.any(Number), token: expect.any(String) });
  });

  // Check handle string functionality
  test('successful register of user - checking handle string', () => {
    // For Reference: const userJames = { email: "james@hotmail.com", password: "password", nameFirst: "James", nameLast: "Humphries"};
    const James1object = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    expect(James1object).toStrictEqual({ authUserId: expect.any(Number), token: expect.any(String) });
    const James2object = requestAuthRegister("james2@hotmail.com", userJames.password, userJames.nameFirst, userJames.nameLast);
    const James3object = requestAuthRegister("james3@hotmail.com", userJames.password, userJames.nameFirst, userJames.nameLast);
    const James4object = requestAuthRegister("james4@hotmail.com", userJames.password, userJames.nameFirst, userJames.nameLast);
    expect(James2object).toStrictEqual({ authUserId: expect.any(Number), token: expect.any(String) });
    const James1Info = requestUserProfile(James1object.token, James1object.authUserId);
    const James2Info = requestUserProfile(James2object.token, James2object.authUserId);
    expect(James1Info.handleStr !== James2Info.handleStr);
  });
  
});

describe('login user functional tests', () => {
  test('successful login of user', () => {
    const authId = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast).authUserId;
    expect(requestAuthLogin(userJames.email, userJames.password)).toStrictEqual({ authUserId: authId, token: expect.any(String) });
  });

  test('successful login of multiple users', () => {
    const authId = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast).authUserId;
    requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    requestAuthRegister("james2@hotmail.com", userJames.password, userJames.nameFirst, userJames.nameLast);
    expect(requestAuthLogin("james2@hotmail.com", userJames.password)).toStrictEqual({ authUserId: expect.any(Number), token: expect.any(String) });
  });

  test('login user failure - incorrect email', () => {
    requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    expect(requestAuthLogin(userJames.email + 'a', userJames.password).statusCode).toStrictEqual(HTTPError400);
  });

  test('register user failure - no password', () => {
    requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    expect(requestAuthLogin(userJames.email, 'invalid').statusCode).toStrictEqual(HTTPError400);
  });

  test('register user failure - wrong password for other user', () => {
    requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    requestAuthRegister(userTom.email, userTom.password, userTom.nameFirst, userTom.nameLast);
    expect(requestAuthLogin(userJames.email, userTom.password).statusCode).toStrictEqual(HTTPError400);
    expect(requestAuthLogin(userTom.email, userJames.password).statusCode).toStrictEqual(HTTPError400);
  });
});

describe('logout user functional tests', () => {
  test('successful logout of user', () => {
    const jamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const jamesToken = jamesObject.token;
    expect(requestAuthLogout(jamesToken)).toStrictEqual({});
    expect(requestAuthLogout(jamesToken).statusCode).toStrictEqual(HTTPError403);
  });

  test('logout user failure - incorrect token', () => {
    const jamesObject = requestAuthRegister(userJames.email, userJames.password, userJames.nameFirst, userJames.nameLast);
    const jamesToken = jamesObject.token;
    expect(requestAuthLogout(jamesToken + "1").statusCode).toStrictEqual(HTTPError403);
  });

});

/////////////////
// Iteration 3 //
/////////////////

//////////////////////////////////////////
// /auth/passwordreset/request/v1 Tests //
//////////////////////////////////////////
describe('Testing auth/passwordreset/request/v1', () => {
  test('Tests successful request password reset', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);

    expect(requestAuthPasswordResetRequest(tokenShakira.token, userShakira.email)).toStrictEqual({});
  });

  test('Tests successful request password reset - unregistered email', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const unregisteredEmail = 'thisemailshouldntexist@gmail.com';

    expect(requestAuthPasswordResetRequest(tokenShakira.token, unregisteredEmail)).toStrictEqual({});
  });
});

////////////////////////////////////////
// /auth/passwordreset/reset/v1 Tests //
////////////////////////////////////////
describe('Testing auth/passwordreset/reset/v1', () => {
  test('400 Error - invalid reset code', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    requestAuthPasswordResetRequest(tokenShakira.token, userShakira.email);
    const resetCode = "qapeiasopd";
    const newPassword = "newpassword";

    expect(requestAuthPasswordResetReset(resetCode, newPassword).statusCode).toStrictEqual(HTTPError400);
  });

  test('400 Error - password length < 6: empty', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const authUserIdShakira = tokenShakira.authUserId;
    requestAuthPasswordResetRequest(tokenShakira.token, userShakira.email);
    const resetCode = requestCodeDetails(authUserIdShakira);
    const newPassword = "";

    expect(requestAuthPasswordResetReset(resetCode, newPassword).statusCode).toStrictEqual(HTTPError400);
  });

  test('400 Error - password length < 6: numeric', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const authUserIdShakira = tokenShakira.authUserId;
    requestAuthPasswordResetRequest(tokenShakira.token, userShakira.email);
    const resetCode = requestCodeDetails(authUserIdShakira);
    const newPassword = "12345";

    expect(requestAuthPasswordResetReset(resetCode, newPassword).statusCode).toStrictEqual(HTTPError400);
  });

  test('400 Error - password length < 6: alphabetic', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const authUserIdShakira = tokenShakira.authUserId;
    requestAuthPasswordResetRequest(tokenShakira.token, userShakira.email);
    const resetCode = requestCodeDetails(authUserIdShakira);
    const newPassword = "abc";

    expect(requestAuthPasswordResetReset(resetCode, newPassword).statusCode).toStrictEqual(HTTPError400);
  });

  test('Testing successful password reset', () => {
    const tokenShakira = requestAuthRegister(userShakira.email, userShakira.password, userShakira.nameFirst, userShakira.nameLast);
    const authUserIdShakira = tokenShakira.authUserId;
    requestAuthPasswordResetRequest(tokenShakira.token, userShakira.email);
    const resetCode = requestCodeDetails(authUserIdShakira);
    const newPassword = "newpassword";

    expect(requestAuthPasswordResetReset(resetCode, newPassword)).toStrictEqual({});
    expect(requestAuthPasswordResetReset(resetCode, newPassword).statusCode).toStrictEqual(HTTPError400);
  });
});


/* TESTS FOR OLD FUNCTIONS THAT REQUIRE imports
// uID = authRegisterV1(email, password, nameFirst, nameLast)
describe('Test for invalid input', () => {
    test('1. Test invalid email address', () => {
        expect(authRegisterV1("", "password", "nameFirst", "nameLast")).toEqual(errorResponse);
    });
    test('2. Test invalid password', () => {
        expect(authRegisterV1("james@hotmail.com", "", "nameFirst", "nameLast")).toStrictEqual(errorResponse);
    });
    test('3. Test invalid nameFirst', () => {
        expect(authRegisterV1("james@hotmail.com", "password", "", "nameLast")).toEqual(errorResponse);
    });
    test('4. Test invalid nameLast', () => {
        expect(authRegisterV1("james@hotmail.com", "password", "nameFirst", "")).toEqual(errorResponse);
    });
    test('5. Test invalid email as already in use', () => {
        authRegisterV1("james@hotmail.com", "password", "nameFirst", "nameLast");
        expect(authRegisterV1("james@hotmail.com", "password", "nameFirst", "nameLast")).toEqual(errorResponse);
    });
    test('6. Test invalid password length as 5', () => {
        expect(authRegisterV1("james@hotmail.com", "passw", "nameFirst", "nameLast")).toEqual(errorResponse);
    });
    test('7. Test invalid nameFirst - Too long', () => {
        const nameLong = "nameLongaabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz";
        expect(authRegisterV1("james@hotmail.com", "password", nameLong, "nameLast")).toEqual(errorResponse);
    });
    test('8. Test invalid nameLast - Too long', () => {
        const nameLong = "nameLongaabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz";
        expect(authRegisterV1("james@hotmail.com", "password", "nameFirst", nameLong)).toEqual(errorResponse);
    });
});

// uID = authRegisterV1(email, password, nameFirst, nameLast)
describe('Test for valid input', () => {
    test('1. Test single valid registration', () => {
        const user1 = authRegisterV1("james.p.h@hotmail.com", "password", "nameFirst", "nameLast");
        const user1Id = user1.authUserId;
        expect(user1).toEqual({authUserId: expect.any(Number)});;
    });

    test('2. Test Double valid registration', () => {
        const user1 = authRegisterV1("james.p.h@hotmail.com", "password", "nameFirst", "nameLast");
        const user2 = authRegisterV1("james2.p.h@hotmail.com", "password", "nameFirst", "nameLast");
        const user1Id = user1.authUserId;
        const user2Id = user2.authUserId;
        expect(user2).toEqual({authUserId: expect.any(Number)});;
    });
    test('3. Test valid register with handler', () => {
        const user1 = authRegisterV1("james.p.h@hotmail.com", "password", "nameFirst", "nameLast");
        const user2 = authRegisterV1("james2.p.h@hotmail.com", "password", "nameFirst", "nameLast");
        const user1Id = user1.authUserId;
        const user2Id = user2.authUserId;
        const input = {
            email: "Smith@hotmail.com",
            password: "password",
            nameFirst: "James",
            nameLast: "Humphries",
          }
          const userId1 = authRegisterV1(input.email, input.password, input.nameFirst, input.nameLast);
          const userId2 = authRegisterV1("Eric@hotmail.com", input.password, input.nameFirst, input.nameLast);
          const userId3 = authRegisterV1("Eric1@hotmail.com", input.password, input.nameFirst, input.nameLast);
          const userId4 = authRegisterV1("Eric2@hotmail.com", input.password, input.nameFirst, input.nameLast);
          const userId5 = authRegisterV1("Eric3@hotmail.com", input.password, input.nameFirst, input.nameLast);
          const user = {
            uId: userId5.authUserId,
            email: "Eric3@hotmail.com",
            nameFirst: input.nameFirst,
            nameLast: input.nameLast,
            handleStr: input.nameFirst.toLowerCase() + input.nameLast.toLowerCase() + '3',
          };
          expect(userProfileV1(userId5.authUserId, userId5.authUserId)).toStrictEqual({
            user
          });

    });
});

describe('Testing authLoginV1 function', () => {
    //if email entered does not belong to a user    
    test('invalid input (1) - email not registered in dataStore', () => {
        authRegisterV1("james@hotmail.com", "password", "nameFirst", "nameLast");
        expect(authLoginV1('jovanka@gmail.com', 'password')).toStrictEqual({error: 'error'});
    });

    //if password is incorrect
    test('invalid input (2) - password is incorrect', () => {
        authRegisterV1("james.p.h@hotmail.com", "password", "nameFirst", "nameLast");
        expect(authLoginV1('james@hotmail.com', 'something')).toStrictEqual({error: 'error'});
    });

    //user's Id will be 1
    test('valid input (1)', () => {
        const user1 = authRegisterV1("jovanka@gmail.com", "somepassword", "nameFirst", "nameLast");
        const user1Id = user1.authUserId;
        expect(authLoginV1("jovanka@gmail.com", "somepassword")).toStrictEqual({authUserId: expect.any(Number)});
    });
})
*/