<template>
  <div>
    <div class="song-single">
      <div class="song-img" >
        <div class="play_but"  ><span class="iconfont icon-kaishi"></span></div>
        <div class="play">
          <span class="iconfont icon-zanting2"> {{ computedQuantity(SongData.playCount) }}</span>
        </div>
        <el-image :src="SongData.picUrl || SongData.coverImgUrl" alt="" lazy  :title="SongData.name" />
      </div>
      <div class="introduce">
        <p>{{ SongData.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'
const SongData = ref()
const props = defineProps({ songSheet: {} })
SongData.value = props.songSheet

const computedQuantity = (num) => {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(1) + '亿'
  } else if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
}

</script>

<style lang="less" scoped>
.song-single {
  position: relative;
  display: flex;
  flex-direction: column;
  float: left;

  width: 189px;
  height: 210px;
  margin: 0 15px 15px 25px;

  .play {
    position: absolute;
    top: 5px;
    right: 5px;
    color: #fff;

    .icon-zanting2 {
      font-size: 10px;
      margin-right: 3px;
    }
  }

  .song-img {
    position: relative;
    overflow: hidden;
    height: 190px;
    border-radius: 10px;
    img {
      width: 100%;
      height: 100%;
      vertical-align: middle;
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
  }
 &:hover .play_but{
      opacity: 1;
    }
  .introduce {
    p {
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 14px;
      line-height: 25px;
    }
  }
}

</style>
