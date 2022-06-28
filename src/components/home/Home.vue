<template>
  <div class="home-box">
    <div class="common-layout">
      <el-container class="header">
        <el-header>
          <div class="logo">
            <img src="@/assets/images/logo.png" alt="" />
          </div>
          <div class="arrow">
            <span class="iconfont icon-xiangzuojiantou" @click="back"></span>
            <span class="iconfont icon-xiangyoujiantou" @click="router.go(1)"></span>
          </div>
          <div class="search-box">
            <div class="search">
              <span class="iconfont icon-sousuo"></span>
              <input type="text" placeholder="请输入内容" v-model.trim="searchVal" @focus="focus" @keydown="enter" />
            </div>
          </div>
          <div class="login-box" @click="QRCodeShow">
            <el-avatar :size="45">
              <!-- @error="errorHandler" -->
              <img v-if="imgShow" src="@/assets/images/test.logo.jpg" />
              <img v-else :src="userImg" alt="" />
            </el-avatar>
            <span class="login">{{ userName }}</span>
          </div>
        </el-header>
      </el-container>
      <!-- <router-view></router-view> -->
    </div>
    <ContentVue @click="hide" />
    <!-- 点击头像的内容 -->
    <transition name="el-fade-in-linear">
      <div v-show="show" class="transition-box">
        <div class="horn"></div>
        <div class="box-logo">
          <img v-if="imgShow" src="@/assets/images/test.logo.jpg" alt="" />
          <img v-else :src="userImg" alt="" />
        </div>
        <p v-if="wordsShow">网易云扫一扫登录</p>
        <p v-else>欢迎来到网易云</p>
        <div class="twoCode">
          <img v-if="QRCodehidh" :src="QRCode" alt="" />
          <div v-else class="user_out" @click="loginOut">退出登录</div>
        </div>
      </div>
    </transition>

    <Search v-if="SearchShow" :tips="tips.value" :show="Hotshow" @empty="getempty" @historyGO="getHistoryGO"></Search>

    <Play></Play>
  </div>
</template>

<script setup>
import ContentVue from '@/views/content/Content.vue'
import Search from '../Search.vue'
import { getKeyAPI, getKeyImgAPI, getUserAPI, getSearchTipsAPI } from '@/api/index'
import { ref, onMounted, watch, h, reactive } from 'vue'
import { setltemKey, getKey } from '@/utils/localStorage.js'
// 导入路由
import { useRouter } from 'vue-router'
import Play from './Play.vue'
import { ElNotification, ElMessage, ElMessageBox } from 'element-plus'

// 封装路由
const router = useRouter()
// 返回主页
const back = (e) => {
  searchVal.value = ''
  router.back()
}

// 路由跳转
const goSearchRresult = (val) => {
  router.push({ path: '/search/result', query: { name: val } })
  SearchShow.value = false
  const input = document.querySelector('input')
  input.blur()
  Hotshow.value = true
}

const searchVal = ref('')

// 登录
const Key = ref('')
const QRCode = ref('')
const state = ref()
const userName = ref('点击登录')
const wordsShow = ref(true)
const QRCodehidh = ref(true)
const imgShow = ref(true)
// 退出登录
const loginOut = () => {
  show.value = false
  ElMessageBox.confirm('是否退出登录?', '登录', {
    confirmButtonText: '确定',
    cancelButtonText: '再考虑考虑',
    type: 'warning',
    center: true
  }).then(() => {
    ElMessage({
      type: 'success',
      center: true,
      message: '退出登录成功！'
    })
    localStorage.removeItem('tokenUser')
    userName.value = '点击登录'
    QRCodehidh.value = true
    imgShow.value = true
    wordsShow.value = true
    userImg.value = '@/assets/images/test.logo.jpg'
  })
  // .catch(() => {
  //   ElMessage({
  //     type: 'info',
  //     message: 'Delete canceled'
  //   })
  // })
}

// 显示登入
const show = ref(false)
let time = null
const QRCodeShow = () => {
  show.value = !show.value
  if (show.value === false) {
    clearInterval(time)
  } else {
    time = setInterval(() => UserState(), 3000)
  }
}

const userImg = ref('')
const UserState = async() => {
  const { data: res3 } = await getUserAPI({ key: Key.value, timestamp: Date.now() })
  state.value = res3.code
}

// 搜索
const SearchShow = ref(false)

let history = JSON.parse(getKey()) || []
const focus = () => {
  SearchShow.value = true
  Hotshow.value = true
}

const hide = () => {
  SearchShow.value = false
  show.value = false
}

// 搜索提示数据
const tips = reactive({})

const enter = (e) => {
  if (e.keyCode === 13) {
    if (searchVal.value !== '') {
      history.unshift(searchVal.value)
      const theSet = new Set(history)
      const arr = Array.from(theSet)
      setltemKey(JSON.stringify(arr))
      goSearchRresult(searchVal.value)
    }
  }
}

const getempty = (val) => {
  history = val
}

const getHistoryGO = (val) => {
  searchVal.value = val
  goSearchRresult(val)
  history.unshift(val)
  const theSet = new Set(history)
  const arr = Array.from(theSet)
  setltemKey(JSON.stringify(arr))
}

