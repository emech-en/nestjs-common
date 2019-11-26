interface StandardEnum<T> {
  [id: string]: T | string;

  [nu: number]: string;
}

export const getEnumValues = <T extends StandardEnum<any>>(
  enumObject: T,
): Array<string | number> => {
  return Object.keys(enumObject)
    .filter(key => isNaN(+key))
    .map(key => enumObject[key]);
};
