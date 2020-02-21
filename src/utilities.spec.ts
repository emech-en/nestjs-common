import { getEnumValues } from './utilities';

describe('Test getEnumValues(v: typeof enum) {}', () => {
  test('Test When All Values Are Const', () => {
    enum TestEnum {
      C,
      A,
      B,
      D,
    }

    const result = getEnumValues(TestEnum);
    expect(result.sort()).toEqual([TestEnum.B, TestEnum.A, TestEnum.C, TestEnum.D].sort());
  });

  test('Test When All Values Are Number', () => {
    enum TestEnum {
      C = 2,
      A = 3,
      B = 1,
      D = 5,
    }

    const result = getEnumValues(TestEnum);
    expect(result.sort()).toEqual([TestEnum.B, TestEnum.A, TestEnum.C, TestEnum.D].sort());
  });

  test('Test When All Values Are String', () => {
    enum TestEnum {
      C = 'Value1',
      A = 'Value2',
      B = 'Value3',
      D = 'Value4',
    }

    const result = getEnumValues(TestEnum);
    expect(result.sort()).toEqual([TestEnum.B, TestEnum.A, TestEnum.C, TestEnum.D].sort());
  });

  test('Test When Values Are Mixed', () => {
    enum TestEnum {
      G,
      A = 'Value1',
      C = 'A',
      B = 'D',
      D = -5,
      '5th Key' = 8,
      '5.5+' = 10,
      '5..' = 5,
      '-5t',
    }

    const result = getEnumValues(TestEnum);
    expect(result.sort()).toEqual(
      [
        TestEnum.B,
        TestEnum.A,
        TestEnum.C,
        TestEnum.D,
        TestEnum.G,
        TestEnum['5th Key'],
        TestEnum['5.5+'],
        TestEnum['5..'],
        TestEnum['-5t'],
      ].sort(),
    );
  });

  test('Test When Some Keys = Some Values', () => {
    enum TestEnum {
      G,
      A = 'FooBar',
      C = 'A',
      B = 'D',
      D = 1,
    }

    const result = getEnumValues(TestEnum);
    expect(result.sort()).toEqual([TestEnum.B, TestEnum.A, TestEnum.C, TestEnum.D, TestEnum.G].sort());
  });

  test('Test When Enum is Empty', () => {
    enum TestEnum {}

    const result = getEnumValues(TestEnum);
    expect(result).toEqual([]);
  });
});
