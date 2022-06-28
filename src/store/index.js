import { createStore } from 'vuex'
import { getSongSingListAPI, getSongDataAPI } from '@/api/index'
export default createStore({
  state: {
    songSingList: [],
    mvList: [],
    playId: 1374489910,
    songIndex: 0,
    scrollTop: 0
  },
  getters: {
  },
  mutations: {
    // 双击切歌
    IDUPDATE(state, value) {
      state.playId = value
    },
    // 获取歌单歌曲数据
    GETSONG(state, value) {
      state.songSingList = value
    },
    // 歌曲索引号
    GETINDEX(state, value) {
      state.songIndex = value
    },
    SCROLL(state, value) {
      state.scrollTop = value
    }
  },
  actions: {
    // axios请求获取歌单数据
    async getsong(context, value) {
      const { data: res } = await getSongSingListAPI(value)
      context.commit('GETSONG', res.songs)
    },

    // 获取下一首歌曲的id
    getNextPlayID(context) {
      const index = context.state.songIndex
      if (context.state.songSingList[index] === undefined) return
      const nxetID = context.state.songSingList[index].id
      context.commit('IDUPDATE', nxetID)
    },

    // 获取上一首id
    getPreviousSongID(context) {
      const index = context.state.songIndex
      const nxetID = context.state.songSingList[index].id
      context.commit('IDUPDATE', nxetID)
    },
    // 歌曲播放id
    async getCurrentPlayID(context, value) {
      await getSongDataAPI(value)
      const index = context.state.songSingList.findIndex((element, index, array) => {
        return element.id === value
      })
      context.commit('GETINDEX', index)
    },
    async  getLatelyPlay(context, value) {
      const arr = JSON.parse(localStorage.getItem('lateyPlay'))
      const whether = arr.findIndex((element, index, array) => {
        return element.id === value
      })
      const { data: res } = await getSongDataAPI(value)
      if (whether === -1) {
        arr.unshift(res.songs[0])
        localStorage.setItem('lateyPlay', JSON.stringify(arr))
      } else {
        arr.unshift(res.songs[0])
        arr.splice(whether + 1, 1)
        localStorage.setItem('lateyPlay', JSON.stringify(arr))
      }
    }
  },
  modules: {
  }
})
