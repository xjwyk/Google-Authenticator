import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import decode from 'jwt-decode';
import 'font-awesome/css/font-awesome.min.css';

const axiosConfig = {
  baseURL: "http://localhost:3333",
}

Vue.prototype.$axios = axios.create(axiosConfig);
Vue.prototype.$axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('token')}`;

Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
  mounted() {
    if(localStorage.token) {
      try {
        const payload = decode(localStorage.token);
        const user = {
          username: payload.username,
          email: payload.email,
          phone: payload.phone,
          card: payload.card,
          sex: payload.sex,
          token: localStorage.token
        };
        store.dispatch('setUserAction', user);
        this.$router.push(this.$router.currentRoute.name === 'login' ? 'home' : this.$router.currentRoute.path);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err.message);
      }
    }

    if (!localStorage.token) {
      this.$router.push('login');
    }
  }
}).$mount('#app');
