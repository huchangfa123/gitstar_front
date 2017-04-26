import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import First from '@/components/first'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/first',
      name: 'first',
      component: First
    }
  ]
})
