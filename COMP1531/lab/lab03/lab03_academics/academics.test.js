import {
  dataStore,
  academicCreate,
  courseCreate,
  academicDetails,
  courseDetails,
  academicsList,
  coursesList,
  clear,
} from './academics';

describe ('academicCreate', () => {
  test.each([
    ['', 'dancing', "{ error: 'error' }"],
    ['Shakira', '', "{ error: 'error' }"],
    ['Shakira', 'dancing', '{"academicId": 1}'],
  ]) ('Test name: %s, hobby: %s', (testName, testHobby, expected) => {
    expect(academicCreate(testName, testHobby)).toEqual(expected);
  });
});
