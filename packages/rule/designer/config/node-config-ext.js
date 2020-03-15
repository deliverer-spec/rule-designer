export const nodesExtends = [
	{
    type: 'start',
    total_score: '',
		params: []
	},
	{
		type: 'common',
		detail: '',
		model: '1',
		match_condition: '',
		rule_content: '',
		action: '0',
		level: '1',
    has_special_rule: '0',
    card_node_type: '',
		status: '0'
	},
	{
		type: 'block',
		classname: ''
	},
	{
    type: 'data',
    datatype: '',
    sql: '',
    datasource: '',
    resturl: '',
    cachekey: '',
    intfname: '',
		datas: []
	},
	{
		type: 'child',
		childcode: '',
    childname: '',
    version: ''
	},
	{
		type: 'temp',
		name: "defaultvalue",
		desc: null,
		detail:{
			name: '',
			id: undefined,//生成时会被忽略该字段
			desc: '测试数据结构'
		}
	},
];

export const paramColumns = [
    {
      title: '字段',
      dataIndex: 'colum',
      width: '25%',
      scopedSlots: { customRender: 'colum' },
    },
    {
      title: '字段名',
      dataIndex: 'colname',
      width: '25%',
      scopedSlots: { customRender: 'colname' },
    },
    {
      title: '数据类型',
      dataIndex: 'coltype',
      width: '25%',
      scopedSlots: { customRender: 'coltype' },
    },
    {
      title: '默认值',
      dataIndex: 'defvaule',
      width: '20%',
      scopedSlots: { customRender: 'defvaule' },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: { customRender: 'operation' },
    },
  ];

export const paramColumnsList = ['colum', 'colname', 'coltype', 'defvaule'];


export const datasColumns = [
    {
      title: '字段',
      dataIndex: 'colum',
      width: '25%',
      scopedSlots: { customRender: 'colum' },
    },
    {
      title: '字段名',
      dataIndex: 'colname',
      width: '25%',
      scopedSlots: { customRender: 'colname' },
    },
    {
      title: '数据类型',
      dataIndex: 'coltype',
      width: '25%',
      scopedSlots: { customRender: 'coltype' },
    },
    {
      title: '默认值',
      dataIndex: 'defvaule',
      width: '20%',
      scopedSlots: { customRender: 'defvaule' },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: { customRender: 'operation' },
    },
  ];

export const datasColumnsList = ['colum', 'colname', 'coltype', 'defvaule'];
//撤销数组
export const UNDOARR = [];
//UNDOARR.push(parent.getCurrentFlowDoc());
//做法是每一个动作都存储一遍数据

//重做数组
export const REDOARR = [];
//initFlowCharts(REDOARR.pop());
//重做是弹出数据重新完整绘制
