export const assignProperties = (dto, entityObject) => {
  Object.keys(dto).forEach((dtoKey) => {
    entityObject[dtoKey] = dto[dtoKey];
  });
};
