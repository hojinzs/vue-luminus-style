import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import '../luminus/luminus.styl'

new Vue({
  render: h => h(App),
}).$mount('#app')
