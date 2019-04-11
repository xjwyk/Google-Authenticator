import Vue from 'vue';
import Router from 'vue-router';
import Login from './components/Login';
import Home from './views/Home';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      hidden: true
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('./components/Register.vue'),
      hidden: true
    },
    {
      path: '/',
      component: Home,
      name: '主页',
    }
  ],
  mode: 'history'
});
