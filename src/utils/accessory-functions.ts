export const assignProperties = (dto, entityObject) => {
  let changed = false;
  Object.keys(dto).forEach((dtoKey) => {
    if (entityObject[dtoKey] === dto[dtoKey]) {
      changed = true;
    }
    entityObject[dtoKey] = dto[dtoKey];
  });
  return changed;
};

export const nullProperties = (objToNullProps, keysObj) => {
  Object.keys(keysObj).forEach((key) => {
    objToNullProps[key] = null;
  });
};
