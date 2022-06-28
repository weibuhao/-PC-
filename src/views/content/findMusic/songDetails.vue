<template>
  <div v-if="loadShow">
    <div class="song-details" >
      <div class="song-ing">
        <img :src="songDetails.coverImgUrl" alt="" />
        </div>
      <div class="details">
        <span class="song-single">歌单</span>
        <span class="song-name">{{songDetails.name}}</span>
        <div class="author-state">
          <span class="author-img"><img :src="author.img" alt="" /></span><span class="author-name">{{author.name}}</span><span class="establish-date">{{Dayjs(author.date).format('YYYY-MM-DD')}}</span>
        </div>
        <div class="icon-data">
          <div><span class="iconfont icon-kaishi" @click="playOne" >播放全部</span></div>
          <div><span class="iconfont icon-shoucang">收藏({{author.subscribedCount}})</span></div>
          <div><span class="iconfont icon-fenxiang">分享({{author.shareCount}})</span></div>
          <div><span class="iconfont icon-cha">加载完整歌单</span></div>
        </div>
        <div class="sketch">
          <div>标签：{{author.tags[0]}} {{author.tags[1]}} {{author.tags[2]}}</div>
          <div>歌曲：{{author.trackSong}}  播放：{{computedQuantity(author.playCount)}}</div>
          <div class="introduction">简介：{{author.description}}</div>
        </div>
      </div>
    </div>
    <div class="top-nav">
      <el-tabs v-model="activeName" class="demo-tabs"  >
      <!-- @tab-click="handleClick" -->
        <el-tab-pane label="歌曲列表" name="first">
          <SongList :songNumber="author.trackSong"></SongList>
          </el-tab-pane>
      </el-tabs>
    </div>

  </div>
  <div class="load" v-else>
<el-skeleton style="width: 240px">
    <template #template>
      <el-skeleton-item variant="image" style="width: 180px; height: 180px ;margin:0 50px 0 40px" />
      <div style="padding: 14px">
        <div
          style="
            display: flex;
            align-items: center;
            justify-items: space-between;
          "
        >
        </div>
      </div>
    </template>
  </el-skeleton>
  <el-skeleton :rows="5" animated />
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import bus from '@/utils/Bus'
import { getSongSingAPI } from '@/api/index'
import SongList from '@/views/content/findMusic/songList/SongList.vue'
import { Dayjs } from '@/utils/date'

const route = useRoute()
const loadShow = ref(false)
const activeName = 'first'
const songDetails = ref({})
const author = reactive({
  img: '',
  name: '',
  date: '',
  tags: [],
  playCount: 0,
  trackSong: 0,
  description: '',
  subscribedCount: 0,
  shareCount: 0
})

const playOne = () => {
  bus.emit('playOne')
}

const computedQuantity = (num) => {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(1) + '亿'
  } else if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
}

onMounted(async() => {
  document.documentElement.scrollTop = 0
  const id = route.query.id
  const { data: res } = await getSongSingAPI(id)
  songDetails.value = res.playlist
  loadShow.value = true

  author.img = songDetails._rawValue.creator.avatarUrl
  author.name = songDetails._rawValue.creator.nickname
  author.tags = songDetails._rawValue.tags
  author.playCount = songDetails._rawValue.playCount
  author.trackSong = songDetails._rawValue.trackIds.length
  author.date = songDetails._rawValue.updateTime
  author.description = songDetails._rawValue.description
  author.subscribedCount = songDetails._rawValue.subscribedCount
  author.shareCount = songDetails._rawValue.shareCount
})
</script>

<style  lang="less" scoped>
.load{
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
.introduction{
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
