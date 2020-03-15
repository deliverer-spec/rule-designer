<!-- #### 可编辑行 带行编辑功能的表格。 #### Editable Rows Table with editable rows.
 -->
<template>
    <div>
        <a-button class="editable-add-btn" @click="handleAdd">Add</a-button>
            
        <a-table :columns="columns" :dataSource="datas" bordered>
            <template
                v-for="col in ['name', 'age', 'address']"
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
  const columns = [
    {
      title: 'name',
      dataIndex: 'name',
      width: '25%',
      scopedSlots: { customRender: 'name' },
    },
    {
      title: 'age',
      dataIndex: 'age',
      width: '25%',
      scopedSlots: { customRender: 'age' },
    },
    {
      title: 'address',
      dataIndex: 'address',
      width: '40%',
      scopedSlots: { customRender: 'address' },
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      scopedSlots: { customRender: 'operation' },
    },
  ];

  const datas = [];
//   for (let i = 0; i < 1; i++) {
//     data.push({
//       key: i.toString(),
//       name: `Edrward ${i}`,
//       age: 32,
//       address: `London Park no. ${i}`,
//     });
//   }
  export default {
      name: 'TestRow',
    data() {
      this.cacheData = datas.map(item => ({ ...item }));
      return {
        datas,
        columns,
        count: 0,
      };
    },
    methods: {
    handleAdd() {
        const { count, datas, columns } = this;
        // debugger
        const i = datas.length +1 ;
        const newData = {
            key: count,
            // name: `Edrward ${i}`,
            // age: 32,
            // address: `London Park no. ${i}`,
        };
        this.datas = [...datas, newData];
        edit(newData.key);//激活编辑
        this.count = count + 1;
        // console.log(this.datas)
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
      },
      cancel(key) {
        const newData = [...this.datas];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
          delete target.editable;
          this.datas = newData;
        }
      },
    },
  };
</script>
<style scoped>
  .editable-row-operations a {
    margin-right: 8px;
  }
</style>
