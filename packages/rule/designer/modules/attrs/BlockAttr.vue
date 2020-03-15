<template>
    <a-form layout="horizontal">
        <a-form-item label="类型" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" hidden>
            <a-tag color="purple">{{ currentSelect.type }}</a-tag>
        </a-form-item>
        <a-form-item label="id" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input :value="currentSelect.id" disabled/>
        </a-form-item>
        <a-form-item label="名称" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input placeholder="请输入节点名称" :value="currentSelect.nodeName" @change="nodeNameChange" />
        </a-form-item>
        <a-form-item label="类路径" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input id="currentSelect.classname" placeholder="请输入" v-model="currentSelect.classname"/>
        </a-form-item>
    </a-form>
</template>

<script>
export default {
    name: "BlockAttr",
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