<template>
    <a-form layout="horizontal">
        <a-form-item label="id" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input :value="currentSelect.id" disabled />
        </a-form-item>
        <a-form-item label="源节点" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input :value="currentSelect.sourceId" disabled />
        </a-form-item>
        <a-form-item label="目标节点" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input :value="currentSelect.targetId" disabled />
        </a-form-item>
        <a-form-item label="文本" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input :value="currentSelect.label" @change="linkLabelChange" />
        </a-form-item>
        <a-form-item label="运算关系" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" v-if="relationsShow">
            <a-input v-model="currentSelect.relations" @change="changevalue" />
        </a-form-item>
        <a-form-item label="优先级" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" v-if="priorityShow">
            <a-input v-model="currentSelect.priority" @change="changevalue" />
        </a-form-item>
        <!-- <a-form-item label="是否执行" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" hidden>
            <a-input v-model="currentSelect.execs" />
        </a-form-item> -->
    </a-form>
</template>
<script>
export default {
    name: "LineAttr",
    props: ['currentSelect', 'formItemLayout','ruleData'],
    components: {
        
    },
    data(){
        return{
            relationsShow:true,
            priorityShow:true
        }
    },
    mounted(){
       const aa = this.ruleData.attr.ruletype;
       if(aa=='RCard'){
           this.relationsShow=false;
           this.priorityShow=false;
       }else{
           this.relationsShow=true;
           this.priorityShow=true;
       }
    },
    methods: {
        linkLabelChange(e){
            this.$emit("linkLabelChange", e)
        },
        changevalue(){
            //TODO  label = label + relations + execs
        }
    }
}
</script>