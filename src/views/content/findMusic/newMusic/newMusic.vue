<template>
  <div>
    <div class="new_music" >
    <div class="music_sort">
      <div class="whole"><span class="iconfont icon-kaishi" @click="play(songs.list[0].id,0)">播放全部</span><span class="iconfont icon-cha">收藏全部</span></div>
    </div>
    <div class="music_list" v-if="show">
      <div class="music" ref="song" v-for="(item, index) in songs.list" :key="index" @dblclick="play(item.id,index)"  >
        <span>{{ index + 1 }}</span>
        <div><el-image :src="item.album.blurPicUrl" lazy alt="" /></div>
        <span ref="songTitle">{{ item.name }}</span
        ><span>{{ item.artists[0].name }}</span
        ><span>{{ item.album.name }}</span
        ><span>{{getMinute(item.duration)}}</span>
      </div>

    </div>
     <el-skeleton v-else :rows="8" :animated="true" />
  </div>

  <el-backtop  :right="50" :bottom="100" />
  </div>

</template>

<script setup>
import { getNewSongsAPI } from '@/api/index'
import { getMinute } from '@/utils/date'
import bus from '@/utils/Bus'
import store from '@/store'
import { nextTick, onMounted, reactive, ref } from 'vue'

const show = ref(false)
const songs = reactive({})

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
  play(val.play, val.index)
})

const song = ref()
const songTitle = ref()

const play = (id, index) => {
  // bus.emit('play', id)
  store.commit('IDUPDATE', id)
  store.commit('GETINDEX', index)
  store.commit('GETSONG', arr)
  if (songTitle._rawValue[index] === undefined) return
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

const arr = []
onMounted(async() => {
  const { data: res } = await getNewSongsAPI()
  for (let i = 0; i < 20; i++) {
    arr.push(res.data[i])
  }
  songs.list = arr
  show.value = true
})

</script>

<style lang="less" scoped>
.current {
  background-color: #f5f7fa;
  color: #db2c1d ;
}
.new_music {
  width: 100%;
  .music_sort {
    display: flex;
    // height: 30px;
    text-align: center;
  }

  .whole {
    display: flex;
    margin-left: 375px;
    span {
      cursor: pointer;
      font-size: 14px;
      line-height: 30px;
      margin: 0 10px;
      padding: 0 15px;
      border-radius: 20px;
      border: 1px solid #ccc;
    }

    span:nth-child(1) {
       border:0;
      background-color: #db2c1d;
      color: #fff;
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
}
</style>
