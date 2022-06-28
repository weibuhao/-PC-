<template>
  <div class="play">
    <div class="bottom-play">
      <div class="img-box">
        <img v-if="songShow" src="@/assets/images/test.logo.jpg" alt="" />
        <img v-else :src="playImg.picUrl" alt="" @click="playBox" />
      </div>

      <div class="song-title">
        <p v-if="songShow">歌曲</p>
        <p v-else>{{ playDetails.name }}</p>
        <span v-if="songShow">歌手</span>
        <span v-else
          ><p v-for="(item, index) in playDetails.ar.length > 2 ? (playDetails.ar.length = 2) : playDetails.ar" :key="index">{{ item.name }}</p></span
        >
      </div>
      <div class="demo-block">
        <div class="music">
          <el-tooltip class="box-item" effect="dark" :content="prompt" placement="top">
            <span class="loop" @click="switchLoop">
              <span class="iconfont icon-24gl-repeat2" v-if="loop === 0"></span>
              <span class="iconfont icon-24gl-repeatOnce2" v-else-if="loop === 1"></span>
              <span class="iconfont icon-24gl-shuffle" v-else-if="loop === 2"></span>
            </span>
          </el-tooltip>

          <span class="iconfont icon-zuobofang" @click="previousSong"></span>
          <span class="switch-play" @click="switchPlay"><span class="iconfont icon-bofang" v-if="playValue"></span> <span class="iconfont icon-BasicIcons-all-" v-else></span></span>
          <span class="iconfont icon-youbofang" @click="nextSong"></span>
          <el-tooltip class="box-item" effect="dark" :content="likeValue" placement="top">
            <span class="iconfont icon-shoucang" :class="{ red: like }" @click="switchLike"></span>
          </el-tooltip>
        </div>
        <span class="song-date">{{ getMinute2(start) === 0 + ':' + 0 ? '0:00' : getMinute2(start) }}</span>
        <el-slider v-model="playSlide" class="slider" :show-tooltip="false" :disabled="disable" @change="playchange" @click.stop="playchange" />
        <span class="song-date">{{ getMinute2(duration) === 0 + ':' + 0 || getMinute2(duration) === NaN + ':' + NaN ? '0:00' : getMinute2(duration) }}</span>
      </div>
      <div class="volume">
        <span class="iconfont icon-24gl-volumeLow" v-if="Volume" @click="switchVolume"></span>
        <span class="iconfont icon-24gl-volumeDisable" v-else @click="switchVolume"></span>
        <el-slider v-model="volume" class="volume-slide" @change="volumeChange" @click="volumeChange" />
      </div>
      <audio ref="audioRef" @ended="playEnd" @play="play" :src="`https://music.163.com/song/media/outer/url?id=${playId}.mp3`"></audio>
    </div>

    <transition name="el-zoom-in-bottom">
      <div v-show="Playshow" class="play-box">
        <img :src="playImg.picUrl" class="background" alt="" />
        <div class="content-box">
          <div class="Mask"></div>
          <span @click="Playshow = false"><span class="iconfont icon-xiangzuojiantou"></span></span>
          <div class="song_title">
            <p>{{ playDetails.name }}</p>
            <i v-for="(item, index) in playDetails.ar" :key="index">{{ item.name }}</i>
          </div>
          <div class="paly_content">

            <div class="play_img_box">
              <div class="play_img">
                <div>
                  <img :src="playImg.picUrl" alt="" />
                </div>
              </div>
            </div>
            <div class="play_lyric">
              <!-- <div class="Mask"></div> -->
              <p v-for="item in lyriccom" :key="item" :title="JSON.stringify(item)" :class="{ ations: currentPlayTime * 1000 >= item.time - 500 && currentPlayTime * 1000 < item.pre - 500 }">{{ item.lrc }}
              </p>
            </div>
          </div>
        </div>

        <div class="bottom-play bottom_color">
          <div class="demo-block demo_box">
            <div class="music music_icon">
              <el-tooltip class="box-item" effect="dark" :content="prompt" placement="top">
                <span class="loop" @click="switchLoop">
                  <span class="iconfont icon-24gl-repeat2" v-if="loop === 0"></span>
                  <span class="iconfont icon-24gl-repeatOnce2" v-else-if="loop === 1"></span>
                  <span class="iconfont icon-24gl-shuffle" v-else-if="loop === 2"></span>
                </span>
              </el-tooltip>

              <span class="iconfont icon-zuobofang" @click="previousSong"></span>
              <span class="switch-play" @click="switchPlay"><span class="iconfont icon-bofang" v-if="playValue"></span> <span class="iconfont icon-BasicIcons-all-" v-else></span></span>
              <span class="iconfont icon-youbofang" @click="nextSong"></span>
              <el-tooltip class="box-item" effect="dark" :content="likeValue" placement="top">
                <span class="iconfont icon-shoucang" :class="{ red: like }" @click="switchLike"></span>
              </el-tooltip>
            </div>
            <span class="song-date">{{ getMinute2(start) === 0 + ':' + 0 ? '0:00' : getMinute2(start) }}</span>
            <el-slider v-model="playSlide" class="slider slider_length" :show-tooltip="false" :disabled="disable" @change="playchange" @click.stop="playchange" />
            <span class="song-date">{{ getMinute2(duration) === 0 + ':' + 0 || getMinute2(duration) === NaN + ':' + NaN ? '0:00' : getMinute2(duration) }}</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
