<template>
  <div>
    <div class="mv_content">
     <div class="mv_sort"><div>最新MV<span class="iconfont icon-xiangyoujiantou"></span></div><div class="sort"><span class="current" @click="current">全部</span><span @click="current">内地</span><span @click="current">港台</span><span @click="current">欧美</span><span @click="current">日本</span><span @click="current">韩国</span></div></div>
 <MvList :sort="sort" :mvlist="mvData" />
 <div class="Netease_make"><div>网易云出品<span class="iconfont icon-xiangyoujiantou"></span></div></div>
 <div class="mv_list">
      <div class="mv_box" v-for="(item,index) in mvList.list" :key="index">
      <div class="mv"  >
        <div class="play_but"  ><span class="iconfont icon-kaishi"></span></div>
        <img :src="item.cover" alt=""></div><p class="mv_name">{{item.name}}</p><div class="artists"><p v-for="(obj) in item.artists" :key="obj.id">{{obj.name}}</p></div><div class="play_count">
        <span class="iconfont icon-zanting2"><span>{{count(item.playCount)}}</span></span>
      </div></div>
   </div>
    </div>
  </div>
</template>

<script setup>
import MvList from './MvList.vue'
import { getNeteaseMvAPI, getNewMvAPI } from '@/api/index'
import { nextTick, ref, onMounted, reactive } from 'vue'

const sort = ref('')
const mvList = reactive({})
const mvData = ref({
})
const count = (val) => {
  return (val / 10000).toFixed(0) + '万'
}
const current = (e) => {
  if (e.target.innerHTML === '全部') {
    sort.value = ''
  } else if (e.target.innerHTML === '内地') {
    sort.value = e.target.innerHTML
  } else if (e.target.innerHTML === '港台') {
    sort.value = e.target.innerHTML
  } else if (e.target.innerHTML === '欧美') {
    sort.value = e.target.innerHTML
  } else if (e.target.innerHTML === '日本') {
    sort.value = e.target.innerHTML
  } else if (e.target.innerHTML === '韩国') {
    sort.value = e.target.innerHTML
  }

  nextTick(() => {
    const sort = document.querySelectorAll('.sort span')
    for (let i = 0; i < sort.length; i++) {
      sort[i].className = ''
    }
    e.target.className = 'current'
  })
}

onMounted(async() => {
  const { data: res } = await getNewMvAPI()
  mvData.value = res.data

  const { data: res2 } = await getNeteaseMvAPI()
  mvList.list = res2.data
}
)

</script>

<style lang="less" scoped>
.current{
  color: #fff;
  background-color: #db2c1d;
}
.mv_content{
  width: 100%;
  .Netease_make{
    margin-top: 30px;
  }
.mv_sort,.Netease_make{
 display: flex;

 .sort{
  display: flex;
  font-size: 14px;
  margin-left: 600px;
  span{
    cursor: pointer;
    text-align: center;
    width: 40px;
    line-height: 21px;
    margin: 0 10px;
    padding:0 3px;
    border-radius: 15px;

  }
 }

}

}
.mv_list{
  width: 1100px;
  display: flex;
  flex-wrap: wrap;
  margin-top: 30px;
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
