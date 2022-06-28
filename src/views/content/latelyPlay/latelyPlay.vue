<template>
  <div class="lately_play">
    <h1> <span class="iconfont icon-yinle"></span > 最近播放<span class='song_count'>共{{lateyPlay.length||count}}首歌曲</span></h1>
    <div class="play_but"><span class="iconfont icon-kaishi"  @click="playOne">播放全部</span><span @click="empty"><i class="fi fi-trash"></i>清空列表</span></div>
<div class="lately_list">
     <div class="title" v-if="show||lateyPlay.length===0">
     <span>音乐标题</span>
     <span>歌手</span>
     <span>专辑名</span>
     <span>时长</span>
    </div>
     <el-empty v-if="show||lateyPlay.length===0" :image-size="200" description="我是空的" />
     <SongList v-else :list="lateyPlay" />
</div>
  </div>
</template>

<script setup>
import SongList from '../findMusic/songList/SongList.vue'
import bus from '@/utils/Bus'
import { ref } from 'vue'
const show = ref(false)
const count = ref(0)
const lateyPlay = JSON.parse(localStorage.getItem('lateyPlay'))
const empty = () => {
  show.value = true
  bus.emit('empty')
}

const playOne = () => {
  bus.emit('playOne', lateyPlay[0])
}

</script>

<style lang="less" scoped>

.lately_list{
  padding-left: 45px;
}

h1{
  margin-top: 0;

  .icon-yinle{
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

</style>