// import playClone from './playClone.vue'
// 发起请求
import { getSongDataAPI, getLyricAPI } from '@/api/index'
// 导入vuex
import store from '@/store/index'
// 转换分钟
import { getMinute2 } from '@/utils/date'
// el组件
import { ElNotification } from 'element-plus'
// 兄弟传值
import bus from '@/utils/Bus.js'
import { computed, reactive, ref, watch, onMounted } from 'vue'

const playBox = () => {
  Playshow.value = true
}
const Playshow = ref(false)
// 播放进度条的初始值
const playSlide = ref(0)
// 音量的初始值
const volume = ref(100)
// 歌曲id
const playId = ref(1934251776)

// 歌曲数据
const playData = ref()
const playDetails = ref({})
const playImg = ref({})
const songShow = ref(true)

// 循环按钮的切换
const loop = ref(0)
const prompt = ref('循环播放')
const switchLoop = () => {
  if (loop.value > 1) {
    loop.value = 0
  } else {
    loop.value++
  }
  if (loop.value === 0) {
    prompt.value = '循环播放'
  } else if (loop.value === 1) {
    prompt.value = '单曲循环'
    audioRef.value.loop = true
  } else {
    prompt.value = '随机播放'
  }
}

// 进度条
const progress = (val) => (val / 100) * 1000

const audioRef = ref()
const duration = ref(0)

// 播放按钮切换
const playValue = ref(true)
const switchPlay = () => {
  playValue.value = !playValue.value
}

let time = null
let starTime = null

const times = []
const starTimes = []

// 定时器
const timers = () => {
  disable.value = false
  playValue.value = false
  time = setInterval(() => {
    playSlide.value++
  }, progress(duration.value)) // 定时器
  times.push(time)
  starTime = setInterval(() => {
    // 定时器
    start.value++
    if (start.value >= duration.value) {
      eliminateTime()
      start.value = 0
      playSlide.value = 0
    }
  }, 1000)
  starTimes.push(starTime)
}

// 清除定时器
const eliminateTime = () => {
  times.forEach((value) => {
    clearInterval(value)
  })
  starTimes.forEach((value) => {
    clearInterval(value)
  })
}
eliminateTime()
// 当音乐播放时开始时长
const start = ref(0)
// 当音乐播放时触发
const play = () => {
  store.dispatch('getLatelyPlay', playId.value)
  bus.emit('start', false)
}

let nexTime = null
// 播放结束
const playEnd = () => {
  start.value = 0
  playSlide.value = 0
  eliminateTime()
  playValue.value = true
  nexTime = setTimeout(() => {
    nextSong()
  }, 0)
  const lyricBox = document.querySelector('.play_lyric')
  lyricBox.scrollTo({ top: 0, behavior: 'smooth' })
}

// 改变播放进度条
const playchange = () => {
  const currentTime = playSlide.value * (Math.round(duration.value) / 100)
  audioRef.value.currentTime = currentTime
  start.value = currentTime
}
const disable = ref(true)

// 喜欢按键
const like = ref(false)
const likeValue = ref('添加喜欢')
const switchLike = () => {
  like.value = !like.value
  if (like.value) {
    likeValue.value = '我喜欢'
  } else {
    likeValue.value = '我不喜欢'
  }
}

const throttle = ref(true)
// 下一首切换
const nextSong = () => {
  if (throttle.value) {
    like.value = false
    bus.emit('current', { play: store.state.playId, index: store.state.songIndex + 1 })
    store.dispatch('getNextPlayID')
    clearTimeout(nexTime)
  }
  throttle.value = false
}
// 上一首切换
const previousSong = () => {
  if (throttle.value) {
    like.value = false
    bus.emit('current', { play: playId.value, index: store.state.songIndex - 1 })
    store.dispatch('getPreviousSongID')
  }
  throttle.value = false
}

