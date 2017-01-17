export const miToKm = mi => Number((mi * 1.6093).toFixed(0))
export const kmToMi = km => Number((km / 1.6093).toFixed(0))

export const pageTitle = prefix => {
  const title = 'Tind3r - Unofficial Tinder client'

  if (prefix) {
    return `${prefix} - ${title}`
  }

  return title
}
