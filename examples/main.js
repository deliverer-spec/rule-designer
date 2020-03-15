import Vue from 'vue'
import App from './App.vue'
import RuleDesigner from '../packages/index'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import VueContextMenu from 'vue-contextmenu'
import vcolorpicker from 'vcolorpicker'

Vue.use(Antd)
Vue.use(VueContextMenu)
Vue.use(vcolorpicker)
Vue.config.productionTip = false

Vue.use(RuleDesigner)

new Vue({
  render: h => h(App),
}).$mount('#app')
