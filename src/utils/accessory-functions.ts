export const assignProperties = (dto, entityObject) => {
  Object.keys(dto).forEach((dtoKey) => {
    entityObject[dtoKey] = dto[dtoKey];
  });
};

export const nullProperties = (objToNullProps, keysObj) => {
  Object.keys(keysObj).forEach((key) => {
    objToNullProps[key] = null;
  });
};
