import axios from '@/requerst/index'
// import { TypeComponentsMap } from 'element-plus/lib/utils'
// 轮播图接口
export const getFocusImgAPI = () => {
  return axios({
    url: '/banner?type=0'
  })
}

// 二维码--key接口
export const getKeyAPI = (timestamp = Date.now()) => {
  return axios({
    url: `/login/qr/key?timestamp=${timestamp}`
  })
}

// 二维码--图片接口
export const getKeyImgAPI = ({ key, qrimg = true, time = Date.now() }) => {
  return axios({
    url: '/login/qr/create',
    method: 'POST',
    params: {
      key,
      qrimg,
      time
    }
  })
}

// 二维码--扫码接口
export const getUserAPI = ({ key, timestamp = Date.now() }) => {
  return axios({
    url: `/login/qr/check?key=${key}&${timestamp}`
  })
}

// 歌单--推荐歌单
export const getRecommendSongAPI = () => {
  return axios({
    url: '/personalized?limit=10'
  })
}

// 歌单--歌单详情
export const getSongSingAPI = (id) => {
  return axios({
    url: `/playlist/detail?id=${id}`
  })
}

// 歌单--歌单歌曲列表
export const getSongSingListAPI = (data, page = 0, limit = 20) => {
  return axios({
    url: `/playlist/track/all?id=${data}&limit=${limit}&offset=${page * limit}`
  })
}

// 歌单--歌曲详情
export const getSongDataAPI = (id) => {
  return axios({
    url: `/song/detail?ids=${id}`
  })
}

// 歌单--歌单分类
export const getSortSongSingAPI = () => {
  return axios({
    url: '/playlist/hot'
  })
}

// 歌单--最新与歌单最热歌单
export const getHotSongSingAPI = (cat = '华语', page = 0) => {
  return axios({
    url: `/top/playlist?limit=20&order&cat=${cat}&offset=${page * 20}`
  })
}

// 歌单--歌曲歌词
export const getLyricAPI = (id) => {
  return axios({
    url: `/lyric?id=${id}`
  })
}

// 排行榜--详情
export const getRankingListAPI = () => {
  return axios({
    url: '/toplist'
  })
}

// 搜索--热搜
export const getHotSearchAPI = () => {
  return axios({
    url: '/search/hot/detail'
  })
}

// 搜索--搜索提示
export const getSearchTipsAPI = (keyName) => {
  return axios({
    url: `/search/suggest?keywords=${keyName}`
  })
}

// 搜索--搜索结果
export const getSearchResultAPI = (keywords, page = 0, type = 1, limit = 30) => {
  return axios({
    url: `/cloudsearch?keywords=${keywords}&offset=${page * limit}&type=${type}&limit=${limit}`
  })
}

// 歌手--歌手列表
export const getSingerListAPI = (type = -1, area = -1, surname = '') => {
  return axios({
    url: `/artist/list?type=${type}&area=${area}&initial=${surname}&0`
  })
}

// 歌手--歌手详情
export const getSingerDetailsAPI = (id) => {
  return axios({
    url: `/artist/detail?id=${id}`
  })
}

// 歌手--歌手全部歌曲
export const getSingerSongsAPI = (id, page = 0) => {
  return axios({
    url: `/artist/songs?id=${id}&order=hot&limit=20&offset=${page * 30}`
  })
}

// 歌曲--最新歌曲
export const getNewSongsAPI = (sort = 0) => {
  return axios({
    url: `/top/song?type=${sort}`

  })
}

// mv--最新Mv
export const getNewMvAPI = (sort = '') => {
  return axios({
    url: `/mv/first?limit=8&area=${sort}`

  })
}

// mv--网易出品mv
export const getNeteaseMvAPI = () => {
  return axios({
    url: '/mv/exclusive/rcmd?limit=8'

  })
}

// mv--mv播放地址
export const getMvPlayAPI = (id) => {
  return axios({
    url: `/mv/url?id=${id}`

  })
}

// mv--mv详情数据
export const getMvDetailsAPI = (id) => {
  return axios({
    url: `/mv/detail?mvid=${id}`

  })
}

// mv--相似mv
export const getSimilarMvsAPI = (id) => {
  return axios({
    url: `/simi/mv?mvid=${id}`

  })
}
