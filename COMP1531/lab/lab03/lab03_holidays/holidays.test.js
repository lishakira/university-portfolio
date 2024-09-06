import { holidaysInRange, main } from './holidays';

describe('Error Testing', () => {
  test.each([
    ['2022', '2020'],
    ['300', '3000'],
  ]) ('Test Range %d to %d', (testStart, testEnd) => {
    expect(holidaysInRange(testStart, testEnd)).toStrictEqual([]);
  });
});

describe('50 Years Ago', () => {
  test('Test Range 1970 to 1972', () => {
    expect(holidaysInRange(1970, 1972)).toStrictEqual([
      {
        valentinesDay: 'Saturday, 14.02.1970',
        easter: 'Sunday, 29.03.1970',
        christmas: 'Friday, 25.12.1970',
      },
      {
        valentinesDay: 'Sunday, 14.02.1971',
        easter: 'Sunday, 11.04.1971',
        christmas: 'Saturday, 25.12.1971',
      },
      {
        valentinesDay: 'Monday, 14.02.1972',
        easter: 'Sunday, 02.04.1972',
        christmas: 'Monday, 25.12.1972',
      }
    ]);
  });
});

describe('2 Years Ago', () => {
  test('Test Range 2020 to 2022', () => {
    expect(holidaysInRange(2020, 2022)).toStrictEqual([
      {
        valentinesDay: 'Friday, 14.02.2020',
        easter: 'Sunday, 12.04.2020',
        christmas: 'Friday, 25.12.2020',
      },
      {
        valentinesDay: 'Sunday, 14.02.2021',
        easter: 'Sunday, 04.04.2021',
        christmas: 'Saturday, 25.12.2021',
      },
      {
        valentinesDay: 'Monday, 14.02.2022',
        easter: 'Sunday, 17.04.2022',
        christmas: 'Sunday, 25.12.2022',
      }
    ]);
  });
});

describe('Within One Year', () => {
  test('Test Range 2022 to 2022', () => {
    expect(holidaysInRange(2022, 2022)).toStrictEqual([
      {
        valentinesDay: 'Monday, 14.02.2022',
        easter: 'Sunday, 17.04.2022',
        christmas: 'Sunday, 25.12.2022',
      }
    ]);
  });
});

describe('5 Years Later', () => {
  test('Test Range 2027 to 2029', () => {
    expect(holidaysInRange(2027, 2029)).toStrictEqual([
      {
        valentinesDay: 'Sunday, 14.02.2027',
        easter: 'Sunday, 28.03.2027',
        christmas: 'Saturday, 25.12.2027',
      },
      {
        valentinesDay: 'Monday, 14.02.2028',
        easter: 'Sunday, 16.04.2028',
        christmas: 'Monday, 25.12.2028',
      },
      {
        valentinesDay: 'Wednesday, 14.02.2029',
        easter: 'Sunday, 01.04.2029',
        christmas: 'Tuesday, 25.12.2029',
      },
    ]);
  });
});

  