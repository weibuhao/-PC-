<template>
  <div>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="tabClick">
      <el-tab-pane label="推荐" name="first"></el-tab-pane>
      <!-- @songList="getSongList" -->
      <el-tab-pane label="歌单" name="second"></el-tab-pane>
      <el-tab-pane label="排行榜" name="third"></el-tab-pane>
      <el-tab-pane label="歌手" name="fourth"></el-tab-pane>
      <el-tab-pane label="最新音乐" name="music"></el-tab-pane>
    </el-tabs>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component"></component>
      </keep-alive>
      <!-- <component  v-if="!route.meta.keepAlive" :is="Component"  ></component> -->
    </router-view>
  </div>
</template>

<script setup >
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { setltem, getTobName } from '@/utils/sessionStorage.js'
const router = useRouter()
// const route = useRoute()
const activeName = ref('first')
const tabClick = (value) => {
  document.documentElement.scrollTop = 0
  if (value.props.name === 'first') {
    router.push({ path: '/findMusic/' })
    setltem('first')
  } else if (value.props.name === 'second') {
    router.push({ path: '/findMusic/hotSongSings' })
    activeName.value = 'second'
    setltem('second')
  } else if (value.props.name === 'third') {
    router.push({ path: '/findMusic/rankingList' })
    activeName.value = 'third'
    setltem('third')
  } else if (value.props.name === 'fourth') {
    router.push({ path: '/findMusic/singer' })
    activeName.value = 'fourth'
    setltem('fourth')
  } else if (value.props.name === 'music') {
    router.push({ path: '/findMusic/newmusic' })
    activeName.value = 'music'
    setltem('music')
  }
}
onMounted(() => {
  const topName = getTobName()
  if (topName === 'first') {
    router.replace({ path: '/findMusic/' })
  } else if (topName === 'second') {
    router.replace({ path: '/findMusic/hotSongSings' })
  } else if (topName === 'third') {
    router.replace({ path: '/findMusic/rankingList' })
  } else if (topName === 'fourth') {
    router.replace({ path: '/findMusic/singer' })
  } else if (topName === 'music') {
    router.replace({ path: '/findMusic/newmusic' })
  }
  activeName.value = topName
  if (activeName.value === null) {
    activeName.value = 'first'
  }
})
</script>

<script>
export default {
  name: 'findMusic'
}
</script>

<style lang="less" scoped>
/deep/.el-tabs__header {
  width: 100%;
  position: fixed;
  top: 60px;
  z-index: 999;
  background-color: #fff;
}
.demo-tabs {
  margin-top: 30px;
}
</style>
