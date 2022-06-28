<template>
  <div>
   <div class="mv"><span class="iconfont icon-xiangzuojiantou" @click="router.back()"><i>{{data.name}}</i></span><span class="mv_relevant">相关推荐</span></div>
   <div class="mv_content">
   <div class="mv_box">
    <video :src="mvUrl" autoplay controls @play="playMv" ref="mvRef" ></video>
    <div class="mv_details">
    <div class="mv_author"><div class="mv_img"><img :src="data.artistImg" alt=""></div><span class="author_name">{{data.artistName}}</span><div class="like"><i class="iconfont icon-tuijian"><span>点赞({{data.good}})</span></i> <i class="iconfont icon-cha"><span>收藏({{data.subCount }})</span></i> <i class="iconfont icon-fenxiang"><span>分享({{data.shareCount}})</span></i></div></div>
    <div class="release_date"><span>发布时间 ：{{data.publishTime}}</span><span>播放次数：{{(data.playCount/10000).toFixed(0)}}万</span></div>
    </div>
   </div>
   <div class="similarity_mv">
    <div class="similarity_mv_content">
     <div class="similarity_box" @click="similarPlayMv(item.id)" v-for="(item,index) in  similarMv.list" :key="index"><div class="similarity_img"><el-image :src="item.cover" alt="" lazy /></div><div class="details">
      <p>{{item.name}}</p>
      <p>{{item.artists[0].name}}</p>
     </div></div>

    </div>
   </div>
   </div>
  </div>
</template>

<script setup>
import { getMvPlayAPI, getMvDetailsAPI, getSingerDetailsAPI, getSimilarMvsAPI } from '@/api/index'
import { onMounted, reactive, ref, watch } from 'vue'
import bus from '@/utils/Bus'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const mvUrl = ref()
const data = reactive({})
const mvData = reactive({})
const similarMv = reactive({})

const mvRef = ref()

const similarPlayMv = (id) => {
  router.push({ path: '/mv/details', query: { mvId: id } })
}

const playMv = () => {
  bus.emit('stop', true)
}

bus.on('start', (val) => {
  if (mvRef.value === null) return
  mvRef.value.pause()
})

const grtData = async() => {
  const { data: res } = await getMvPlayAPI(route.query.mvId)
  if (res.data === undefined) return
  mvUrl.value = res.data.url
  const { data: res2 } = await getMvDetailsAPI(route.query.mvId)
  const { data: res3 } = await getSingerDetailsAPI(res2.data.artistId)
  const { data: res4 } = await getSimilarMvsAPI(route.query.mvId)
  similarMv.list = res4.mvs
  console.log(res2)
  mvData.value = res2.data
  data.name = mvData.value.name
  data.artistName = mvData.value.artistName
  data.publishTime = mvData.value.publishTime
  data.playCount = mvData.value.playCount
  data.subCount = mvData.value.subCount
  data.shareCount = mvData.value.shareCount
  data.good = mvData.value.subCount + mvData.value.shareCount
  data.artistImg = res3.data.artist.cover
}
onMounted(() => {
  grtData()
})

watch(() => route.query.mvId,
  () => grtData()
)
</script>

<style lang="less" scoped>
.mv{

  .icon-xiangzuojiantou{
    cursor: pointer;
   i{
    font-weight: 700;
   }
  }
  .mv_relevant{
    font-size: 14px;
    font-weight: 700;
   float: right;
   margin-right:365px ;
  }
}
.mv_content{
  cursor: pointer;
  display: flex;
  margin-top: 10px ;
  .mv_box{
    display: flex;
  flex-direction: column;
   width: 700px;
   height: 430px;
   video{
    width: 100%;
    height: 400px;
   }

   .mv_details{
    // display: flex;
   flex: 1;
.mv_author{
  display: flex;

   .mv_img{
    width: 60px;
    height: 60px;
    margin: 10px;
    overflow: hidden;
    border-radius: 100%;

    img{
      width: 128%;
      transform: translate(-7px,0);
      vertical-align:middle;
    }
   }
   .author_name{
    font-size: 14px;
    color: #000;
     line-height: 80px;
   }
.like{
  display: flex;
  // line-height: 80px;
  margin-left: 140px;
 i{
  width: 96px;
  margin: 25px 10px 0 10px;
  padding: 0 10px;
  text-align: center;
    line-height: 28px;
    height: 28px;
    font-size: 16px;
    border-radius: 20px;
    border: 1px solid #ccc;
// &:nth-child(1){
//       font-size: 2px;
//     }
    &:nth-child(2){
      font-size: 20px;
    }
   }
   span{
    font-size: 12px;
    margin-left: 5px;
   }
}

   }
   }
  }

  .release_date{
display: flex;

span{
  font-size: 12px;
  color: #ccc;
  &:nth-child(1){
    margin-right: 15px;
  }
}
}
 .similarity_mv{
flex: 1;
padding: 0 15px;

.similarity_mv_content{
display: flex;
flex-direction: column;
width: 300px;
height: 385px;

.similarity_box{
  display: flex;
  flex: 1;
  .similarity_img{
   width: 123px;
   margin:0 10px 10px 0;
   overflow: hidden;
   border-radius: 5px 5px 10px 10px ;
   img{
    width: 100%;
   }
  }
  .details{
    p{
      width: 130px;
      font-size: 14px;
      margin: 10px 0 0 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &:nth-child(2){
        color: #ccc;
        font-size: 12px;
      }
    }
  }
}
}
 }
}
</style>
