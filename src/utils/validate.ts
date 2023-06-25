export const not_null = (params: string | null | undefined): string => {
  return params !== null && params !== undefined ? params : "";
};
