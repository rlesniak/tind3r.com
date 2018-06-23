export const miToKm = mi => Number((mi * 1.6093).toFixed(0));
export const kmToMi = km => Number((km / 1.6093).toFixed(0));

export const fbUserSearchUrl = (schoolId: string, name: string) =>
  `https://www.facebook.com/search/str/${name}/keywords_users?filters_school={"name":"users_school","args":"${schoolId}"}`; // eslint-disable-line max-len

export const pageTitle = 'Tind3r.com - Unofficial Tinder client';
