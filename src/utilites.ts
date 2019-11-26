export const enumToArray = <E>(e: any): E[] => {
  const result: E[] = [];
  for (const key of Object.keys(e)) {
    result.push(e[key]);
  }
  return result;
};
