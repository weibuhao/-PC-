import { createRouter, createWebHashHistory } from 'vue-router'
// createWebHistory

const routes = [
  // component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // {
  // path: '/',
  // name: 'Content',
  // component: () => import(/* webpackChunkName: "Content" */ '@/views/content/Content'),
  // redirect: '/findMusic',
  // children: [
  {
    path: '/',
    name: 'findMusic',
    redirect: '/findMusic/',
    meta: {
      // keepAlive: true // 组件需要缓存
      // scrollTop: []
    },
    component: () => import(/* webpackChunkName: "findMusic" */ '@/views/content/findMusic/findMusic'),
    children: [
      {
        path: '/findMusic/',
        name: 'recommend',
        component: () => import(/* webpackChunkName: "recommend" */ '@/views/content/findMusic/Recommend/Recommend')
      },
      {
        path: '/findMusic/hotSongSings',
        name: 'hotSongSings',
        meta: {
          // keepAlive: true, // 组件需要缓存
          scrollTop: 0
        },
        component: () => import(/* webpackChunkName: "hotSongSings" */ '@/views/content/findMusic/songList/HotSongSings')
      },
      {
        path: '/findMusic/rankingList',
        name: 'rankingList',
        // meta: {
        //   // keepAlive: true, // 组件需要缓存
        //   scrollTop: 0
        // },
        component: () => import(/* webpackChunkName: "rankingList" */ '@/views/content/findMusic/rankingList')
      },
      {
        path: '/findMusic/singer',
        name: 'singer',
        // meta: {
        //   // keepAlive: true, // 组件需要缓存
        //   scrollTop: 0
        // },
        component: () => import(/* webpackChunkName: "Singer" */ '@/views/content/findMusic/singer/Singer')
      },
      {
        path: '/findMusic/newmusic',
        name: 'newMusic',
        // meta: {
        //   // keepAlive: true, // 组件需要缓存
        //   scrollTop: 0
        // },
        component: () => import(/* webpackChunkName: "newMusic" */ '@/views/content/findMusic/newMusic/newMusic')
      }
    ]
  },
  {
    path: '/song/details',
    name: 'songDetails',
    // meta: {
    //   keepAlive: true // 组件需要缓存
    // },
    component: () => import(/* webpackChunkName: "songDetails" */ '@/views/content/findMusic/songDetails')
  },
  {
    path: '/search/result',
    name: 'SearchResult',
    component: () => import(/* webpackChunkName: "SearchResult" */ '@/views/content/search/SearchResult')
  },
  {
    path: '/singe/rdetails',
    name: 'singeRdetails',
    component: () => import(/* webpackChunkName: "singeRdetails" */ '@/views/content/findMusic/singer/singeRdetails')
  },
  {
    path: '/mv',
    name: 'MV',
    component: () => import(/* webpackChunkName: "MV" */ '@/views/content/MV/mv')

  },
  {
    path: '/recommendsong',
    name: 'recommendSong',
    component: () => import(/* webpackChunkName: "recommendSong" */ '@/views/content/recommendSong/recommendSong')

  },
  {
    path: '/mv/details',
    name: 'MvDetails',
    component: () => import(/* webpackChunkName: "MvDetails" */ '@/views/content/MV/MvDetails')
  },
  {
    path: '/lately/play',
    name: 'latelyPlay',
    component: () => import(/* webpackChunkName: "latelyPlay" */ '@/views/content/latelyPlay/latelyPlay')
  }
]
// }
// ]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
