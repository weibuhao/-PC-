import dayjs from 'dayjs'

export const getMinute = (time) => {
  const times = time / 1000
  let m = parseInt(times / 60 % 60)
  m = m < 10 ? '0' + m : m
  let s = parseInt(times % 60)
  s = s < 10 ? '0' + s : s
  return m + ':' + s
}
export const getMinute2 = (time) => {
  const times = time
  const m = parseInt(times / 60 % 60)
  let s = parseInt(times % 60)
  s = s < 10 ? '0' + s : s
  return m + ':' + s
}
export const Dayjs = dayjs
