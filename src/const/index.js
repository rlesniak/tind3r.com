
export const originalId = 'iopleohdgiomebidpblllpaigodfhoia';
export const secondStoreId = 'olicollicgbjgnialpnmnolopimdccon';
export const nonStoreId = 'aalgphbalbbjeanggebmnagogdofokkb';

let activeId = nonStoreId;

export const setId = (id) => { activeId = id; };

export const EXT_ID = () => localStorage.getItem('ext_id') || activeId;

export const ACTION_TYPES = {
  LIKE: 'like',
  PASS: 'pass',
  SUPERLIKE: 'superlike',
};