// 音量
const Volume = ref(true)
const switchVolume = () => {
  Volume.value = !Volume.value
  if (Volume.value === false) {
    volume.value = 0
  } else {
    volume.value = newVolume.value
  }
}

const newVolume = ref(100)

const volumeChange = () => {
  newVolume.value = volume.value
}

bus.on('stop', (val) => {
  playValue.value = val
})

watch(
  () => [volume.value, playValue.value],
  async() => {
    // 判断是否结束暂停
    if (playValue.value) {
      eliminateTime()
      audioRef.value.pause()
    } else {
      eliminateTime()
      // 请求歌曲数据
      const { data: res } = await getSongDataAPI(playId.value)
      // if (res.songs[0].fee === 1) {
      //   setTimeout(() => nextSong(), 100)
      // } else
      {
        playData.value = res.songs
        duration.value = res.songs[0].dt / 1000
        playDetails.value = playData.value[0]
        songShow.value = false
        playImg.value = playDetails.value.al

        store.dispatch('getCurrentPlayID', playId.value)
        const { data: res2 } = await getLyricAPI(playId.value)
        lyricList.value = res2.lrc.lyric
      }
      throttle.value = true

      audioRef.value.play()
      timers()
    }
    audioRef.value.volume = volume.value / 100
  }
)

const currentPlayTime = ref()
watch(
  () => start.value,
  () => {
    currentPlayTime.value = audioRef.value.currentTime
    // 判断进度条是否禁用
    if (start.value === 0) {
      disable.value = true
    } else {
      disable.value = false
    }
    if (start.value === 0 && loop.value === 1 && playValue.value === false) {
      eliminateTime()
      timers()
    }
  },
  {
    deep: true
  }
)

// 歌词
const lyricList = reactive({})

let timing = null
watch(
  () => store.state.playId,
  async() => {
    playValue.value = true
    clearImmediate(timing)
    playId.value = store.state.playId
    // eliminateTime()
    timing = setTimeout(() => {
      playValue.value = false
      // eliminateTime()
      playSlide.value = 0
      start.value = 0
    }, -500)

    const { data: res } = await getSongDataAPI(playId.value)
    if (res.songs[0].fee === 1) {
      playValue.value = true
      nextSong()
      ElNotification({
        title: '播放',
        message: '当前歌曲需要会员，为你播放下一首',
        type: 'warning'
      })
    }
    // 歌词请求
    const { data: res2 } = await getLyricAPI(playId.value)
    lyricList.value = res2.lrc.lyric
  },
  {
    deep: true
  }
)

// 侦听音乐播放变化 改变歌词位置
watch(
  () => currentPlayTime.value,
  () => {
    const p = document.querySelector('.ations')
    if (p !== null) {
      const time = JSON.parse(p.title)
      const playTime = Number(currentPlayTime.value.toFixed(0))
      if (playTime === Number((time.pre / 1000).toFixed(0))) {
        const lyricBox = document.querySelector('.play_lyric')
        lyricBox.scrollTo({ top: p.offsetTop - 100, behavior: 'smooth' })
      }
    }
  }
)

// 将歌词解构
const lyriccom = computed(() => {
  let arr
  if (lyricList.value) {
    arr = lyricList.value.split(/[(\r\n)\r\n]+/).map((item, i) => {
      const min = item.slice(1, 3)
      const sec = item.slice(4, 6)
      let mill = item.slice(7, 10)
      let lrc = item.slice(11, item.length)
      let time = parseInt(min) * 60 * 1000 + parseInt(sec) * 1000 + parseInt(mill)
      if (isNaN(Number(mill))) {
        mill = item.slice(7, 9)
        lrc = item.slice(10, item.length)
        time = parseInt(min) * 60 * 1000 + parseInt(sec) * 1000 + parseInt(mill)
      }
      return { min, sec, mill, lrc, time }
    })
    arr.forEach((val, index, array) => {
      if (index === array.length - 1 || isNaN(array[index + 1].time)) {
        val.pre = 10000000000000000
      } else {
        val.pre = array[index + 1].time
      }
    })
  }
  return arr
})

onMounted(() => {
  if (localStorage.getItem('lateyPlay') === null) {
    localStorage.setItem('lateyPlay', JSON.stringify([]))
  }
})

</script>

<style lang="less" scoped>
.ations {
  font-size: 20px !important;
  color: #db2c1d !important;
}
.red {
  color: red;
}

.icon-shoucang {
  font-size: 18px !important;
}
.bottom-play {
  position: fixed;
  z-index: 10;
  left: 0;
  bottom: 0;
  display: flex;
  width: 100%;
  height: 55px;
  background-color: #f6f6f1;

  .img-box {
    margin: 2.5px 0 0 80px;
    border-radius: 10px;
    overflow: hidden;
    img {
      width: 50px;
      vertical-align: middle;
      cursor: pointer;
    }
  }
}

