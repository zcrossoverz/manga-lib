export const not_null = (params: string | null | undefined): string => {
  return params !== null && params !== undefined ? params : '';
};

export const splitString = (str: string, start: string, end: string) => {
  return str.split(start)[1].split(end)[0];
};
