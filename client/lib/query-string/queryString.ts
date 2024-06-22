export const createSearchParamString = (params: Record<string, any>) => {
  return new URLSearchParams(
    Object.entries(params)
      .filter(([, value]) => value != null)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map((x) => [key, x]);
        }
        return [[key, value]];
      })
      .flat()
  )
    .toString()
    .replace(/\+/g, '%20');
};

export const createQueryString = (params: Record<string, any>) => {
  const queryString = createSearchParamString(params);

  if (queryString === '') {
    return '';
  }

  return `?${queryString}`;
};

export const QS = {
  create: createQueryString,
};
