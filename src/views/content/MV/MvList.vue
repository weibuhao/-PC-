<template>
  <div>
      <div class="mv_list" v-infinite-scroll="load"  infinite-scroll-immediate="false"  style="overflow: auto" infinite-scroll-distance="40px" >
      <div class="mv_box" v-for="(item,index) in arr.list||mvList.list" :key="index" @click="goMVDetails(item.id)">
      <div class="mv"  >
        <div class="play_but"  ><span class="iconfont icon-kaishi"></span></div>
        <img :src="item.cover" alt=""></div><p class="mv_name">{{item.name}}</p><div class="artists"><p v-for="(obj) in item.artists" :key="obj.id">{{obj.name}}</p></div><div class="play_count">
        <span class="iconfont icon-zanting2"><span>{{count(item.playCount)}}</span></span>
      </div></div>
     </div>
  </div>
</template>

<script setup>
import { getNewMvAPI } from '@/api/index'
import { useRouter } from 'vue-router'
import { onMounted, reactive, defineProps, watch, toRef, defineEmits } from 'vue'

const router = useRouter()
const arr = reactive({})
const props = defineProps({ sort: String, mvlist: Object })
const emit = defineEmits()
const mvList = reactive({})
let page = 1
const count = (val) => {
  return (val / 10000).toFixed(0) + '万'
}

const goMVDetails = (id) => {
  router.push({ path: '/mv/details', query: { mvId: id } })
}

const load = () => {
  page++
  emit('load', page)
}

onMounted(async() => {
  mvList.list = toRef(props, 'mvlist')
})

watch(() => props.sort,
  async() => {
    const { data: res } = await getNewMvAPI(props.sort)
    arr.list = res.data
  }
)
</script>

<style lang="less" scoped>
.mv_list::-webkit-scrollbar{display: none;}
.mv_list{
  // position: relative;
  width: 1100px;
  height: 400px;
  overflow: scroll;
  display: flex;
  flex-wrap: wrap;
  margin-top: 15px;

  .mv_box{
    position: relative;
  margin: 8px 20px;
  overflow: hidden;
  border-radius: 5px 5px 0 0;

  .mv{
    cursor: pointer;
    position: relative;
    .play_but{
     position: absolute;
     width: 40px;
     height: 40px;
     top: 50%;
     left: 50%;
     transform: translate(-50%,-50%);
     background-color:#fff;
     text-align: center;
     line-height: 40px;
     border-radius: 100%;
     opacity: 0;
transition: all 0.8s;
     .icon-kaishi{
color:#db2c1d;
     }
    }
    &:hover .play_but{
      opacity: 1;
    }

  }
  .play_count{
    position: absolute;
    height: 20px;
    line-height: 20px;
  top: 5px;
  right: 8px;
.icon-zanting2{
  font-size: 12px;
  color: #fff;
  padding-bottom: 3px;
  span{
    font-size: 10px;
  }
}
  }

.mv{
width: 230px;
  height: 130px;
}
  img{
    width: 100%;
    height: 100%;
    border-radius:0 0 5px 5px;
  }
  .mv_name{
    width: 230px;
    font-size: 14px;
    margin: 5px 0;
    color: #000;
     overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .artists{
    width: 230px;
    display: flex;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
 p{
  margin: 0;

    font-size: 12px;
    padding: 0 5px 0 0;
    color: #676767;

  }
  }

  }
 }
</style>
