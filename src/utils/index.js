export const miToKm = mi => Number((mi * 1.6093).toFixed(0));
export const kmToMi = km => Number((km / 1.6093).toFixed(0));

export const fbUserSearchUrl = (school: string, name: string) =>
  `https://www.facebook.com/search/str/${school}/pages-named/students/present/str/${name}/users-named/intersect/`;
