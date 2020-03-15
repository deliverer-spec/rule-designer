<template>
	<div>
		<a-drawer
			title="测试"
			placement="right"
			:width="600"
			:visible="testVisible"
			@close="onClose">
			
			<div>当前的ruleData:</div>
			<json-view 
				:value="ruleData"
				:expand-depth=3
				boxed
				copyable/>
			
			<div style="margin-top: 12px;">暂存:</div>
			<a-textarea :autosize="{ minRows: 10, maxRows: 100 }" :value="ruleDataJson" @change="editruleDataJson" />
			
			<a-divider />
			<a-button @click="tempSave" :style="{ marginRight: '8px' }">暂存</a-button>
			<a-button @click="onLoad" type="primary">加载(暂存中的json数据)</a-button>
		</a-drawer>
	</div>
</template>

<script>
	import JsonView from 'vue-json-viewer'
	import { ruleConfig } from '../config/args-config.js'
	
	export default {
		components: {
			JsonView
		},
		data () {
			return {
				testVisible: false,
				ruleData: null,
				ruleDataJson: ''
			}
		},
		methods: {
			onClose () {
				this.testVisible = false;
			},
			editruleDataJson (e) {
				this.ruleDataJson = e.target.value;
			},
			tempSave () {
				let tempObj = Object.assign({}, this.ruleData);
				tempObj.status = ruleConfig.ruleStatus.SAVE;
				this.ruleDataJson = JSON.stringify(tempObj);
			},
			onLoad () {
				this.$emit('loadRule', this.ruleDataJson);
				this.onClose();
			}
		}
	}
</script>

<style>
</style>