/**
 * @see password
 * @module password.test
 */

import { checkPassword } from './password';

describe('Strong Password (SP)', () => {
  test.each([
    ['StrongPassword14'], 
    ['0123456789sP'],
    ['qwertyuiopASDFGHJKLzxcvbnm1234567890'],
    ['$trongP@ssT0'],
    ['StrongPassT0']
  ]) ('SP Test %s', (testPassword) => {
    expect(checkPassword(testPassword)).toEqual('Strong Password');
  });
})

describe('Moderate Password (MP)', () => {
  test.each([
    // NO UPPERCASE LETTER
    ['m0der@t3'],
    ['qwertyuiopasdfghjklzxcvbnm1234567890'],
    // NO LOWERCASE LETTER
    ['MPWTESTING#9'],
    ['QWERTYUIOPASDFGHJKLZXCVBNM1234567890'],
    // NO LETTERS
    ['12345678'],
    ['!@#$%^&8'],
    // CHARACTER LENGTH < 12
    ['Moder@tePW0'],
    ['Passw0rd'],
  ]) ('MP Test %s', (testPassword) => {
    expect(checkPassword(testPassword)).toEqual('Moderate Password');
  });
})

// Top 5 most common password in the 2021 Nordpass Ranking:
// https://en.wikipedia.org/wiki/List_of_the_most_common_passwords
describe('Horrible Password (HP)', () => {
  test.each([
    ['123456'],
    ['123456789'],
    ['12345'],
    ['qwerty'],
    ['password'],
  ]) ('HP Test %s', (testPassword) => {
    expect(checkPassword(testPassword)).toEqual('Horrible Password');
  });
})

describe('Poor Password (PP)', () => {
  test.each([
    // NO NUMBER
    ['POORPASSWORD'],
    ['poorpassword'],
    ['poorp@s$word'],
    ['poorPOOR'],
    // CHARACTER LENGTH < 8
    ['1234567'],
    ['POORPW'],
    ['poorpw'],
    ['PTpass0'],
    ['PTp@ass'],
  ]) ('PP Test %s', (testPassword) => {
    expect(checkPassword(testPassword)).toEqual('Poor Password');
  });
}) 