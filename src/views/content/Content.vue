<template>
  <div>
    <el-container>
      <el-affix :offset="60" class="affix">
        <el-aside width="200px">
          <ul ref="ul">
            <li class="current" @click="findMusic">发现音乐</li>
            <li @click="everyday">推荐单曲</li>
            <li @click="MvFn">MV</li>
            <li @click="latelyPlay">最近播放</li>
          </ul>
        </el-aside>
      </el-affix>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup >
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()
const index = ref(0)
const ul = ref()

const scrollTop = () => {
  document.documentElement.scrollTop = 0
}

const Storage = (val) => {
  sessionStorage.setItem('index', JSON.stringify(val))
}

// 排他思想
const emptyClass = () => {
  for (let i = 0; i < ul.value.children.length; i++) {
    ul.value.children[i].className = ''
  }
}

let flang = true
// 发现音乐
const findMusic = (e) => {
  scrollTop()
  emptyClass()
  e.srcElement.className = 'current'
  index.value = 0
  Storage(index.value)
  if (flang) {
    if (e.target.innerHTML === '发现音乐') {
      router.push({ path: '/findMusic' })
      flang = false
    }
  }
}

// 推荐单曲
const everyday = (e) => {
  scrollTop()
  flang = true
  emptyClass()
  e.srcElement.className = 'current'
  index.value = 1
  Storage(index.value)
  router.push({ path: '/recommendsong' })
}

// Mv
const MvFn = (e) => {
  scrollTop()
  emptyClass()
  e.srcElement.className = 'current'
  index.value = 2
  Storage(index.value)
  router.push({ path: '/mv' })
  flang = true
  document.documentElement.scrollTop = 0
}

// 最近播放
const latelyPlay = (e) => {
  scrollTop()
  flang = true
  emptyClass()
  e.srcElement.className = 'current'
  index.value = 3
  Storage(index.value)
  router.push({ path: '/lately/play' })
  document.documentElement.scrollTop = 0
}

onMounted(() => {
  emptyClass()
  const index = JSON.parse(sessionStorage.getItem('index'))
  if (ul.value.children[index] === undefined) {
    ul.value.children[0].className = 'current'
  } else {
    ul.value.children[index].className = 'current'
  }
})

</script>

<script>
export default {
  name: 'Content'
}
</script>

<style lang="less" scoped>
.current {
  font-size: 16px;
  font-weight: 600;
  background-color: #f6f6f7;
}
.el-aside {
  width: 160px;
  border-right: 1px solid #ccc;
}
ul {
  cursor: pointer;
  padding: 0;
  margin: 0;
  li {
    margin: 0 !important;
    padding: 10px 30px;
    list-style: none;
    margin: 15px 0;
    cursor: pointer;
    font-size: 14px;
  }
}
</style>
