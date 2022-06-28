<template>
  <div class="box">
    <div class="singer_box">
      <div class="singer_sort">语种：<span @click="current" class="current">全部</span><span @click="current">华语</span><span @click="current">欧美</span><span @click="current">日本</span><span @click="current">韩国</span><span @click="current">其他</span></div>
      <div class="singer_sort_gender">分类：<span @click="currentGender" class="current">全部</span><span @click="currentGender">男歌手</span><span @click="currentGender">女歌手</span><span @click="currentGender">乐队</span></div>
      <div class="singer_sort_surname">
        <div>分类：</div>
        <div class="sort_surname_box">
          <span :class="{ current: item === '全部' }" ref="surnameRef" @click="currentSurname(index, $event)" v-for="(item, index) in surnameArr" :key="index">{{ item }}</span>
        </div>
      </div>
    </div>

    <div>
      <div class="singer_list">
        <div class="singer" v-for="item in singerList.list" :key="item.id" @click="goRdetails(item.id)">
          <div class="img_box"><el-image :src="item.img1v1Url" alt="" :teleported="true" lazy /></div>
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
    <el-backtop :right="20" :bottom="100" />
  </div>
</template>

<script setup>
import { getSingerListAPI } from '@/api/index'
import router from '@/router'
import { nextTick, watch, ref, onMounted, reactive } from 'vue'

const singerList = reactive({})

const surnameArr = ['全部', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z ']

const languageSort = ref(-1)
const GenderSort = ref(-1)
const surname = ref('')

const current = (e) => {
  if (e.target.innerHTML === '全部') {
    languageSort.value = -1
  } else if (e.target.innerHTML === '华语') {
    languageSort.value = 7
  } else if (e.target.innerHTML === '欧美') {
    languageSort.value = 96
  } else if (e.target.innerHTML === '日本') {
    languageSort.value = 8
  } else if (e.target.innerHTML === '韩国') {
    languageSort.value = 16
  } else if (e.target.innerHTML === '其他') {
    languageSort.value = 0
  }

  nextTick(() => {
    const sort = document.querySelectorAll('.singer_sort span')
    for (let i = 0; i < sort.length; i++) {
      sort[i].className = ''
    }
    e.target.className = 'current'
  })
}

const currentGender = (e) => {
  console.log(e.target.innerHTML)

  if (e.target.innerHTML === '全部') {
    GenderSort.value = -1
  } else if (e.target.innerHTML === '男歌手') {
    GenderSort.value = 1
  } else if (e.target.innerHTML === '女歌手') {
    GenderSort.value = 2
  } else if (e.target.innerHTML === '乐队') {
    GenderSort.value = 3
  }

  nextTick(() => {
    const sort = document.querySelectorAll('.singer_sort_gender span')
    for (let i = 0; i < sort.length; i++) {
      sort[i].className = ''
    }
    e.target.className = 'current'
  })
}

const surnameRef = ref()
const currentSurname = (index, e) => {
  nextTick(() => {
    surnameRef._rawValue.forEach((value) => {
      value.className = ''
    })
    // 变色
    surnameRef._rawValue[index].className = 'current'
  })
  if (e.target.innerHTML === '全部') {
    surname.value = ''
  } else {
    surname.value = surnameArr[index]
  }
}

const goRdetails = (id) => {
  router.push({ path: '/singe/rdetails', query: { idr: id } })
}

onMounted(async() => {
  document.documentElement.scrollTop = 0
  const { data: res } = await getSingerListAPI()
  singerList.list = res.artists
})

watch(
  () => [languageSort.value, GenderSort.value, surname.value],
  async() => {
    const { data: res } = await getSingerListAPI(GenderSort.value, languageSort.value, surname.value)
    singerList.list = res.artists
  }
)
</script>

<style lang="less" scoped>
.current {
  color: #db2c1d;
}

.box {
  width: 1110px;

  .singer_box {
    padding: 0 20px 0 20px;

    .singer_sort,
    .singer_sort_gender {
      margin: 0 0 20px 0;
      display: flex;
      flex-wrap: wrap;
      font-size: 14px;
      span {
        cursor: pointer;
        margin: 0 20px;
        width: 50px;
        padding: 0 5px;
        text-align: center;
        border-radius: 20px;
      }
    }

    .singer_sort_surname {
      display: flex;

      div:nth-child(1) {
        font-size: 14px;
        width: 42px;
      }
      .sort_surname_box {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        font-size: 14px;
        padding-right: 228px;

        span {
          cursor: pointer;
          margin: 0 20px 0;
          height: 40px;
          width: 50px;
          padding: 0 5px;
          text-align: center;
          border-radius: 20px;
        }
      }
    }
  }
  .singer_list {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;

    .singer {
      cursor: pointer;
      width: 190px;
      margin: 15px;
      height: 220px;
      overflow: hidden;
      border-radius: 15px 15px 0 0;

      .img_box {
        position: relative;
        width: 190px;
        height: 190px;
        overflow: hidden;
        border-radius: 0 0 15px 15px;
      }

      p {
        font-size: 14px;
        margin: 5px 0 0 0;
        text-align: center;
      }
    }
  }
}
</style>
