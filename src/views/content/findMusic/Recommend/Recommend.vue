<template>
  <div>
    <el-carousel :interval="4000" type="card" height="200px"  ref="carousel">
    <el-carousel-item v-for="item in focusImg.value" :key="item.targetId"  >
      <div class="focus">
        <img :src="item.imageUrl" alt="" >
       </div>
    </el-carousel-item>
  </el-carousel>
  <div>
    <span class="songList" @click="songList">推荐歌单</span><span class="iconfont icon-you"></span>
    <SongListBox :RecommendSong="RecommendSong" ></SongListBox>
  </div>
  </div>
</template>

<script setup>
import SongListBox from './SongListBox.vue'
// 调用接口获取轮播图
import { getFocusImgAPI, getRecommendSongAPI } from '@/api/index'
import { defineEmits, onBeforeMount, reactive, ref, onMounted } from 'vue'
const emit = defineEmits()
const songList = () => {
  emit('songList', 'second')
}
// 轮播图
const focusImg = reactive([''])
const carousel = ref()
onMounted(() => {
  setTimeout(() => {
    carousel.value.setActiveItem(0)
  }, 0)
})

// 推荐歌单
const RecommendSong = reactive([])
onBeforeMount(async() => {
  const { data: res } = await getFocusImgAPI()
  focusImg.value = res.banners
  const { data: res2 } = await getRecommendSongAPI()
  RecommendSong.value = res2.result
})

</script>

<style lang="less" scoped>
  .focus{
    width: 500px;
    height: 200px;
    border-radius: 10px;
    overflow: hidden;

    img{
        vertical-align: middle;
 width: 100%;
height: 100%;
    }

  }
  .songList{
    margin-right:5px ;
    font-size: 18px;
     font-weight: 700;
     cursor: pointer;
  }

</style>
