
export const originalId = 'iopleohdgiomebidpblllpaigodfhoia';
export const nonStoreId = 'aalgphbalbbjeanggebmnagogdofokkb';

let activeId = nonStoreId;

export const setId = id => { activeId = id; };

export const EXT_ID = () => activeId;

export const ACTION_TYPES = {
  LIKE: 'like',
  PASS: 'pass',
  SUPERLIKE: 'superlike',
};
