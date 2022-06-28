<template>
  <div class="search_box">
    <div class="search_proposal">
      <!-- 搜索历史 -->
      <div class="search_record" v-if="historyShow">
        <span>搜索历史</span>
        <el-popconfirm title="是否清空历史记录?" @confirm="historyShow = false">
          <template #reference>
            <span  @click="empty"><i class="fi fi-trash trash"></i></span>
          </template>
        </el-popconfirm>
        <div class="search_record_box">
          <span v-for="(item, index) in searchHistory" :key="index" @click="historyGO(item)">{{ item }}</span>
        </div>
      </div>

      <!-- 热搜 -->
      <div class="search_hot" v-if="props.show">
        <span>热搜榜</span>
        <div class="search_List" v-for="(item, index) in searchHot.value" :key="index" @click="historyGO(item.searchWord)">
          <span :class="{ red: index <= 2 }">{{ index + 1 }}</span> <span :class="{ top_three: index < 3 }">{{ item.searchWord }}</span> <span>{{ item.score }}</span>
        </div>
      </div>

      <!-- 搜索提示 -->
      <div class="search_tips" v-else>
        <div v-if="singerNoResult">
          <span>歌手</span>
          <div v-for="(item, index) in tipsData.artists" :key="index" @click="historyGO(item.name)">
            <span>{{ index + 1 }}</span
            >{{ item.name }}
          </div>
        </div>
        <div v-if="songNoResult">
          <span>歌曲</span>
          <div v-for="(item, index) in tipsData.songs" :key="index" @click="historyGO(item.name)">
            <span>{{ index + 1 }}</span
            >{{ item.name }}
          </div>
        </div>
        <div class="Noreault" v-if="noReault">
          <p><span class="iconfont icon-sousuo"></span>未查询到结果</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getHotSearchAPI } from '@/api/index'
import { getKey, removeKey } from '@/utils/localStorage.js'
import bus from '@/utils/Bus'
import { onMounted, reactive, defineEmits, defineProps, ref, watch } from 'vue'
// import { useRouter } from 'vue-router'

// 子传父
const emit = defineEmits()
// 父传子
const props = defineProps({ tips: Object, show: Boolean })
// 热搜数据
const searchHot = reactive({})
// 搜索历史
const historyShow = ref(true)
const searchHistory = reactive(JSON.parse(getKey()) || [])
// 提示数据
const tipsData = ref({})
// 查询到结果
const noReault = ref(false)
const singerNoResult = ref(true)
const songNoResult = ref(true)
// 清空历史记录
const empty = () => {
  removeKey(searchHistory.value)
  emit('empty', [])
}

// 点击历史跳转搜索
const historyGO = (val) => {
  emit('historyGO', val)
  bus.emit('goTop', val)
}

onMounted(async() => {
  const { data: res } = await getHotSearchAPI()
  searchHot.value = res.data
  if (getKey() === null) {
    historyShow.value = false
  }
})
watch(
  () => props.tips,
  () => {
    tipsData.value = props.tips
    if (tipsData.value.artists === undefined) {
      singerNoResult.value = false
    } else {
      singerNoResult.value = true
    }
    if (tipsData.value.songs === undefined) {
      songNoResult.value = false
    } else {
      songNoResult.value = true
    }
    if (tipsData.value.artists === undefined && tipsData.value.songs === undefined) {
      noReault.value = true
    } else {
      noReault.value = false
    }
  }
)
</script>

<style lang="less" scoped>

.trash{
  font-size: 16px;
}
.red {
  color: red !important;
}
.top_three {
  font-weight: 700;
}

.search_proposal::-webkit-scrollbar {
  display: none;
}
.search_proposal {
  cursor: pointer;
  position: fixed;
  top: 60px;
  left: 390px;
  border-radius: 10px;
  border: 1px solid #ccc;
  box-shadow: 2px 2px 3px #ccc;
  width: 340px;
  height: 400px;
  z-index: 1999;
  background-color: #fff;
  overflow: scroll;

  .search_record {
    padding: 0 10px;
    color: #ccc;
    border-radius: 10px 10px 0 0;

    span:nth-child(1) {
      font-size: 14px;
      margin: 0 5px;
    }
    span:nth-child(2) {
      font-size: 22px;
      margin: 0;
    }

    .search_record_box {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 20px;
      span {
        padding: 2px 10px;
        margin: 10px 10px 0 0;
        border-radius: 12px;
        font-size: 12px;
        color: #000;
        border: 1px solid #ccc;
      }
    }
  }
  .search_hot {
    margin: 10px 10px;
  }

  span {
    font-size: 14px;
    margin: 0 5px;
    color: #ccc;
  }

  .search_List {
    display: flex;
    height: 40px;
    line-height: 40px;
    background-color: #fff;

    span:nth-child(1) {
      margin: 0 10px;
      font-size: 12px;
    }
    span:nth-child(2) {
      padding: 0 20px;
      color: #000;
    }
    span:nth-child(3) {
      font-size: 12px;
    }
  }

  .search_tips {
    padding: 10px;
    div {
      div {
        display: flex;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        span {
          text-align: center;
          width: 20px;
        }
      }
    }
  }

  .Noreault {
    p {
      color: #ccc;
      text-align: center;
    }
  }
}
</style>
