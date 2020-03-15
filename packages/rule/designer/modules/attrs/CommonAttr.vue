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

        <!-- <div>描述<input id="currentSelect.detail.desc" type="text" :value="currentSelect.detail.desc" @change="addAttr"/>
        </div>
        <div>信息<input id="currentSelect.tmpmsgddd" type="text" :value="currentSelect.tmpmsgddd" @change="addAttr"/>
        </div> -->
        
        <a-form-item label="规则描述" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input id="currentSelect.detail" placeholder="请输入" v-model="currentSelect.detail" type="textarea"/>
        </a-form-item>
        <!-- <a-form-item label="模式" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input id="currentSelect.atype" placeholder="请输入模式（1：规则详细设置  2：表达式设置）" v-model="currentSelect.atype" />
        </a-form-item> -->
        <a-form-item label="规则条件" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input id="currentSelect.match_condition" placeholder="请输入" v-model="currentSelect.match_condition" type="textarea"/>
        </a-form-item>
        <a-form-item label="规则动作" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input id="currentSelect.rule_content" placeholder="请输入" v-model="currentSelect.rule_content" type="textarea"/>
        </a-form-item>
        <!-- <a-form-item label="规则执行动作" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input id="currentSelect.action" placeholder="规则执行动作（1：必须满足 2：满足跳过后面的验证 3：不满足跳过，只要后面有规则满足）" v-model="currentSelect.action" />
        </a-form-item>
        <a-form-item label="规则优先级" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input id="currentSelect.level" placeholder="请输入" v-model="currentSelect.level" />
        </a-form-item>
        <a-form-item label="是否含有特殊规则" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input id="currentSelect.has_special_rule" placeholder="请输入" v-model="currentSelect.has_special_rule" />
        </a-form-item> -->
        
        <a-form-item label="类型" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" v-if="show">
            <a-select v-model="currentSelect.card_node_type" v-decorator="['currentSelect.card_node_type', {rules: [{required: true, message: '请选择类型'}]}]" @change="setType">
                <a-select-option value="N">空维度</a-select-option>
                <a-select-option value="D">分组维度</a-select-option>
                <a-select-option value="W">字段维度</a-select-option>
            </a-select>
        </a-form-item>

       <!--  <a-form-item label="状态" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input id="currentSelect.status" placeholder="请输入" v-model="currentSelect.status" />
        </a-form-item> -->
        
    </a-form>
</template>

<script>
export default {
    name: "CommonAttr",
    props: ['currentSelect', 'formItemLayout','ruleData'],
    components: {
        
    },
    data(){
        return{
            show:false
        }
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

        },
        setType(v){
            
        }
    }
}
</script>