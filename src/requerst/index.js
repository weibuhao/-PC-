import theAxios from 'axios'

const axios = theAxios.create({
  baseURL: 'https://music-api-blue-two.vercel.app/',
  timeout: 20000
})

export default
({ url, method = 'GET', params = {}, data = {}, headers = {} }) => {
  return axios({
    url,
    method,
    params,
    data,
    headers
  })
}
