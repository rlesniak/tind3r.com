export const EXT_ID = process.env.NODE_ENV === 'production' ? 'iopleohdgiomebidpblllpaigodfhoia' : 'hclhcjagjmknmkjmcnlhddhjojnghjmc'

export const pageTitle = prefix => {
  const title = 'Tind3r - Unofficial Tinder client'

  if (prefix) {
    return `${prefix} - ${title}`
  }

  return title
}
