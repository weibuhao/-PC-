<template>
  <div class="top-title" >
   <div class="title">
     <span>音乐标题</span>
     <span>歌手</span>
     <span>专辑名</span>
     <span>时长</span>
    </div>

     <div  v-infinite-scroll="load"  class="infinite-list"  infinite-scroll-immediate="false"  style="overflow: auto" >
      <el-backtop  class="go_top" :right="50" :bottom="100" target=".infinite-list" @click="goTop" />
    <div class="music"
    ref="song"
     v-for="(item,index) in songSingList"
     :key="index"
     @dblclick="play(item,index)"
     >
      <span >{{index+1}}</span>
      <span class="iconfont icon-shoucang"></span>
      <span ref="songTitle">{{item.name}}<span class="VIP" v-if="item.fee==1">VIP</span><span :class="{Margin:item.fee==1}" class="iconfont icon-shipin" @click="goMv(item)" v-if="item.mv!=0"></span></span>
      <span>
        <p v-for="(item,index) in item.ar" :key="index">{{item.name}}</p></span>
      <span>{{item.al.name}}</span>
      <span>{{getMinute(item.dt)}}</span>
    </div>
    </div>

  </div>
</template>

<script setup>
import { getSongSingListAPI, getSearchResultAPI, getSingerSongsAPI } from '@/api/index'
// 路由
import { useRoute, useRouter } from 'vue-router'
// vuex
import store from '@/store/index'
// 转换分钟
import { getMinute } from '@/utils/date'
// 兄弟传值
import bus from '@/utils/Bus.js'
import { ElMessage } from 'element-plus'
import { ref, onMounted, nextTick, watch, defineEmits, h, defineProps } from 'vue'

const router = useRouter()
const route = useRoute()
const song = ref()
const songTitle = ref()
// 歌曲数据
const songSingList = ref({})

const goTop = () => {
  document.documentElement.scrollTo({ top: 0, behavior: 'smooth' })
}

const goMv = (item) => {
  router.push({ path: '/mv/details', query: { mvId: item.mv } })
}

const props = defineProps({ songNumber: Number, list: Object })
const songCount = ref(300)
let page = 1
let songsPage = 0
const load = async() => {
  page++
  songsPage++
  if (route.query.name !== undefined) {
    if (songSingList.value.length < songCount.value) {
      const { data: res } = await getSearchResultAPI(route.query.name, page)
      songCount.value = res.result.songCount
      songSingList.value = [...songSingList.value, ...res.result.songs]
    } else {
      ElMessage({
        message: h('p', null, [
          h('span', { style: 'text-align: center' }, '没有了哦 亲！！！ '),
          h('i', { style: 'color: teal' }, 'ヾ(´∀`o)+')
        ])
      })
    }
  } else if (route.query.id !== undefined) {
    if (songSingList.value.length < props.songNumber) {
      const id = route.query.id
      const { data: res } = await getSongSingListAPI(id, songsPage)
      songSingList.value = [...songSingList.value, ...res.songs]
      store.dispatch('getsong', id)
    } else {
      ElMessage({
        message: h('p', null, [
          h('span', { style: 'text-align: center' }, '没有了哦 亲！！！ '),
          h('i', { style: 'color: teal' }, 'ヾ(´∀`o)+')
        ])
      })
    }
  } else if (route.query.idr !== undefined) {
    if (songSingList.value.length < 300) {
      const id = route.query.idr
      const { data: res } = await getSingerSongsAPI(id, songsPage)
      songSingList.value = [...songSingList.value, ...res.songs]
      // store.dispatch('getsong', id)
    } else {
      ElMessage({
        message: h('p', null, [
          h('span', { style: 'text-align: center' }, '没有了哦 亲！！！ '),
          h('i', { style: 'color: teal' }, 'ヾ(´∀`o)+')
        ])
      })
    }
  }
}

const emit = defineEmits()

// 搜索列表数据
const searchresultAPI = async() => {
  const { data: res } = await getSearchResultAPI(route.query.name)
  songSingList.value = res.result.songs
  nex(songSingList.value)
  emit('total', res.result.songCount)
}

bus.on('current', (val) => {
  // 循环播放歌曲
  if (val.index === store.state.songSingList.length) {
    val.index = 0
    store.commit('GETINDEX', val.index)
    val.play = store.state.songSingList[0].id
  } else if (val.index === -1) {
    val.index = store.state.songSingList.length - 1
    val.play = store.state.songSingList[store.state.songSingList.length - 1].id
  }
  if (val.fee !== 1) {
    play(val.play, val.index)
  }
})

