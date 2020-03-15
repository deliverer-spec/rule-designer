<template>
    <div>
<!-- <template v-else-if="currentSelect.type == 'freedom'"> -->
        <a-form layout="horizontal">
            <a-form-item label="类型" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
                <a-tag color="purple">{{ currentSelect.type }}</a-tag>
            </a-form-item>
            <a-form-item label="id" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
                <a-input :value="currentSelect.id" disabled />
            </a-form-item>
            <a-form-item label="名称" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
                <a-input placeholder="请输入节点名称" :value="currentSelect.nodeName" @change="nodeNameChange" />
            </a-form-item>
        </a-form>
    <!-- </template> -->
    <!-- <template v-else-if="currentSelect.type == 'event'"> -->
        <a-form layout="horizontal">
            <a-form-item label="类型" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
                <a-tag color="purple">{{ currentSelect.type }}</a-tag>
            </a-form-item>
            <a-form-item label="id" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
                <a-input :value="currentSelect.id" disabled />
            </a-form-item>
            <a-form-item label="名称" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
                <a-input placeholder="请输入节点名称" :value="currentSelect.nodeName" @change="nodeNameChange" />
            </a-form-item>
        </a-form>
    <!-- </template> -->
    <!-- <template v-else-if="currentSelect.type == 'gateway'"> -->
        <a-form layout="horizontal">
            <a-form-item label="类型" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
                <a-tag color="purple">{{ currentSelect.type }}</a-tag>
            </a-form-item>
            <a-form-item label="id" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
                <a-input :value="currentSelect.id" disabled />
            </a-form-item>
            <a-form-item label="名称" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
                <a-input placeholder="请输入节点名称" :value="currentSelect.nodeName" @change="nodeNameChange" />
            </a-form-item>
        </a-form>
    <!-- </template> -->


    </div>
</template>

<script>
export default {
    name: "OtherAttr",// freedom 
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