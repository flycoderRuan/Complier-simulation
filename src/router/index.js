import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      redirect: '/index/main-interface',
      children: [
        {
          path: '/index/main-interface',
          component: resolve =>
            require(['../components/page/mainInterface.vue'], resolve)
        },
        {
          path: '/user/my-collection',
          component: resolve =>
            require(['../components/page/MyCollection.vue'], resolve)
        },
        {
          path: '/index/lexical-analysis',
          component: resolve =>
            require(['../components/page/LexicalAnalysis.vue'], resolve)
        },
        {
          path: '/user/modifypassword',
          component: resolve =>
            require(['../components/page/Modifypassword.vue'], resolve)
        }
      ]
    }
  ]
})
