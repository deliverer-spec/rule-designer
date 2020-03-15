// 用于导出单个组件，如果要做按需引入，也需要在这里配置
// 导入组件，组件必须声明 name
import RuleDesigner from './designer/RuleDesigner'
 
// 为组件添加 install 方法，用于按需引入
RuleDesigner.install = function (Vue) {
    Vue.component(RuleDesigner.name, RuleDesigner)
}
 
export default RuleDesigner