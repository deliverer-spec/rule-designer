<template>
    <a-form layout="horizontal">
        <a-form-item label="类型" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" hidden>
            <a-tag color="purple">{{ currentSelect.type }}</a-tag>
        </a-form-item>
        <a-form-item label="id" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input :value="currentSelect.id" disabled />
        </a-form-item>
        <a-form-item label="名称" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input placeholder="请输入节点名称" :value="currentSelect.nodeName" @change="nodeNameChange" />
        </a-form-item>

        
        <a-form-item label="评分卡总分" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" v-if="show">
            <a-input placeholder="请输入总分" v-model="currentSelect.total_score" />
        </a-form-item>
        <!-- <a-form-item label="名称" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input placeholder="请输入节点名称" :value="currentSelect.nodeName2"/>
        </a-form-item> -->
        
        <!-- 输入参数列表
        id 名称 数据类型 默认值 格式化 是否必须默认必须 -->
        <params-row :currentSelect='currentSelect'/>

    </a-form>
</template>

<script>
import ParamsRow from '../edittable/ParamsRow'
export default {
    name: "StartAttr",
    props: ['currentSelect', 'formItemLayout','ruleData'],
    data(){
        return {
            show:false
        }
    },
    components: {
        ParamsRow
    },
    mounted(){
       const aa = this.ruleData.attr.ruletype;
       if(aa=='RCard'){
           this.show=true;
       }
    },
    methods: {
        nodeNameChange(e){
            this.$emit("nodeNameChange", e)
        },
        changevalue(){

        }
    }
}
</script>