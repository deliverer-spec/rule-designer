<template>
	<!-- 画布区域 -->
	<div style="width: 100%; height: 100%; position: relative;"> <!-- 为了把后面两个元素固定增加的dev 临时方案 -->
		
		<div style="width: 100%; height: 100%; overflow: scroll; position: relative;">
			<div v-if="container.auxiliaryLine.isOpen && container.auxiliaryLine.isShowXLine" class="auxiliary-line-x" :style="{ top: auxiliaryLinePos.y + 'px' }"></div>
			<div v-if="container.auxiliaryLine.isOpen && container.auxiliaryLine.isShowYLine" class="auxiliary-line-y" :style="{ left: auxiliaryLinePos.x + 'px' }"></div>
			<div id="ruleContainer" class="rule-container width: 100%; height: 100%;" 
				:class="{ grid: ruleData.config.showGrid, zoomIn: currentTool.type == 'zoom-in', zoomOut: currentTool.type == 'zoom-out', canScale: container.scaleFlag, canDrag: container.dragFlag, canMultiple: rectangleMultiple.flag }"
				:style="{ top: '0px', left: '0px', transform: 'scale(' + container.scale + ')',
				transformOrigin: container.scaleOrigin.x + 'px ' + container.scaleOrigin.y + 'px' }"
				@click.stop="containerHandler" 
				@mousedown="mousedownHandler"
				@mousemove="mousemoveHandler"
				@mouseup="mouseupHandler"
				@mousewheel="scaleContainer"
				@DOMMouseScroll="scaleContainer"
				@contextmenu="showContainerContextMenu">
				<rule-node class="rule-node"
					v-for="(node, index) in ruleData.nodeList"
					:key="index"
					:node="node"
					:plumb="plumb"
					:select.sync="currentSelect"
					:selectGroup.sync="currentSelectGroup"
					:currentTool="currentTool"
					@showNodeContextMenu="showNodeContextMenu"
					@isMultiple="isMultiple"
					@updateNodePos="updateNodePos"
					@alignForLine="alignForLine"
					@hideAlignLine="hideAlignLine">
				</rule-node>
				<div class="rectangle-multiple" v-if="rectangleMultiple.flag && rectangleMultiple.multipling"
					:style="{ top: rectangleMultiple.position.top + 'px', left: rectangleMultiple.position.left + 'px', width: rectangleMultiple.width + 'px', height: rectangleMultiple.height + 'px' }">
				</div>
			</div>
			<!-- 右键属性 -->
			<vue-context-menu 
				:contextMenuData="containerContextMenuData" 
				@ruleInfo="ruleInfo" 
				@paste="paste"
				@selectAll="selectAll"
				@saveRule="saveRule"
				@verticaLeft="verticaLeft"
				@verticalCenter="verticalCenter"
				@verticalRight="verticalRight"
				@levelUp="levelUp"
				@levelCenter="levelCenter"
				@levelDown="levelDown"
				@addRemark="addRemark">
			</vue-context-menu>
			<vue-context-menu 
				:contextMenuData="nodeContextMenuData" 
				@copyNode="copyNode" 
				@deleteNode="deleteNode">
			</vue-context-menu>
		</div>
		<div class="container-scale">
			缩放倍数：{{ container.scaleShow }}%
		</div>
		<div class="mouse-position">
			x: {{ mouse.position.x }}, y: {{ mouse.position.y }}
		</div>
	</div>
</template>

