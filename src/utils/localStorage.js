const key = 'searchHistory'

export const setltemKey = (val) => {
  return localStorage.setItem(key, val)
}

export const getKey = () => {
  return localStorage.getItem(key)
}

export const removeKey = () => {
  return localStorage.removeItem(key)
}
