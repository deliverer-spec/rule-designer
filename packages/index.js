//实现组件的全局注册
// 导入单个组件
import RuleDesigner from './rule/index'
// import Antd from 'ant-design-vue'
// import 'ant-design-vue/dist/antd.css'
// import VueContextMenu from 'vue-contextmenu'
// import vcolorpicker from 'vcolorpicker'

// 以数组的结构保存组件，便于遍历
const components = [
    // Antd,VueContextMenu,vcolorpicker,
    RuleDesigner
]
 
// 定义 install 方法
const install = function (Vue) {
    if (install.installed) return
    install.installed = true
    // 遍历并注册全局组件
    components.map(component => {
        Vue.component(component.name, component)
    })
}

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}
 
export default {
    // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
    install,
    // 组件列表
    // ...components
    RuleDesigner
}