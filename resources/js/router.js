import Vue from 'vue'
import VueRouter from 'vue-router'
import Registration from './components/Registration.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'register',
    component: Registration
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
