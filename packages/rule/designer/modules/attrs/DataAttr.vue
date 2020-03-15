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
        <a-form-item label="数据来源方式" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-select v-model="currentSelect.datatype" v-decorator="['currentSelect.datatype', {rules: [{required: true, message: '请选择数据来源'}]}]" @change="setDataType">
                <a-select-option value="sql">数据库查询</a-select-option>
                <a-select-option value="reset">REST接口</a-select-option>
                <a-select-option value="cache">缓存</a-select-option>
                <a-select-option value="intf">扩展接口</a-select-option>
            </a-select>
        </a-form-item>
        
        <a-form-item label="数据源" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" v-if="showSql">
            <a-input placeholder="请输入数据源" v-model="currentSelect.datasource"/>
        </a-form-item>
        <a-form-item label="查询语句" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" v-if="showSql">
            <a-input placeholder="请输入查询语句" v-model="currentSelect.sql"  type="textarea"/>
        </a-form-item>
        <a-form-item label="rest接口" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" v-if="showRest">
            <a-input placeholder="请输入rest接口" v-model="currentSelect.resturl" type="textarea"/>
        </a-form-item>
        <a-form-item label="缓存ID" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" v-if="showCache">
            <a-input placeholder="请输入缓存ID" v-model="currentSelect.cachekey"/>
        </a-form-item>
        <a-form-item label="扩展接口" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" v-if="showExeInterface">
            <a-input placeholder="请输入扩展接口" v-model="currentSelect.intfname" type="textarea"/>
        </a-form-item>
        <!-- <a-form-item label="字段列表" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input placeholder="字段列表" :value="currentSelect.columnlist"/>
        </a-form-item> -->
        <!-- 字段，名称，格式化函数，别名 -->

        <datas-row :currentSelect='currentSelect'></datas-row>
    </a-form>
</template>

<script>

import DatasRow from '../edittable/DatasRow'

export default {
    name: "DataAttr",
    props: ['currentSelect', 'formItemLayout'],
    components: {
        DatasRow
    },
    data(){
        return{
            showExeInterface:false,
            showCache:false,
            showRest:false,
            showSql:false
        }
    },
    mounted(){
       const v = this.currentSelect.datatype;
        if(v=="sql"){
            this.showSql=true;
            this.showRest=false;
            this.showCache=false;
            this.showExeInterface=false;
        }else if(v=="reset"){
            this.showSql=false;
            this.showRest=true;
            this.showCache=false;
            this.showExeInterface=false;
        }else if(v=="cache"){
            this.showSql=false;
            this.showRest=false;
            this.showCache=true;
            this.showExeInterface=false;
        }else if(v=="intf"){
            this.showSql=false;
            this.showRest=false;
            this.showCache=false;
            this.showExeInterface=true;
        }
    },
    methods: {
        nodeNameChange(e){
            this.$emit("nodeNameChange", e)
        },
        changevalue(){

        },
        setDataType(v){
            this.currentSelect.datatype=v;
            if(v=="sql"){
                this.showSql=true;
                this.showRest=false;
                this.showCache=false;
                this.showExeInterface=false;
            }else if(v=="reset"){
                this.showSql=false;
                this.showRest=true;
                this.showCache=false;
                this.showExeInterface=false;
            }else if(v=="cache"){
                this.showSql=false;
                this.showRest=false;
                this.showCache=true;
                this.showExeInterface=false;
            }else if(v=="intf"){
                this.showSql=false;
                this.showRest=false;
                this.showCache=false;
                this.showExeInterface=true;
            }
        }
    }
}
</script>