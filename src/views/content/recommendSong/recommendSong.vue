<template>
  <div>
     <h1> <i class="fi fi-ubuntu fi-spin icon"></i> 推荐单曲<span class='song_count'>共{{songCount}}首歌曲</span></h1>
    <div class="play_but"><span class="iconfont icon-kaishi" @click="playOne(songs.list[0].id,0)">播放全部</span></div>
    <div class="music_list" v-if="show">
      <div class="music" ref="song" v-for="(item, index) in songs.list" :key="index" @dblclick="play(item.id,index)"  >
        <span>{{ index + 1 }}</span>
        <div><el-image :src="item.al.picUrl" lazy alt="" /></div>
        <span ref="songTitle">{{item.name}}</span
        ><span>{{item.ar[0].name}}</span
        ><span>{{item.al.name}}</span>
        <span>{{getMinute(item.dt)}}</span>
      </div>
    </div>
     <el-skeleton v-else :rows="8" :animated="true" />
  </div>
</template>

<script setup>
import { getSongSingListAPI } from '@/api/index'
import { getMinute } from '@/utils/date'
import bus from '@/utils/Bus'
import store from '@/store'
import { nextTick, onMounted, reactive, ref } from 'vue'

const show = ref(false)
const songs = reactive({})
const songCount = ref()

bus.on('current', (val) => {
  // 循环播放歌曲
  if (store.state.songSingList === undefined) return
  if (val.index === store.state.songSingList.length) {
    val.index = 0
    store.commit('GETINDEX', val.index)
    val.play = store.state.songSingList[0].id
  } else if (val.index === -1) {
    val.index = store.state.songSingList.length - 1
    val.play = store.state.songSingList[store.state.songSingList.length - 1].id
  }
  play(val.play, val.index)
})

const playOne = (id, index) => {
  play(id, index)
}

const song = ref()
const songTitle = ref()

const play = (id, index) => {
  // bus.emit('play', id)
  store.commit('IDUPDATE', id)
  store.commit('GETINDEX', index)
  store.commit('GETSONG', songs.list)
  if (songTitle._rawValue === undefined) return
  nextTick(() => {
    song._rawValue.forEach((value) => {
      value.style.backgroundColor = ''
    })
    songTitle._rawValue.forEach((value) => {
      value.style.color = ''
    })
    // 变色
    songTitle._rawValue[index].style.color = 'red'
    song._rawValue[index].style.backgroundColor = '#f5f7fa'
  })
}

onMounted(async() => {
  const { data: res } = await getSongSingListAPI(924680166)
  songs.list = res.songs
  show.value = true
  songCount.value = songs.list.length
})
</script>

<style lang="less" scoped>
h1{
  margin-top: 0;

  .icon{
   font-size: 30px;
   color: #db2c1d;
  }
  .song_count{
   display: inline-block;
   margin-left: 20px;
    font-size: 14px;
    font-weight: 400;
  }
}
.play_but{
  display: flex;
  margin-bottom: 15px;
  span{
    cursor: pointer;
    padding: 3px 8px;
    border-radius: 20px;
    margin: 0 5px;
    font-size: 14px;
    background-color: #db2c1d;
      color: #fff;
  }
  .icon-cha{
    span{
      font-size: 14px;
    }
  }
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

.music_list {
    margin: 20px 30px 0 0;
    .music {
      cursor: pointer;
      display: flex;
      height: 60px;
      padding: 10px 0;
      line-height: 60px;
      color: #676767;
      font-size: 12px;

      span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      span:nth-child(1) {
        width: 30px;
        margin-right: 20px;
        text-align: center;
        color: #ccc;
      }

      span:nth-child(3) {
        width: 250px;
        margin-left: 30px;
      }
      span:nth-child(4) {
        width: 200px;
        margin-left: 30px;
      }
      span:nth-child(5) {
        width: 200px;
        margin-left: 30px;
      }
      span:nth-child(6) {
        width: 200px;
        margin-left: 30px;
        text-align: center;
      }
      div {
        width: 60px;
        border-radius: 8px 8px;
        overflow: hidden;
        img {
          width: 100%;
          border-radius: 8px 8px;
        }
      }
    }
  }

  .music:hover {
    background-color: #f5f7fa;
  }
</style>