bus.on('empty', () => {
  songSingList.value = []
  localStorage.setItem('lateyPlay', JSON.stringify([]))
})

bus.on('playOne', (val) => {
  if (val === undefined) {
    play(songSingList.value[0], 0)
  }
  play(val, 0)
})

// 在搜索页面中第二次搜索回到顶部
nextTick(() => {
  bus.on('goTop', (val) => {
    if (route.query.name !== undefined) {
      const listRef = document.querySelector('.infinite-list')
      listRef.scrollTop = 0
    }
  })
})

const play = (item, index) => {
  // 排他思想
  if (item === undefined) return
  const play = item.id || item
  nextTick(() => {
    if (route.query.name !== undefined || route.query.id !== undefined || route.query.idr !== undefined || item.fee !== 1) {
      song.value.forEach((value) => {
        value.style.backgroundColor = ''
      })
      songTitle.value.forEach((value) => {
        value.style.color = ''
      })
      // 变色

      nextTick(() => {
        if (songTitle.value[index] === undefined) return
        songTitle.value[index].style.color = 'red'
        song.value[index].style.backgroundColor = '#f5f7fa'
      })
    }
  })

  store.commit('IDUPDATE', play)
  store.commit('GETINDEX', index)
  store.commit('GETSONG', songSingList.value)
}

const nex = (list) => {
  nextTick(() => {
    const current = list.findIndex((element) => {
      return element.id === store.state.playId
    })
    if (current !== -1) {
      play(store.state.playId, current)
    }
  })
}

onMounted(async() => {
  if (route.query.id !== undefined) {
    const id = route.query.id
    const { data: res } = await getSongSingListAPI(id)
    songSingList.value = res.songs
    store.dispatch('getsong', id)
    nex(songSingList.value)
  }
  if (route.query.name !== undefined) {
    searchresultAPI()
  }
  if (route.query.idr !== undefined) {
    const id = route.query.idr
    const { data: res } = await getSingerSongsAPI(id)
    songSingList.value = res.songs
    nex(songSingList.value)
  } if (props.list !== undefined) {
    songSingList.value = props.list
    nex(songSingList.value)
  }
})

watch(() => route.query.name,
  () => {
    searchresultAPI()
    song.value.forEach((value) => {
      value.style.backgroundColor = ''
    })
    songTitle.value.forEach((value) => {
      value.style.color = ''
    })
  }
)
watch(() => songSingList.value,
  () => {
    store.commit('GETSONG', songSingList.value)
  }
)

</script>

<style lang="less" scoped>
.go_top{
   color: #db2c1d;
}

.Margin{
  padding: 0 !important;
}
.title{
  cursor: default;
  display: flex;
  height: 35px;

  span{
    flex: 1;
    padding-left:80px ;
    line-height: 35px;
   font-size: 12px;
   font-weight: 600;
   color: #ccc;
  }

  span:nth-child(2){
    padding-left: 210px;
  }
  span:nth-child(3){
    padding-left: 70px;
  }
}

.infinite-list-wrapper{
  p:nth-child(1),p:nth-child(2){
    text-align: center;
  }
}
.infinite-list::-webkit-scrollbar {
    display: none;
  }
.infinite-list {
  height: 480px;
  padding: 0;
  margin: 0;
  list-style: none;

.music{
  cursor: pointer;
  color: #606266;
  display: flex;
   height: 35px;
   line-height: 35px;
   span{
     font-size: 12px;

     overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
   }
   span:nth-child(1){
    width: 30px;

  }
  span:nth-child(2){
    padding-left:20px;
  }
   span:nth-child(3){
    display: flex;
    padding-left:17px;
    width: 312px;

.VIP{
  margin:10px 0 0 10px ;
  width: 25px;
  line-height: 15px;
  text-align: center;
  height: 15px;
  border-radius: 10px;
  color: #db2c1d;
  border: 1px solid red;
  font-size: 8px !important;
}

   .icon-shipin{
     font-size: 16px;
    margin-left:10px ;
    color: #db2c1d;
   }
  }
   span:nth-child(4){
     display: flex;
    width: 200px;
    padding-left:57px ;

    p{
      margin:0 3px 0;
    font-size: 12px;
    overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  span:nth-child(5){
     width: 120px;
     padding-left: 48px;
  }
  span:nth-child(6){
    margin-left:127px ;
  }
}
.music:hover{
  background-color: #f5f7fa;
}
}

</style>
