<template>
  <div v-if="loadShow">
    <div class="song-details">
      <div class="song-ing">
        <img :src="author.img" alt="" />
      </div>
      <div class="details">
        <span class="song-single">歌手</span>
        <span class="song-name">{{ author.name }}</span>
        <div class="author-state">
          <span class="author-img"><img :src="author.img" alt="" /></span><span class="author-name">{{ author.name }}</span>
        </div>
        <div class="icon-data">
          <div><span class="iconfont icon-kaishi"  @click="playOne">播放全部</span></div>
          <div><span class="iconfont icon-shoucang">收藏</span></div>
          <div><span class="iconfont icon-fenxiang">分享</span></div>
        </div>
        <div class="sketch">
          <div>歌曲：{{ author.trackSong }}</div>
          <div>MV： {{ author.mvCount }}</div>
          <div>标签：{{ author.tags }}</div>
          <div class="introduction">简介：{{ author.description }}</div>
        </div>
      </div>
    </div>
    <div class="top-nav">
      <el-tabs v-model="activeName" class="demo-tabs">
        <!-- @tab-click="handleClick" -->
        <el-tab-pane label="歌曲列表" name="first">
          <SongList :songNumber="author.trackSong"></SongList>
        </el-tab-pane>
        <el-tab-pane label="MV" name="mv"><MvList :mvlist="mvlist" @load="getLoad" /></el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <div class="load" v-else>
    <el-skeleton style="width: 240px">
      <template #template>
        <el-skeleton-item variant="image" style="width: 180px; height: 180px; margin: 0 50px 0 40px" />
        <div style="padding: 14px">
          <div style="display: flex; align-items: center; justify-items: space-between"></div>
        </div>
      </template>
    </el-skeleton>
    <el-skeleton :rows="5" animated />
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { ElLoading } from 'element-plus'
import bus from '@/utils/Bus'
import { getSingerDetailsAPI, getSearchResultAPI } from '@/api/index'
import SongList from '@/views/content/findMusic/songList/SongList.vue'
import MvList from '../../MV/MvList.vue'

const route = useRoute()
const loadShow = ref(false)
const activeName = 'first'
const songDetails = ref({})
const mvlist = ref({})
const author = reactive({
  img: '',
  name: '',
  date: '',
  tags: [],
  playCount: 0,
  trackSong: 0,
  mvCount: 0,
  description: '',
  subscribedCount: 0,
  shareCount: 0
})

const playOne = () => {
  bus.emit('playOne')
}

let time = null
const getLoad = async(val) => {
  clearTimeout(time)
  const loading = ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  const { data: res } = await getSearchResultAPI(songDetails.value.data.artist.name, val, 1004, 12)
  // if (res.result.mvs.length === 0) return
  mvlist.value = [...mvlist.value, ...res.result.mvs]

  time = setTimeout(() => {
    loading.close()
  }, 2000)
}

onMounted(async() => {
  document.documentElement.scrollTop = 0
  const id = route.query.idr
  const { data: res } = await getSingerDetailsAPI(id)
  const { data: res2 } = await getSearchResultAPI(res.data.artist.name, 0, 1004, 12)
  mvlist.value = res2.result.mvs
  songDetails.value = res
  loadShow.value = true

  author.img = songDetails.value.data.artist.cover
  author.name = songDetails.value.data.artist.name
  author.tags = songDetails.value.data.identify.imageDesc
  author.description = songDetails.value.data.artist.briefDesc
  author.trackSong = songDetails.value.data.artist.musicSize
  author.mvCount = songDetails.value.data.artist.mvSize
})
</script>

<style  lang="less" scoped>
.load {
  display: flex;
}
.song-details {
  padding-left: 40px;
  display: flex;

  .song-ing {
    width: 180px;
    height: 180px;

    border-radius: 10px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .details {
    flex: 1;
    height: 200px;
    margin-left: 20px;
    .introduction {
      width: 800px;

      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .song-single {
      margin-right: 10px;
      font-size: 14px;
      color: #db2c1d;
      border: 1px solid #db2c1d;
    }
    .song-name {
      font-size: 18px;
      font-weight: 700;
    }

    .author-state {
      display: flex;

      margin: 10px 0;
      line-height: 20px;
      .author-img {
        display: inline-block;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          vertical-align: middle;
        }
      }
      .author-name {
        color: #db2c1d;
      }
      .author-name,
      .establish-date {
        font-size: 12px;
        margin: 0 0 0 10px;
        line-height: 30px;
      }
    }
    .icon-data {
      display: flex;
      div {
        cursor: pointer;
        margin: 0 10px;
        width: 100px;
        height: 30px;
        border: 1px solid #ccc;
        background-color: #db2c1d;
        border-radius: 20px;
        color: #fff;
        line-height: 30px;
        text-align: center;
        span {
          font-size: 13px;
          text-align: center;
        }
      }

      div:first-child {
        margin-left: 0;
      }
      div:nth-child(2),
      div:nth-child(3) {
        background-color: #fff !important;
        color: #000;
      }
    }
    .sketch {
      margin: 10px 0;
      font-size: 14px;
      div {
        margin-bottom: 3px;
      }
    }
  }
}
</style>
