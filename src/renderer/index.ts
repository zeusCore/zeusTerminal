if (process.env.NODE_ENV === 'production') {
    const fixPath = require('fix-path')
    fixPath()
}

import Vue from 'vue'

import App from './App.vue'

import motx from '@/motx'

Vue.use(motx)

if (!process.env.IS_WEB) {
    Vue.use(require('vue-electron'))
}
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    components: { App },
    template: '<App/>'
}).$mount('#app')
