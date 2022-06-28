<template>
  <div class="ranking_list">
    <p>官方榜</p>
    <div class="official_list" v-for="(item, index) in list" :key="index">
      <div class="official_img">
         <div class="play_but"  ><span class="iconfont icon-kaishi"></span></div>

        <el-image :src="item.coverImgUrl" alt="" lazy="true" @click="goDetails(item.id)" />
      </div>
      <div class="songs">
        <div v-for="(obj, index) in Songslist[index]" :key="index" @dblclick="play(obj, index, item.id)">
          <span :class="{ red: index <= 2 }">{{ index + 1 }}</span
          ><span>{{ obj.name }}</span>
          <span
            ><p v-for="item in obj.ar" :key="item">{{ item.name }}</p></span
          ><span>{{ getMinute(obj.dt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getRankingListAPI, getSongSingListAPI } from '@/api/index'
import { getMinute } from '@/utils/date'
import store from '@/store'
import bus from '@/utils/Bus'
import { useRouter } from 'vue-router'
import { onMounted, reactive } from 'vue'

const router = useRouter()

const list = reactive([])
const Songslist = reactive([])

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
const goDetails = (id) => {
  router.push({ path: '/song/details', query: { id: id } })
}

const play = (item, index, id) => {
  // 排他思想
  const play = item.id
  store.commit('IDUPDATE', play)
  store.commit('GETINDEX', index)
  store.dispatch('getsong', id)
}

onMounted(async() => {
  const { data: res } = await getRankingListAPI()
  for (let i = 0; i < 4; i++) {
    list.push(res.list[i])
  }

  list.forEach(async(value, index, array) => {
    const { data: res } = await getSongSingListAPI(value.id, null, 5)
    Songslist.push(res.songs)
  })
})
</script>

<style lang="less" scoped>
.red {
  color: red;
}
.ranking_list {
  margin-left: 30px;

  p:nth-child(1) {
    font-size: 18px;
    font-weight: 700;
    margin: 0;
  }

  .official_list {
    cursor: pointer;
    display: flex;
    margin: 15px 0;

    .official_img {
      position: relative;
      width: 160px;
      height: 160px;
      border-radius: 10px;
      overflow: hidden;

      img {
        width: 100%;
      }

      .play_but{
     position: absolute;
     width: 30px;
     height: 30px;
     right: 10px;
     bottom: 10px;
     background-color:#fff;
     text-align: center;
     line-height: 30px;
     border-radius: 100%;
     opacity: 0;
     z-index: 3;
transition: all 0.8s;
     .icon-kaishi{
color:#db2c1d;
     }
    }

 &:hover .play_but{
      opacity: 1;
    }
    }
    .songs {
      display: flex;
      flex-direction: column;
      flex: 1;
      height: 160px;
      line-height: 160px;
      margin: 0 30px;

      div {
        font-size: 14px;
        color: #606266;
        display: flex;
        height: 20%;
        line-height: 32px;

        span:nth-child(1) {
          text-align: center;
          width: 30px !important;
        }
        span:nth-child(2) {
          width: 300px;
          margin: 0 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        span:nth-child(3) {
          width: 300px;
          margin: 0 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          p {
            font-weight: 400;
            float: left;
            font-size: 12px;
            margin: 0 10px;
          }
        }
        span:nth-child(4) {
          flex: 1;
        }
      }

      div:hover {
        background-color: #f5f7fa;
      }
    }
  }
}
</style>