.song-title {
  width: 230px;
  padding-right: 20px;
  margin: 0 10px 0 20px;

  p {
    margin: 10px 3px 0 0;
    font-size: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  span {
    width: 50px;
    font-size: 14px;
    color: #a7a7a8;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    p {
      float: left;
      overflow: hidden;
      font-size: 12px;
      padding: 0;
      margin: 0 5px 0 0;
    }
  }
}

.demo-block {
  position: relative;
  display: flex;
  line-height: 78px;

  .music {
    position: absolute;
    top: -20px;
    left: -12px;
    .loop,
    .switch-play {
      width: 30px !important;
      margin: 0;
      span {
        margin: 48px;
        font-size: 20px;
      }
    }
    span {
      cursor: pointer;
      margin: 48px;
      font-size: 20px;
    }
  }
}
.volume {
  position: relative;
  flex: 1;
  span {
    position: absolute;
    top: 24px;
    left: 125px;
    font-size: 25px;
  }
}
.el-slider {
  margin-top: 0;
  margin-left: 12px;
  height: var(3px) !important;
}
.slider {
  margin: 0 20px 0 15px;
  position: relative;
  top: 24px;
  width: 460px;
}
/deep/.el-slider__bar {
  background-color: red;
  height: 3px;
}
/deep/.el-slider__runway {
  height: 3px;
}
/deep/.el-slider__button {
  border: 1px solid red;
  width: 8px;
  height: 8px;
}
/deep/.el-slider__button-wrapper {
  width: 0;
  height: 0;
  top: -8px;
}
.volume-slide {
  width: 100px;
  margin: 20px 0 0 150px;
}

.icon-24gl-repeat2:hover,
.icon-24gl-repeatOnce2:hover,
.icon-24gl-shuffle:hover,
.icon-zuobofang:hover,
.icon-bofang:hover,
.icon-BasicIcons-all-:hover,
.icon-youbofang:hover,
.icon-24gl-volumeLow:hover,
.icon-24gl-volumeDisable:hover {
  color: red;
}
.song-date {
  font-size: 16px;
  cursor: default;
}
.icon-24gl-volumeLow,
.icon-24gl-volumeDisable {
  cursor: pointer;
}

//播放界面
.play-box {
  position: fixed;
  top: 0;
  width: 105%;
  height: 100%;
  // margin-left:-20px ;
  // transform: translateX(5% 0);
  z-index: 9999999;

  .icon-xiangzuojiantou {
    cursor: pointer;
    display: block;
    font-size: 25px;
    width: 80px;
    margin: 15px 20px 0;
    transform: rotateX(45deg);
  }
  .icon-xiangzuojiantou:hover {
    color: #fff;
  }

  .background {
    vertical-align: middle;
    width: 100%;
    transform: translate(-1%, -50%);
    filter: blur(10px);
  }
  .content-box {
    position: absolute;
    .Mask{
     position:absolute ;
    top:175px;
    right: 220px;
    z-index: 999999;
     width: 460px;
     height: 410px;
    }
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .song_title {
    text-align: center;
    width: 100%;
    height: 100px;
    margin-top: 50px;
    p {
      margin: 15px 0 10px 0;
      font-size: 25px;
      color: #fff;
    }
    i {
      display: inline-block;
      padding: 5px;
      color: #fff;
      font-size: 16px;
      font-weight: 400;
    }
  }
  .paly_content {
    display: flex;
    width: 1000px;
    margin: 0 auto;
    height: 600px;

    .play_img_box {
      flex: 1;

      .play_img {
        margin: 40px auto;
        width: 300px;
        height: 350px;

        div:first-child {
          width: 300px;
          height: 300px;
          border-radius: 20px;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .play_lyric {
      position: relative;
      flex: 1;
      display: flex;
      text-align: center;
      flex-direction: column;
      padding: 50px 0 50px 0;
      height: 265px;
      overflow: scroll;

      p {

        margin: 5px 0;
        color: #ccc;
        font-size: 16px;

      }

      .Mask {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
    }
  }
  .play_lyric::-webkit-scrollbar {
    display: none;
  }
}

.bottom_color {
  background-color: transparent;
}

.slider_length {
  width: 1130px;

  /deep/.el-slider__runway {
    height: 2px;
  }
  /deep/.el-slider__bar {
    height: 2px !important;
  }
  /deep/.el-slider__button {
    border: 0;
    width: 0;
    height: 0;
  }
}

.music_icon {
  left: 350px !important;
}

.demo_box {
  margin: 0 60px;
}
</style>
