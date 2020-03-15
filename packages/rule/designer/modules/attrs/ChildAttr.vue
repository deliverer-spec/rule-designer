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
        <!-- 需要从后台返回列表后选择 -->
        <a-form-item label="子规则ID" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input placeholder="请输入子规则ID" v-model="currentSelect.childcode"/>
        </a-form-item>
        <a-form-item label="子规则名称" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input placeholder="请输入子规则名称" v-model="currentSelect.childname"/>
        </a-form-item>
        <a-form-item label="版本号" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input placeholder="请输入版本号" v-model="currentSelect.version"/>
        </a-form-item>
    </a-form>
</template>

<script>
export default {
    name: "ChildAttr",
    props: ['currentSelect', 'formItemLayout'],
    components: {
        
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