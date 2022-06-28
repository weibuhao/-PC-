const key = 'TobName'
export const setltem = (val) => {
  return sessionStorage.setItem(key, val)
}

export const getTobName = () => {
  return sessionStorage.getItem(key)
}

export const removeTobName = () => {
  return sessionStorage.removeItem(key)
}
