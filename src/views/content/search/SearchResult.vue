<template>
  <div>
    <div class="search_total">
      <p>找到{{ total }}{{sort}}</p>
    </div>
    <div class="search_list">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="tabChange">
        <!-- @tab-click="handleClick" -->
        <el-tab-pane label="歌曲" name="first"><SongList @total="getTotal" /></el-tab-pane>
        <el-tab-pane label="MV" name="mvList"><MvList :mvlist="mvlist" @load="getLoad" /></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import SongList from '@/views/content/findMusic/songList/SongList.vue'
import MvList from '../MV/MvList.vue'
import { ElLoading } from 'element-plus'
import { getSearchResultAPI } from '@/api/index'
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'

const route = useRoute()

const activeName = ref('first')
const sort = ref('首单曲')
const total = ref(0)
const mvlist = ref({})
const quantity = ref()
const mvCount = ref()

const getTotal = (val) => {
  total.value = val
  quantity.value = val
}
const tabChange = (e) => {
  if (e.paneName === 'mvList') {
    total.value = mvCount.value
    sort.value = '个MV'
  } else {
    sort.value = '首单曲'
    total.value = quantity.value
  }
}

let time = null
const getLoad = async(val) => {
  clearTimeout(time)
  const loading = ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  const { data: res } = await getSearchResultAPI(route.query.name, val, 1004, 12)
  if (res.result.mvs.length === 0) return
  mvlist.value = [...mvlist.value, ...res.result.mvs]

  time = setTimeout(() => {
    loading.close()
  }, 2000)
}

onMounted(async() => {
  document.documentElement.scrollTop = 0
  const { data: res } = await getSearchResultAPI(route.query.name, 0, 1004, 12)
  mvCount.value = res.result.mvCount
  mvlist.value = res.result.mvs
})
</script>

<style lang="less" scoped>
.search_total {
   padding-left: 45px;
  p {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
  }
}
.search_list{
  padding-left: 45px;
}
</style>
