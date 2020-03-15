<template>
	<div>
		<a-tabs size="small" defaultActiveKey="rule-attr" :activeKey="activeKey">
			<a-tab-pane key="rule-attr">
				<span slot="tab">
					<a-icon type="cluster" />
					规则属性
				</span>
				<desi-attr :ruleData="ruleData"
							:formItemLayout="formItemLayout">

				</desi-attr>
			</a-tab-pane>
			<a-tab-pane key="node-attr">
				<span slot="tab">
					<a-icon type="profile" />
					节点属性
				</span>
				<template v-if="currentSelect.type == 'start'">
					<start-attr :currentSelect="currentSelect"
								:formItemLayout="formItemLayout"
								:ruleData="ruleData"
								@nodeNameChange="nodeNameChange"
								
								>
					</start-attr>
				</template>
				<template v-if="currentSelect.type == 'common'">
					<common-attr :currentSelect="currentSelect"
								:formItemLayout="formItemLayout"
								:ruleData="ruleData"
								@nodeNameChange="nodeNameChange"
								>
					</common-attr>
				</template>
				<template v-if="currentSelect.type == 'block'">
					<block-attr :currentSelect="currentSelect"
								:formItemLayout="formItemLayout"
								@nodeNameChange="nodeNameChange"
								>
					</block-attr>
				</template>
				<template v-else-if="currentSelect.type == 'data'">
					<data-attr :currentSelect="currentSelect"
								:formItemLayout="formItemLayout"
								@nodeNameChange="nodeNameChange"
								>
					</data-attr>
				</template>
				<template v-else-if="currentSelect.type == 'child'">
					<child-attr :currentSelect="currentSelect"
								:formItemLayout="formItemLayout"
								@nodeNameChange="nodeNameChange"
								>
					</child-attr>
				</template>
				<!-- 泳道 -->
				<template v-else-if="currentSelect.type == 'x-lane' || currentSelect.type == 'y-lane'">
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
				</template>
			</a-tab-pane>
			<a-tab-pane key="link-attr">
				<span slot="tab">
					<a-icon type="branches" />
					连线属性
				</span>
				<line-attr :currentSelect="currentSelect"
							:formItemLayout="formItemLayout"
							:ruleData="ruleData"
							@linkLabelChange="linkLabelChange">
				</line-attr>
			</a-tab-pane>
		</a-tabs>
	</div>
</template>

<script>
	// import jsplumb from 'jsplumb'
	import { ruleConfig } from '../config/args-config.js'
	import DesiAttr from './attrs/DesiAttr'
	import StartAttr from './attrs/StartAttr'
	import CommonAttr from './attrs/CommonAttr'
	import BlockAttr from './attrs/BlockAttr'
	import DataAttr from './attrs/DataAttr'
	import ChildAttr from './attrs/ChildAttr'
	import LineAttr from './attrs/LineAttr'
	
	export default {
		props: ['plumb', 'ruleData', 'select'],
		components: {
			DesiAttr,StartAttr,CommonAttr,BlockAttr,DataAttr,ChildAttr,LineAttr
		},
		data () {
			return {
				currentSelect: this.select,
				formItemLayout: {
					labelCol: { span: 6 },
					wrapperCol: { span: 16 }
				},
				activeKey: 'rule-attr',
				tmpcomm:''
			}
		},
		methods: {
			nodeNameChange (e) {
				this.currentSelect.nodeName = e.target.value;
			},
			linkLabelChange (e) {
				const that = this;
				let label = e.target.value;
				
				that.currentSelect.label = label;
				let conn = that.plumb.getConnections({
					source: that.currentSelect.sourceId,
					target: that.currentSelect.targetId
				})[0];
				if (label != '') {
					conn.setLabel({
						label: label,
						cssClass: 'linkLabel'
					});
				} else {
					let labelOverlay = conn.getLabelOverlay();
					if (labelOverlay) conn.removeOverlay(labelOverlay.id);
				}
			},
			addAttr(e){
				// var ev=this.evil('this.'+e.target.id);
				// alert(ev)
				//  ev = e.target.value
				//这里的问题应该是  虽然绑定到 attr.vue 页面，但是这个数据的加载是之前确定?  不对，跨组件也是会同步的
				//
			},
			evil(str){
				var Fn = Function;
				return new Fn('return ' + str)();
			},
			checkLable(e){
				// if(!this.evil('this.'+e.target.id)){

				// }
			}
		},
		watch: {
			select (newVal, oldVal) {
				this.currentSelect = newVal;
				if (this.currentSelect.type == 'link') {
					this.activeKey = 'link-attr';
				} else if (!this.currentSelect.type) {
					this.activeKey = 'rule-attr';
				} else {
					this.activeKey = 'node-attr';
				}
			},
			currentSelect: {
				handler (newVal, oldVal) {
					this.$emit('update:select', newVal);
				},
				deep: true
			}
		}
	}
</script>

<style lang="scss">
	@import '../style/rule-attr.scss'
</style>