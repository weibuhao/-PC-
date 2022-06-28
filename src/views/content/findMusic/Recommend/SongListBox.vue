<template>
  <div class="song-single-box">
    <song-single v-for="item in songSheet.value" :key="item.id" :songSheet="item" @click="Jump(item.id)" class="hover"></song-single>
  </div>
</template>

<script setup>
import SongSingle from './SongSingle.vue'
// 路由
import { useRouter } from 'vue-router'
// vuex
import store from '@/store/index'
// vueAPI
import { defineProps, onMounted, ref } from 'vue'

// 定义路由
const router = useRouter()

// 歌单列表数据
const songSheet = ref()
const props = defineProps({ RecommendSong: Object })
songSheet.value = props.RecommendSong
// 跳转歌单详情
const Jump = (id) => {
  router.push({ path: '/song/details', query: { id: id } })
  store.dispatch('getsong', id)
}

onMounted(() => {
  document.documentElement.scrollTop = 0
})
</script>

<style lang="less" scoped>
.song-single-box {
  margin-top: 15px;
  width: 100%;
}
.hover {
  cursor: pointer;
}
</style>
