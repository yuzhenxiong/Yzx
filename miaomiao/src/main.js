import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

Vue.config.productionTip = false
Vue.prototype.axios=axios;
Vue.use(MintUI);

import Scroller from '@/components/Scroller';
Vue.component('Scroller',Scroller);

Vue.filter('setWH',(url,arg)=>{
    return url.replace(/w\.h/,arg)
})

import Loading from '@/components/Loading';
Vue.component('Loading',Loading);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
