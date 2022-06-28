<template>
   <div>
     <div class="top-song">
       <el-image class="background" lazy :src="background" alt="" />
       <div class="song-cover">
        <div class="cover-img">
           <el-image :src="background" lazy alt=""/>
        </div>
        <div class="introduce">
          <div><i class="fi fi-day-haze"></i>   精品歌单</div>
          <p>{{soetName}}   ||    {{introduce}}</p>
        </div>
       </div>
     </div>
     <div class="newSongSing"><span class="top-title">{{soetName}}<span class="iconfont icon-xiangyoujiantou"></span></span>
     <div class="sort"><span ref="sortRef" v-for="(item,index) in sortSong.value" :key="index"  :class="{current:item.name==='华语'}"  @click="current(item,index)"  >{{item.name}}</span></div>
     </div>
    <SongListBox :RecommendSong="hotSongSing"></SongListBox>

    <div>
      <el-backtop :right="0" :bottom="100" class="go_top" />
    </div>
   </div>
</template>

<script setup>
import SongListBox from '@/views/content/findMusic/Recommend/SongListBox'
import store from '@/store/index'
import { getHotSongSingAPI, getSortSongSingAPI } from '@/api/index'
import { nextTick, reactive, ref, watch, onBeforeUnmount, onActivated, onDeactivated } from 'vue'

// 歌单数据
const hotSongSing = reactive([])

// 当前的span的DOM
const sortRef = ref()

// 歌单分类
const sortSong = reactive([])

// 歌单分类名
const soetName = ref('华语')

const currentVal = reactive({
  name: '',
  index: 0
})

// 点击发起请求
const current = async(item, index) => {
  currentVal.name = item.name
  currentVal.index = index
  // sessionStorage.setItem('sortName', JSON.stringify(currentVal))

  // 点击发起请求
  const { data: res } = await getHotSongSingAPI(item.name)
  hotSongSing.value = res.playlists
  soetName.value = item.name

  nextTick(() => {
    if (sortRef.value === undefined) return
    sortRef.value.forEach((value) => {
      value.className = ''
    })
    // 变色
    sortRef._rawValue[index].className = 'current'
  }, 0)
  background.value = hotSongSing.value[0].coverImgUrl
}

const introduce = ref('热门歌单 畅听所欲')
watch(() => soetName.value,
  () => {
    if (soetName.value === '华语') {
      introduce.value = '华语才是顶流 '
    } else if (soetName.value === '流行') {
      introduce.value = '跟着时代的脚步 追寻诗和远方 '
    } else if (soetName.value === '摇滚') {
      introduce.value = '做一个狂魔的人 用实力征服 '
    } else if (soetName.value === '民谣') {
      introduce.value = '富于民族色彩歌曲 不忘出处'
    } else if (soetName.value === '电子') {
      introduce.value = '电子乐器音色所创造的音乐，都可属之'
    } else if (soetName.value === '另类/独立') {
      introduce.value = '韩国独立音乐|正确的打开方式'
    } else if (soetName.value === '轻音乐') {
      introduce.value = '放松自己 享受时光'
    } else if (soetName.value === '综艺') {
      introduce.value = '快乐奏乐'
    } else if (soetName.value === '影视原声') {
      introduce.value = '画语人生 艺术的自我修养'
    } else if (soetName.value === 'AGG') {
      introduce.value = '二次元世界 走进不一样的世界'
    }
  }
)

const scrollTop = () => {
  store.commit('SCROLL', document.documentElement.scrollTop)
}

onActivated(async() => {
  // centerVal = JSON.parse(sessionStorage.getItem('sortName'))
  const scrollVal = store.state.scrollTop
  document.addEventListener('scroll', scrollTop)
  // if (centerVal !== null) {
  //   document.documentElement.scrollTop = scrollVal
  //   current(centerVal, centerVal.index)
  // }
  document.documentElement.scrollTop = scrollVal

  const { data: res } = await getHotSongSingAPI()
  hotSongSing.value = res.playlists
  const { data: res2 } = await getSortSongSingAPI()
  sortSong.value = res2.tags
  background.value = hotSongSing.value[0].coverImgUrl
})

onDeactivated(() => {
  document.removeEventListener('scroll', scrollTop)
})

onBeforeUnmount(() => {
  document.removeEventListener('scroll', scrollTop)
})

const background = ref()
// let centerVal = ''

</script>

<style scoped lang="less">
.go_top{
   right: 20px !important;
   color: #db2c1d;
}
.current{
  background-color: #f5f7fa;
  color:  #db2c1d;
}

.top-song{
  position: relative;
  height: 200px;
  margin-bottom:20px ;
  border-radius: 15px;
  overflow: hidden;

  .background{
    transform: translate(0,-50%);
    width: 100%;
    vertical-align: middle;
    filter: blur(8px);
  }

  .song-cover{
    position: absolute;
    top:0;
  width: 100%;
  height: 100%;

  .cover-img{
    overflow: hidden;
   width: 160px;
   height: 160px;
   margin:20px 28px ;
   border-radius: 10px;

   img{
     width: 100%;
     vertical-align: middle;
   }
  }
  }

.introduce{
  position: absolute;
  top: 80px;
  left:210px;
  div{

    width:100px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    font-size: 14px;
    border: 1px solid #e7aa5a;
    border-radius: 15px;
    color:#e7aa5a;
  }
  p{margin: 5px 10px 0;
    font-size: 14px;
    color: #fff;
  }
}
}

.newSongSing{
  padding: 0 25px;
  display: flex;
  height: 30px;
  line-height: 30px;
  .top-title{
    width: 80px;
    text-align: center;
   border-radius: 40px;
  border: 1px solid #ccc;
  }

  .sort{
    flex: 1;
    padding: 4px 0;
    margin-left:350px ;

    span{
      cursor: pointer;
      float: left;
      font-size: 12px;
      padding: 0 8px;
      text-align: center;
      line-height: 22px;
      margin: 0 10px;
      border-radius:12px ;

    }
  }
}

</style>
