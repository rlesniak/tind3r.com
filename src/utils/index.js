export const miToKm = mi => Number((mi * 1.6093).toFixed(0));
export const kmToMi = km => Number((km / 1.6093).toFixed(0));

export const fbUserSearchUrlBySchool = (schoolId: string, name: string) =>
  `https://www.facebook.com/search/str/${name}/keywords_users?filters_school={"name":"users_school","args":"${schoolId}"}`; // eslint-disable-line max-len

export const fbUserSearchUrlByInterests = (interestIds: string, name: string) => {
  const str = Array.isArray(interestIds) ? interestIds.join('/likers/') : interestIds;
  return `https://www.facebook.com/search/str/${name}/users-named/${str}/likers/intersect`;
};

export const pageTitle = 'Tind3r.com - Unofficial Tinder client';
