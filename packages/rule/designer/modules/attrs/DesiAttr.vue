<template>
    <a-form layout="horizontal">
        <a-form-item label="规则集ID" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input :value="ruleData.attr.id" disabled />
        </a-form-item>
        <a-form-item label="规则集名称" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input v-model="ruleData.attr.name" />
        </a-form-item>
        <a-form-item label="规则集编码" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input v-model="ruleData.attr.code" />
        </a-form-item>
        <!-- <a-form-item label="类型" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input v-model="ruleData.attr.type" />
        </a-form-item> -->

        <a-form-item label="类型" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-select v-model="ruleData.attr.ruletype" v-decorator="['ruleData.attr.ruletype', {rules: [{required: true, message: '请选择类型'}]}]" @change="setRuleType">
                <a-select-option value="RSet">规则集</a-select-option>
                <a-select-option value="RTree">规则树</a-select-option>
                <a-select-option value="RCard">评分卡</a-select-option>
                <a-select-option value="RTable">决策表</a-select-option>
            </a-select>
        </a-form-item>

        <a-form-item label="规则集描述" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input v-model="ruleData.attr.descript" type="textarea"/>
        </a-form-item>
    </a-form>
</template>

<script>


export default {
    name: "DesiAttr",
    props: ['ruleData', 'formItemLayout'],
    components: {
        
    },
    mounted(){
        if(this.ruleData.attr.ruletype == ''){
            this.setRuleType('RSet');
        }
    },
    methods: {
        setRuleType(v){
            // console.log(this.ruleData)
            this.ruleData.attr.ruletype = v;
        },
    }
}
</script>