<script>
	import { ruleConfig } from '../config/args-config.js'
	import $ from 'jquery'
	import 'jquery-ui/ui/widgets/draggable'
	import 'jquery-ui/ui/widgets/droppable'
	import 'jquery-ui/ui/widgets/resizable'
	import { RDUtils } from '../util/RDUtils.js'
	import RuleNode from './RuleNode'

	// $('.rule-node').resizable({
    //   resize: function (event, ui) {
    //     jsPlumb.repaint(ui.helper)
    //   }
    // })

	export default {
		props: ['browserType', 'ruleData', 'plumb', 'select', 'selectGroup', 'currentTool'],
		components: {
			// jsplumb: this.plumb,
			RuleNode
		},
		mounted () {
			this.initRuleArea();
		},
		data () {
			return {
				ctx: null,
				currentSelect: this.select,
				currentSelectGroup: this.selectGroup,
				container: {
					pos: {
						top: 0,
						left: 0
					},
					dragFlag: false,
					draging: false,
					scale: ruleConfig.defaultStyle.containerScale.init,
					scaleFlag: false,
					scaleOrigin: {
						x: 0, y: 0
					},
					scaleShow: RDUtils.mul(ruleConfig.defaultStyle.containerScale.init, 100),
					auxiliaryLine: {
						isOpen: ruleConfig.defaultStyle.isOpenAuxiliaryLine,
						isShowXLine: false,
						isShowYLine: false,
						controlFnTimesFlag: true
					}
				},
				auxiliaryLinePos: {
					x: 0, y: 0
				},
				mouse: {
					position: {
						x: 0, y: 0
					},
					tempPos: {
						x: 0, y: 0
					}
				},
				rectangleMultiple: {
					flag: false,
					multipling: false,
					position: {
						top: 0, left: 0
					},
					height: 0,
					width: 0
				},
				containerContextMenuData: ruleConfig.contextMenu.container,
				nodeContextMenuData: ruleConfig.contextMenu.node,
				tempLinkId: '',
				clipboard: []
			}
		},
		methods: {
			initRuleArea () {
				const that = this;
				that.ctx = document.getElementById('ruleContainer').parentNode;
				$('.rule-container').droppable({
					accept: function(t) {
						if (t[0].className.indexOf('node-item') != -1) {
							let event = window.event || 'firefox';
							if (that.ctx.contains(event.srcElement) || event == 'firefox') {
								return true;
							}
						}
						return false;
					},
					hoverClass: 'rule-container-active',
					drop: function(event, ui) {
						let belongto = ui.draggable.attr('belongto');
						let type = ui.draggable.attr('type');
						
						that.$emit('changeToDrag');
						
						that.$emit('findNodeConfig', belongto, type, node => {
							if (!node) {
								that.$message.error('未知的节点类型！');
								return;
							}
							// console.log(node)
							that.addNewNode(node);
						});
					}
				});
			},
			mousedownHandler (e) {
				const that = this;
				
				let event = window.event || e;
				
				if (event.button == 0) {
					if (that.container.dragFlag) {
						that.mouse.tempPos = that.mouse.position;
						that.container.draging = true;
					}
					
					that.currentSelectGroup = [];
					if (that.rectangleMultiple.flag) {
						that.mouse.tempPos = that.mouse.position;
						that.rectangleMultiple.multipling = true;
					}
				}
			},
			mousemoveHandler (e) {
				const that = this;
				
				let event = window.event || e;
				
				if (event.target.id == 'ruleContainer') {
					that.mouse.position = {
						x: event.offsetX,
						y: event.offsetY
					};
				} else {
					let cn = event.target.className;
					let tn = event.target.tagName;
					if (cn != 'lane-text' && cn != 'lane-text-div' && tn != 'svg' && tn != 'path' && tn != 'I') {
						that.mouse.position.x = event.target.offsetLeft + event.offsetX;
						that.mouse.position.y = event.target.offsetTop + event.offsetY;
					}
				}
				if (that.container.draging) {
					// 这个方法会导致起点对不齐
					// let nTop = that.container.pos.top + (that.mouse.position.y - that.mouse.tempPos.y);
					// let nLeft = that.container.pos.left + (that.mouse.position.x - that.mouse.tempPos.x);
					// if (nTop >= 0) nTop = 0;
					// if (nLeft >= 0) nLeft = 0;
					// that.container.pos = {
					// 	top: nTop,
					// 	left: nLeft
					// }
				}
				if (that.rectangleMultiple.multipling) {
					let h = that.mouse.position.y - that.mouse.tempPos.y;
					let w = that.mouse.position.x - that.mouse.tempPos.x;
					let t = that.mouse.tempPos.y;
					let l = that.mouse.tempPos.x;
					if (h >= 0 && w < 0) {
						w = -w;
						l -= w;
					} else if (h < 0 && w >= 0) {
						h = -h;
						t -= h;
					} else if (h < 0 && w < 0) {
						h = -h;
						w = -w;
						t -= h;
						l -= w;
					}
					that.rectangleMultiple.height = h;
					that.rectangleMultiple.width = w;
					that.rectangleMultiple.position.top = t;
					that.rectangleMultiple.position.left = l;
				}
			},
			mouseupHandler () {
				const that = this;
				
				if (that.container.draging) that.container.draging = false;
				if (that.rectangleMultiple.multipling) {
					that.judgeSelectedNode();
					that.rectangleMultiple.multipling = false;
					that.rectangleMultiple.width = 0;
					that.rectangleMultiple.height = 0;
				}
			},
			judgeSelectedNode () {
				const that = this;
				
				let ay = that.rectangleMultiple.position.top;
				let ax = that.rectangleMultiple.position.left;
				let by = ay + that.rectangleMultiple.height;
				let bx = ax + that.rectangleMultiple.width;
				
				let nodeList = that.ruleData.nodeList;
				nodeList.forEach(function(node) {//, index  the index dosnt use
					if (node.y >= ay && node.x >= ax && node.y <= by && node.x <= bx) {
						that.plumb.addToDragSelection(node.id);
						that.currentSelectGroup.push(node);
					}
				});
			},
			scaleContainer (e) {
				const that = this;
				
				let event = window.event || e;
				
				if (that.container.scaleFlag) {
					if (that.browserType == 2) {
						if (event.detail < 0) {
							that.enlargeContainer();
						} else {
							that.narrowContainer();
						}
					} else {
						if (event.deltaY < 0) {
							that.enlargeContainer();
						} else if (that.container.scale) {
							that.narrowContainer();
						}
					}
				}
			},
			enlargeContainer () {
				const that = this;
				that.container.scaleOrigin.x = that.mouse.position.x;
				that.container.scaleOrigin.y = that.mouse.position.y;
				let newScale = RDUtils.add(that.container.scale, ruleConfig.defaultStyle.containerScale.onceEnlarge);
				if (newScale <= ruleConfig.defaultStyle.containerScale.max) {
					that.container.scale = newScale;
					that.container.scaleShow = RDUtils.mul(that.container.scale, 100);
					that.plumb.setZoom(that.container.scale);
				}
			},
			narrowContainer () {
				const that = this;
				that.container.scaleOrigin.x = that.mouse.position.x;
				that.container.scaleOrigin.y = that.mouse.position.y;
				let newScale = RDUtils.sub(that.container.scale, ruleConfig.defaultStyle.containerScale.onceNarrow);
				if (newScale >= ruleConfig.defaultStyle.containerScale.min) {
					that.container.scale = newScale;
					that.container.scaleShow = RDUtils.mul(that.container.scale, 100);
					that.plumb.setZoom(that.container.scale);
				}
			},
			showContainerContextMenu (e) {
				let event = window.event || e;
				
				event.preventDefault();
				$('.vue-contextmenuName-node-menu').css('display', 'none');
				$('.vue-contextmenuName-link-menu').css('display', 'none');
				this.selectContainer();
				let x = event.clientX;
				let y = event.clientY;
				this.containerContextMenuData.axis = { x, y };
			},
			showNodeContextMenu (e) {
				let event = window.event || e;
				
				event.preventDefault();
				$('.vue-contextmenuName-rule-menu').css('display', 'none');
				$('.vue-contextmenuName-link-menu').css('display', 'none');
				let x = event.clientX;
				let y = event.clientY;
				this.nodeContextMenuData.axis = { x, y };
			},
			ruleInfo () {
				const that = this;
				
				let nodeList = that.ruleData.nodeList;
				let linkList = that.ruleData.linkList;
				alert('当前规则图中有 ' + nodeList.length + ' 个节点，有 ' + linkList.length + ' 条连线。');
			},
			paste () {
				const that = this;
				let dis = 0;
				that.clipboard.forEach(function(node) {//, index  the index dosnt use
					let newNode = Object.assign({}, node);
					newNode.id = newNode.type + '-' + RDUtils.getId();
					let nodePos = that.computeNodePos(that.mouse.position.x + dis, that.mouse.position.y + dis);
					newNode.x = nodePos.x;
					newNode.y = nodePos.y;
					dis += 20;
					that.ruleData.nodeList.push(newNode);
				});
			},
			selectAll () {
				const that = this;
				that.ruleData.nodeList.forEach(function(node) {//, index  the index dosnt use
					that.plumb.addToDragSelection(node.id);
					that.currentSelectGroup.push(node);
				});
			},
			saveRule () {
				this.$emit('saveRule');
			},
			checkAlign () {
				if (this.currentSelectGroup.length < 2) {
					this.$message.error('请选择至少两个节点！');
					return false;
				}
				return true;
			},
			verticaLeft () {
				const that = this;
				
				if (!that.checkAlign()) return;
				let nodeList = that.ruleData.nodeList;
				let selectGroup = that.currentSelectGroup;
				let baseX = selectGroup[0].x;
				let baseY = selectGroup[0].y;
				for (let i = 1; i < selectGroup.length; i++) {
					baseY = baseY + selectGroup[i - 1].height + ruleConfig.defaultStyle.alignSpacing.vertical;
					let f = nodeList.filter(n => n.id == selectGroup[i].id)[0];
					f.tx = baseX;
					f.ty = baseY;
					that.plumb.animate(selectGroup[i].id, { top: baseY, left: baseX }, {
						duration: ruleConfig.defaultStyle.alignDuration,
						complete: function() {
							f.x = f.tx;
							f.y = f.ty;
						}
					});
				}
			},
			verticalCenter () {
				const that = this;
				
				if (!that.checkAlign()) return;
				let nodeList = that.ruleData.nodeList;
				let selectGroup = that.currentSelectGroup;
				let baseX = selectGroup[0].x;
				let baseY = selectGroup[0].y;
				let firstX = baseX;
				for (let i = 1; i < selectGroup.length; i++) {
					baseY = baseY + selectGroup[i - 1].height + ruleConfig.defaultStyle.alignSpacing.vertical;
					baseX = firstX + RDUtils.div(selectGroup[0].width, 2) - RDUtils.div(selectGroup[i].width, 2);
					let f = nodeList.filter(n => n.id == selectGroup[i].id)[0];
					f.tx = baseX;
					f.ty = baseY;
					that.plumb.animate(selectGroup[i].id, { top: baseY, left: baseX }, {
						duration: ruleConfig.defaultStyle.alignDuration,
						complete: function() {
							f.x = f.tx;
							f.y = f.ty;
						}
					});
				}
			},
			verticalRight () {
				const that = this;
				
				if (!that.checkAlign()) return;
				let nodeList = that.ruleData.nodeList;
				let selectGroup = that.currentSelectGroup;
				let baseX = selectGroup[0].x;
				let baseY = selectGroup[0].y;
				let firstX = baseX;
				for (let i = 1; i < selectGroup.length; i++) {
					baseY = baseY + selectGroup[i - 1].height + ruleConfig.defaultStyle.alignSpacing.vertical;
					baseX = firstX + selectGroup[0].width - selectGroup[i].width;
					let f = nodeList.filter(n => n.id == selectGroup[i].id)[0];
					f.tx = baseX;
					f.ty = baseY;
					that.plumb.animate(selectGroup[i].id, { top: baseY, left: baseX }, {
						duration: ruleConfig.defaultStyle.alignDuration,
						complete: function() {
							f.x = f.tx;
							f.y = f.ty;
						}
					});
				}
			},
			levelUp () {
				const that = this;
				
				if (!that.checkAlign()) return;
				let nodeList = that.ruleData.nodeList;
				let selectGroup = that.currentSelectGroup;
				let baseX = selectGroup[0].x;
				let baseY = selectGroup[0].y;
				for (let i = 1; i < selectGroup.length; i++) {
					baseX = baseX + selectGroup[i - 1].width + ruleConfig.defaultStyle.alignSpacing.level;
					let f = nodeList.filter(n => n.id == selectGroup[i].id)[0];
					f.tx = baseX;
					f.ty = baseY;
					that.plumb.animate(selectGroup[i].id, { top: baseY, left: baseX }, {
						duration: ruleConfig.defaultStyle.alignDuration,
						complete: function() {
							f.x = f.tx;
							f.y = f.ty;
						}
					});
				}
			},
			levelCenter () {
				const that = this;
				
				if (!that.checkAlign()) return;
				let nodeList = that.ruleData.nodeList;
				let selectGroup = that.currentSelectGroup;
				let baseX = selectGroup[0].x;
				let baseY = selectGroup[0].y;
				let firstY = baseY;
				for (let i = 1; i < selectGroup.length; i++) {
					baseY = firstY + RDUtils.div(selectGroup[0].height, 2) - RDUtils.div(selectGroup[i].height, 2);
					baseX = baseX + selectGroup[i - 1].width + ruleConfig.defaultStyle.alignSpacing.level;
					let f = nodeList.filter(n => n.id == selectGroup[i].id)[0];
					f.tx = baseX;
					f.ty = baseY;
					that.plumb.animate(selectGroup[i].id, { top: baseY, left: baseX }, {
						duration: ruleConfig.defaultStyle.alignDuration,
						complete: function() {
							f.x = f.tx;
							f.y = f.ty;
						}
					});
				}
			},
			levelDown () {
				const that = this;
				
				if (!that.checkAlign()) return;
				let nodeList = that.ruleData.nodeList;
				let selectGroup = that.currentSelectGroup;
				let baseX = selectGroup[0].x;
				let baseY = selectGroup[0].y;
				let firstY = baseY;
				for (let i = 1; i < selectGroup.length; i++) {
					baseY = firstY + selectGroup[0].height - selectGroup[i].height;
					baseX = baseX + selectGroup[i - 1].width + ruleConfig.defaultStyle.alignSpacing.level;
					let f = nodeList.filter(n => n.id == selectGroup[i].id)[0];
					f.tx = baseX;
					f.ty = baseY;
					that.plumb.animate(selectGroup[i].id, { top: baseY, left: baseX }, {
						duration: ruleConfig.defaultStyle.alignDuration,
						complete: function() {
							f.x = f.tx;
							f.y = f.ty;
						}
					});
				}
			},
			addRemark () {
				// const that = this;
				alert('添加备注(待完善)...');
			},
			copyNode () {
				const that = this;
				
				that.clipboard = [];
				if (that.currentSelectGroup.length > 0) {
					that.clipboard = Object.assign([], that.currentSelectGroup);
				} else if (that.currentSelect.id) {
					that.clipboard.push(that.currentSelect);
				}
			},
			deleteNode () {
				const that = this;
				that.$emit('deleteNode');
				that.selectContainer();
			},
			addNewNode (node) {//初始化节点信息
				const that = this;
				// console.log(that.ruleData)
				let x = that.mouse.position.x;
				let y = that.mouse.position.y;
				let nodePos = that.computeNodePos(x, y);
				x = nodePos.x;
				y = nodePos.y;
				
				let newNode = Object.assign({}, node);
				// console.log(newNode)
				newNode.id = newNode.type + '-' + RDUtils.getId();
				newNode.height = 50;
				if (newNode.type == 'start' || newNode.type == 'end' || 
					newNode.type == 'event' || newNode.type == 'gateway') {
					newNode.x = x - 25;
					newNode.width = 50;
				} else {
					newNode.x = x - 60;
					newNode.width = 120;
				}
				newNode.y = y - 25;
				if (newNode.type == 'x-lane') {
					newNode.height = 200;
					newNode.width = 600;
				} else if (newNode.type == 'y-lane') {
					newNode.height = 600;
					newNode.width = 200;
				}
				that.ruleData.nodeList.push(newNode);
			},
			computeNodePos (x, y) {
				const pxx = ruleConfig.defaultStyle.alignGridPX[0];
				const pxy = ruleConfig.defaultStyle.alignGridPX[1];
				if (x % pxx) x = pxx - (x % pxx) + x;
				if (y % pxy) y = pxy - (y % pxy) + y;
				return {
					x: x,
					y: y
				};
			},
			containerHandler () {
				const that = this;
				
				that.selectContainer();
				let toolType = that.currentTool.type;
				if (toolType == 'zoom-in') {
					that.enlargeContainer();
				} else if (toolType == 'zoom-out') {
					that.narrowContainer();
				}
			},
			selectContainer () {//失去选择焦点后触发
				this.currentSelect = {};
				this.$emit('getShortcut');
			},
			isMultiple (callback) {
				callback(this.rectangleMultiple.flag);
			},
			updateNodePos () {
				const that = this;
				
				let nodeList = that.ruleData.nodeList;
				that.currentSelectGroup.forEach(function(node) {//, index  the index dosnt use
					let l = parseInt($('#' + node.id).css('left'));
					let t = parseInt($('#' + node.id).css('top'));
					let f = nodeList.filter(n => n.id == node.id)[0];
					f.x = l;
					f.y = t;
				});
			},
			alignForLine (e) {
				const that = this;
				
				if (that.selectGroup.length > 1) return;
				if (that.container.auxiliaryLine.controlFnTimesFlag) {
					let elId = e.el.id;
					let nodeList = that.ruleData.nodeList;
					nodeList.forEach(function(node) {//, index  the index dosnt use
						if (elId != node.id) {
							let dis = ruleConfig.defaultStyle.showAuxiliaryLineDistance,
								elPos = e.pos,
								elH = e.el.offsetHeight,
								elW = e.el.offsetWidth,
								disX = elPos[0] - node.x,
								disY = elPos[1] - node.y;
							if ((disX >= -dis && disX <= dis) || ((disX + elW) >= -dis && (disX + elW) <= dis)) {
								that.container.auxiliaryLine.isShowYLine = true;
								that.auxiliaryLinePos.x = node.x + that.container.pos.left;
								let nodeMidPointX = node.x + (node.width / 2);
								if (nodeMidPointX == (elPos[0] + (elW / 2))) {
									that.auxiliaryLinePos.x = nodeMidPointX + that.container.pos.left;
								}
							}
							if ((disY >= -dis && disY <= dis) || ((disY + elH) >= -dis && (disY + elH) <= dis)) {
								that.container.auxiliaryLine.isShowXLine = true;
								that.auxiliaryLinePos.y = node.y + that.container.pos.top;
								let nodeMidPointY = node.y + (node.height / 2);
								if (nodeMidPointY == (elPos[1] + (elH / 2))) {
									that.auxiliaryLinePos.y = nodeMidPointY + that.container.pos.left;
								}
							}
						}
					});
					that.container.auxiliaryLine.controlFnTimesFlag = false;
					setTimeout(function() {
						that.container.auxiliaryLine.controlFnTimesFlag = true;
					}, 200);
				}
			},
			hideAlignLine () {
				if (this.container.auxiliaryLine.isOpen) {
					this.container.auxiliaryLine.isShowXLine = false;
					this.container.auxiliaryLine.isShowYLine = false;
				}
			}
		},
		watch: {
			select (val) {
				this.currentSelect = val;
				if (this.tempLinkId != '') {
					$('#' + this.tempLinkId).removeClass('link-active');
					this.tempLinkId = '';
				}
				if (this.currentSelect.type == 'link') {
					this.tempLinkId = this.currentSelect.id;
					$('#' + this.currentSelect.id).addClass('link-active');
				}
			},
			currentSelect: {//这个val的值从哪里来的？
				handler (val) {
					this.$emit('update:select', val);
				},
				deep: true
			},
			selectGroup (val) {
				this.currentSelectGroup = val;
				if (this.currentSelectGroup.length <= 0) this.plumb.clearDragSelection();
			},
			currentSelectGroup: {
				handler (val) {
					this.$emit('update:selectGroup', val);
				},
				deep: true
			},
			ruleData:{
				handler (val) {
					// debugger
				},
				deep: true
			}
		}
	}
</script>

<style lang="scss">
	@import '../style/rule-area.scss'
</style>