let tokenUser = {}
onMounted(async() => {
  if (localStorage.getItem('tokenUser') !== null) {
    tokenUser = JSON.parse(localStorage.getItem('tokenUser'))
    userName.value = tokenUser.name
    userImg.value = tokenUser.img
    wordsShow.value = false
    QRCodehidh.value = false
    imgShow.value = false
  }
  const { data: res } = await getKeyAPI()
  Key.value = res.data.unikey
  const { data: res2 } = await getKeyImgAPI({ key: res.data.unikey, qrimg: true })
  QRCode.value = res2.data.qrimg
  ElNotification({
    title: '温馨提醒',
    message: h('i', { style: 'color: teal' }, '欢迎亲爱的用户！！  վ' + '+' + 'ᴗ' + '+' + ' ի')
  })
})

const name = ref()
const img = ref()
watch(
  () => state.value,
  async() => {
    if (state.value === 803) {
      tokenUser.name = name.value
      tokenUser.img = img.value
      localStorage.setItem('tokenUser', JSON.stringify(tokenUser))
      wordsShow.value = false
      ElMessage({
        message: '登入成功!',
        type: 'success',
        center: true
      })
      userName.value = name.value
      userImg.value = img.value
      imgShow.value = false
      clearInterval(time)
      show.value = false
      QRCodehidh.value = false
    } else if (state.value === 802) {
      ElMessage({
        message: '授权中.........',
        type: 'warning',
        center: true
      })
      const { data: res3 } = await getUserAPI({ key: Key.value, timestamp: Date.now() })
      name.value = res3.nickname
      img.value = res3.avatarUrl
      // imgShow.value = false
    } else if (state.value === 800) {
      const { data: res } = await getKeyAPI()
      Key.value = res.data.unikey
      const { data: res2 } = await getKeyImgAPI({ key: res.data.unikey, qrimg: true })
      QRCode.value = res2.data.qrimg
    }
  }
)

let searchTiem = null
const Hotshow = ref(true)
watch(
  () => searchVal.value,
  () => {
    clearTimeout(searchTiem)
    searchTiem = setTimeout(async() => {
      if (searchVal.value !== '') {
        const { data: res } = await getSearchTipsAPI(searchVal.value)
        tips.value = res.result
        Hotshow.value = false
      } else {
        Hotshow.value = true
      }
    }, 300)
  }
)
</script>

<style lang="less" scoped>
.header {
  position: fixed;
  top: 0;
  z-index: 999;
  width: 100%;
}

.home-box {
  padding: 60px 0 55px;
}
.el-header {
  display: flex;
  background-color: #db2c1d;
  padding-top: 10px;
  line-height: 40px;

  .logo {
    width: 210px;
    img {
      width: 135px;
      vertical-align: middle;
    }
  }

  .arrow {
    display: flex;
    line-height: 10px;
    cursor: pointer;
    .icon-xiangzuojiantou,
    .icon-xiangyoujiantou {
      flex: 1;
      font-size: 18px;
      color: #fff;
      margin: 15px;
    }
  }
  .search-box {
    width: 400px;
    margin-left: 40px;
    .search {
      float: left;
      width: 260px;
      .icon-sousuo {
        padding: 5px 0 0;
        font-size: 18px;
        color: #fff;
      }
      input {
        width: 80%;
        height: 100%;
        border-radius: 15px;
        padding: 10px;
        border: none;
        outline: none;
        background-color: #db2c1d;
        color: #fff;
      }
      input::placeholder {
        color: #fff;
        font-size: 15px;
      }
    }
  }
  .login-box {
    margin-left: 350px;
    // img{
    //   width: 45px;
    //   vertical-align:middle;
    //   cursor:pointer;
    // }
    .login {
      margin-left: 10px;
      color: #fff;
      font-size: 15px;
      cursor: pointer;
    }
  }
  /deep/.el-avatar {
    vertical-align: middle;
    cursor: pointer;
  }
}
.transition-box {
  position: fixed;
  top: 75px;
  right: 90px;
  z-index: 999999;
  margin-bottom: 10px;
  width: 200px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #fff;
  text-align: center;
  color: #000;
  padding: 20px 10px;
  box-sizing: border-box;
  margin-right: 20px;

  .horn {
    position: absolute;
    top: -8px;
    left: 50%;
    width: 15px;
    height: 15px;
    transform: translate(-50%, 0) rotate(45deg);
    background-color: #fff;
    border-left: 1px solid #ccc;
    border-top: 1px solid #ccc;
  }
  .box-logo {
    position: relative;
    left: 50%;
    width: 40px;
    height: 40px;
    background-color: pink;
    border-radius: 50%;
    overflow: hidden;
    transform: translate(-50%);
    img {
      width: 100%;
    }
  }
  p {
    font-size: 14px;
    margin: 10px 0 5px;
  }
}
/deep/.el-tabs__active-bar {
  background-color: #e4e7ed;
}

.user_out {
  padding: 10px;
  color: #fff;
  background-color: #db2c1d;
}
</style>
