<template>
    <div>
        <a-button class="editable-add-btn" @click="handleAdd">Add</a-button>
            
        <a-table :columns="columns" :dataSource="datas" bordered>
            <template
                v-for="col in datasColumnsList"
                :slot="col"
                slot-scope="text, record, index">
                <div :key="col">
                <a-input
                    v-if="record.editable"
                    style="margin: -5px 0"
                    :value="text"
                    @change="e => handleChange(e.target.value, record.key, col)"
                />
                <template v-else>{{text}}</template>
                </div>
            </template>
            <template slot="operation" slot-scope="text, record, index">
                <div class="editable-row-operations">
                <span v-if="record.editable">
                    <a @click="() => save(record.key)">Save</a>
                    <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(record.key)">
                    <a>Cancel</a>
                    </a-popconfirm>
                </span>
                <span v-else>
                    <a @click="() => edit(record.key)">Edit</a>
                </span>
                </div>
            </template>
            </a-table>
    </div>
</template>
<script>
/**
 * TODO  需要增加某个时候只能有一条编辑记录 ，离开的时候需要自动保存 
 */
    import { datasColumns, datasColumnsList } from '../../config/node-config-ext.js'
    const datas =[];
    // const columns = paramColumns;
    export default {
        name: 'DatasRow',
        props: ['currentSelect'],
        data() {
            this.cacheData = datas.map(item => ({ ...item }));//不明白这个缓存数据的目的
            return {
                datas: this.currentSelect.datas,
                columns : datasColumns,
                datasColumnsList
            };
        },
        mounted(){
            this.cacheData = this.datas.map(item => ({ ...item }));//不明白这个缓存数据的目的
        },
        methods: {
            handleAdd() {
                const { datas, columns } = this;
                const count = this.getCount(datas);
                const newData = {
                    key: count,
                };
                this.datas = [...datas, newData];
                this.edit(newData.key);//激活编辑
            },
            getCount(datas){
                var count = datas.length;
                while(true){
                    const target = datas.filter(item => count === item.key)[0];
                    if(target){
                        count = count + 1;
                    }else{
                        return count;
                    }
                }
            },
            handleChange(value, key, column) {
                const newData = [...this.datas];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                target[column] = value;
                this.datas = newData;
                }
            },
            edit(key) {
                const newData = [...this.datas];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target.editable = true;
                    this.datas = newData;
                }
            },
            save(key) {
                const newData = [...this.datas];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    delete target.editable;
                    this.datas = newData;
                    this.cacheData = newData.map(item => ({ ...item }));
                }
                this.currentSelect.datas = this.datas;
            },
            cancel(key) {
                // debugger
                // const newData = [...this.datas];
                // const target = newData.filter(item => key === item.key)[0];
                // if (target) {
                //     Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
                //     delete target.editable;
                //     this.datas = newData;
                // }
                const newData = [...this.datas];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    delete target.editable;
                }
                this.datas = newData.filter(item => item.key != key);
                this.currentSelect.datas = this.datas;
            },
        },
    };
</script>
<style scoped>
  .editable-row-operations a {
    margin-right: 8px;
  }
</style>
