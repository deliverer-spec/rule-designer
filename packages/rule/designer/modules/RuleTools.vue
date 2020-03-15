<template>
    <div>
        <a-tooltip title="选择" placement="bottom">
            <a-button @click="useToDrag" class="header-option-button" size="small" icon="drag"></a-button>
        </a-tooltip>
        <a-tooltip title="保存" placement="bottom">
            <a-button @click="saveRule" class="header-option-button" size="small" icon="save"></a-button>
        </a-tooltip>
        <a-tooltip title="打印" placement="bottom"><!-- 临时功能 -->
            <a-button @click="printRule" class="header-option-button" size="small" icon="save"></a-button>
        </a-tooltip>
        <a-tooltip title="加载" placement="bottom"><!-- 临时方案 -->
            <a-button @click="loadRule" class="header-option-button" size="small" icon="caret-down"></a-button>
        </a-tooltip>
        <a-tooltip title="执行" placement="bottom"><!-- 临时方案 -->
            <a-button @click="execRule" class="header-option-button" size="small" icon="caret-down"></a-button>
        </a-tooltip>
        <a-tooltip title="测试" placement="bottom"><!-- 临时方案 -->
            <a-button @click="testRule" class="header-option-button" size="small" icon="caret-down"></a-button>
        </a-tooltip>
        <a-tooltip title="后端验证" placement="bottom"><!-- 临时方案 -->
            <a-button @click="checkInfo" class="header-option-button" size="small" icon="caret-down"></a-button>
        </a-tooltip>
        <a-tooltip title="连线" placement="bottom">
            <a-button @click="useToConnection" class="header-option-button" size="small" icon="fork"></a-button>
        </a-tooltip>
        <a-tooltip title="生成规则图片" placement="bottom">
            <a-button @click="exportRulePicture" class="header-option-button" size="small" icon="picture"></a-button>
        </a-tooltip>
        <a-popconfirm title="确认要重新绘制吗？" placement="bottom" okText="确认" cancelText="取消" @confirm="clear">
            <a-tooltip title="重新绘制" placement="bottom">
                <a-button class="header-option-button" size="small" icon="delete"></a-button>
            </a-tooltip>
        </a-popconfirm>
        <a-tooltip title="设置" placement="bottom">
            <a-button @click="setting" class="header-option-button" size="small" icon="setting"></a-button>
        </a-tooltip>
        <a-popconfirm 
            title="请选择帮助项：" 
            placement="bottom" 
            okType="default" 
            okText="快捷键大全" 
            cancelText="使用文档" 
            @confirm="shortcutHelper"
            @cancel="usingDoc">
            <a-icon slot="icon" type="question-circle-o" style="color: red" />
            <a-tooltip title="帮助" placement="bottom">
                <a-button class="header-option-button" size="small" icon="book"></a-button>
            </a-tooltip>
        </a-popconfirm>
        <a-tooltip title="放大" placement="bottom">
            <a-button @click="changeToZoomIn" class="header-option-button" size="small" icon="zoom-in"></a-button>
        </a-tooltip>
        <a-tooltip title="缩小" placement="bottom">
            <a-button @click="changeToZoomOut" class="header-option-button" size="small" icon="zoom-out"></a-button>
        </a-tooltip>
        <a-tooltip title="退出" placement="bottom">
            <a-button @click="exit" class="header-option-button" size="small" icon="logout"></a-button>
        </a-tooltip>
        <a-tooltip :title="ruleData.config.showGridText" placement="bottom">
            <a-button 
                @click="toggleShowGrid" 
                class="header-option-button" 
                size="small" 
                :icon="ruleData.config.showGridIcon">
            </a-button>
        </a-tooltip>
        
        <a-modal 
			:title="'Rule设计图_' + ruleData.attr.id + '.png'"
			centered
			width="90%"
			:closable="rulePicture.closable"
			:maskClosable="rulePicture.maskClosable"
			:visible="rulePicture.modalVisible"
			okText="下载到本地"
			cancelText="取消"
			@ok="downLoadRulePicture"
			@cancel="cancelDownLoadRulePicture">
			<div align="center">
				<img :src="rulePicture.url" />
			</div>
		</a-modal>
        <setting-modal ref="settingModal"></setting-modal>
		<shortcut-modal ref="shortcutModal"></shortcut-modal>
    </div>
</template>

<script>
    import { ruleConfig } from '../config/args-config.js'
	import SettingModal from '../modules/SettingModal'
	import ShortcutModal from '../modules/ShortcutModal'
	import UsingDocModal from '../modules/UsingDocModal'
    import { RDUtils } from '../util/RDUtils.js'
    import $ from 'jquery'
	import html2canvas from 'html2canvas'
    import canvg from 'canvg'
    import axios from 'axios'
    import Cookies from 'js-cookie'
    
    export default {
        name: 'ruletools',
        props:['ruleDesigner','ruleData','plumb'],
        components: {
            ruleConfig,
            SettingModal,
            ShortcutModal,
            UsingDocModal,
            html2canvas
        },
        data () {
            return {
                name:'tools',
				currentSelect: this.select,
				currentSelectGroup: this.selectGroup,
                rulePicture: {
                    url: '',
                    modalVisible: false,
                    closable: false,
                    maskClosable: false
                }
            }
        },
        methods:{
            
            getAnchor(){
                if(this.ruleData.attr.ruletype == 'RCard'){
                   return ruleConfig.jsPlumbConfigCard.anchor.default;
                }else{
                    return ruleConfig.jsPlumbConfig.anchor.default
                }
            },
            useToDrag () {
                const that = this;
                // console.log("子组件拖拽")
                that.ruleData.nodeList.forEach(function(node, index) {
                    let f = that.plumb.toggleDraggable(node.id);
                    if (!f) {
                        that.plumb.toggleDraggable(node.id);
                    }
                    if (node.type != 'x-lane' && node.type != 'y-lane') {
                        that.plumb.unmakeSource(node.id);
                        that.plumb.unmakeTarget(node.id);
                    }
                });
            },
            saveRule () {
                const that = this;
                let ruleObj = Object.assign({}, that.ruleData);
                    
                if (!that.checkRule()) return;
                ruleObj.status = ruleConfig.ruleStatus.SAVE;
                let d = JSON.stringify(ruleObj);
                // this.$message.success('保存规则成功！请查看控制台。');
                axios.post('/api/rule/save', 
                    { ruleJson: d},
                    {
                        headers:{'Authorization':RDUtils.getToken()}
                    }
                )
                .then(function (response) {
                    // console.log(response);
                    alert('保存成功')
                })
                .catch(function (error) {
                    console.log(error);
                    alert(error)
                });
                return d;
            },
            printRule(){
                const that = this;
                let ruleObj = Object.assign({}, that.ruleData);
                let d = JSON.stringify(ruleObj);
                console.log(d)
            },
            loadRule(){//demo http://localhost:8087/dr/index.html?id=rule-f38889bcec8b488d858823553eb2190d
                let id = this.ruleData.attr.id;
                this.clear();
                axios.get('/api/rule/load/'+id,{headers:{'Authorization':RDUtils.getToken()}})
                .then(Response => {
                    // console.log(Response.data.data.ruleJson)
                    this.$emit("loadRule", Response.data.data.ruleJson)
                    alert('加载成功')
                })
                .catch(Error => {
                    alert(Error)
                })
                // this.ruleData = {}
            },
            execRule(){
                axios.get('/api/rule/exec/'+this.ruleData.attr.id,{headers:{'Authorization':RDUtils.getToken()}})
                .then(Response => {
                    // console.log(Response)
                    // this.ruleData = Response.
                    alert('执行成功：'+Response.data.data)
                })
                .catch(Error => {
                    alert(Error)
                })
            },
            testRule(){
                axios.get('/api/rule/test/'+this.ruleData.attr.id,{headers:{'Authorization':RDUtils.getToken()}})
                .then(Response => {
                    // console.log(Response)
                    // this.ruleData = Response.data
                    alert('执行成功')
                })
                .catch(Error => {
                    alert(Error)
                })
            },
            checkInfo(){
                const that = this;
                let ruleObj = Object.assign({}, that.ruleData);
                    
                if (!that.checkRule()) return;
                ruleObj.status = ruleConfig.ruleStatus.SAVE;
                let d = JSON.stringify(ruleObj);
                console.log(d);
                // this.$message.success('保存规则成功！请查看控制台。');
                axios.post('/api/rule/check',
                    {ruleJson: d},
                    {
                        headers:{'Authorization':RDUtils.getToken()}
                    }
                )
                .then(function (response) {
                    // console.log(response);
                    alert('成功')
                })
                .catch(function (error) {
                    console.log(error);
                    alert(error)
                });
                return d;
            },
            checkRule () {
                const that = this;
                let nodeList = that.ruleData.nodeList;
                    
                if (nodeList.length <= 0) {
                    this.$message.error('规则图中无任何节点！');
                    return false;
                }
                return true;
            },
            useToConnection() {//启动连线，为所有节点初始化拖拽状态
                const that = this;
                    
                that.ruleData.nodeList.forEach(function(node, index) {
                    let f = that.plumb.toggleDraggable(node.id);
                    if (f) {
                        that.plumb.toggleDraggable(node.id);
                    }
                    if (node.type != 'x-lane' && node.type != 'y-lane') {
                        if(that.ruleData.attr.ruletype == 'RCard'){
                            that.plumb.makeSource(node.id, ruleConfig.jsPlumbConfigCard.makeSourceConfig);
                            that.plumb.makeTarget(node.id, ruleConfig.jsPlumbConfigCard.makeTargetConfig);
                        }else{
                            that.plumb.makeSource(node.id, ruleConfig.jsPlumbConfig.makeSourceConfig);
                            that.plumb.makeTarget(node.id, ruleConfig.jsPlumbConfig.makeTargetConfig);
                        }
                    }
                });
                    
                that.ruleDesigner.currentSelect = {};
                that.ruleDesigner.currentSelectGroup = [];
            },
            exportRulePicture () {// 这个方法没有调好  ruleArea  非父子传值没有增加
                const that = this;
                    
                if (!that.checkRule()) return;
                    
                let $Container = that.ruleDesigner.$refs.ruleArea.$el.children[0],
                    svgElems = $($Container).find('svg[id^="link-"]'),
                    removeArr = [];
                    
                svgElems.each(function(index, svgElem) {
                    let linkCanvas = document.createElement('canvas');
                    let canvasId = 'linkCanvas-' + RDUtils.getId();
                    linkCanvas.id = canvasId;
                    removeArr.push(canvasId);
                        
                    let svgContent = svgElem.outerHTML.trim();
                    canvg(linkCanvas, svgContent);
                    if (svgElem.style.position) {
                        linkCanvas.style.position += svgElem.style.position;
                        linkCanvas.style.left += svgElem.style.left;
                        linkCanvas.style.top += svgElem.style.top;
                    }
                    $($Container).append(linkCanvas);
                });
                    
                let canvasSize = that.ruleDesigner.computeCanvasSize();
                    
                let pbd = ruleConfig.defaultStyle.photoBlankDistance;
                let offsetPbd = RDUtils.div(pbd, 2);
                    
                html2canvas($Container, {
                    width: canvasSize.width + pbd,
                    height: canvasSize.height + pbd,
                    scrollX: -canvasSize.minX + offsetPbd,
                    scrollY: -canvasSize.minY + offsetPbd,
                    logging: false,
                    onclone: function(args) {
                        removeArr.forEach(function(id, index) {
                            $('#' + id).remove();
                        });
                    }
                }).then(canvas => {
                    let dataURL = canvas.toDataURL('image/png');
                    that.rulePicture.url = dataURL;
                    that.rulePicture.modalVisible = true;
                });
            },            
			getConnectionsByNodeId (nodeId) {
				const that = this;
				let conns1 = that.plumb.getConnections({
					source: nodeId
				});
				let conns2 = that.plumb.getConnections({
					target: nodeId
				});
				return conns1.concat(conns2);
			},
            deleteNode(){
                const that = this;
				let nodeList = that.ruleDesigner.ruleData.nodeList;
				let linkList = that.ruleDesigner.ruleData.linkList;
				let arr = [];
				
				arr.push(Object.assign({}, that.ruleDesigner.currentSelect));
				
				arr.forEach(function(c) {//, index  the index dosnt use
					let conns = that.getConnectionsByNodeId(c.id);
                    conns.forEach(function(conn) {//, index  the index dosnt use
                        that.plumb.deleteConnection(conn);
						linkList.splice(linkList.findIndex(link => (link.sourceId == conn.sourceId && link.targetId == conn.targetId)), 1);
					});

					let inx = nodeList.findIndex(node => node.id == c.id);
                    nodeList.splice(inx, 1);
                    // return;//这里不需要重新绘制
                    that.plumb.deleteEveryEndpoint();// 问题出在这个，这个导致删除所有线条
					that.$nextTick(() => {//重新绘制线条 
						linkList.forEach(function(link) {//, index  the index dosnt use
							let conn = that.plumb.connect({
								source: link.sourceId,
								target: link.targetId,
								anchor: that.getAnchor(),
								connector: [
									link.cls.linkType,
									{
										gap: 5,
										cornerRadius: 8,
										alwaysRespectStubs: true
									}
								],
								paintStyle: {
									stroke: link.cls.linkColor,
									strokeWidth: link.cls.linkThickness
								}
							});
							if (link.label != '') {
								conn.setLabel({
									label: link.label,
									cssClass: 'linkLabel'
								});
                            }
						});
					});
                });
            },
            clear(){
                this.ruleDesigner.clear();
            },
            setting () {
                this.$refs.settingModal.open();
            },
            shortcutHelper () {
                this.$refs.shortcutModal.open();
            },
            usingDoc () {
                window.open(this.ruleDesigner.info.gitee);
            },
            changeToZoomIn () {
                console.log('切换到放大工具');
            },
            changeToZoomOut () {
                console.log('切换到缩小工具');
            },
            exit () {
                alert('退出规则设计器...');
            },
            toggleShowGrid () {
                let flag = this.ruleData.config.showGrid;
                if (flag) {
                    this.ruleData.config.showGrid = false;
                    this.ruleData.config.showGridText = '显示网格';
                    this.ruleData.config.showGridIcon = 'eye-invisible';
                } else {
                    this.ruleData.config.showGrid = true;
                    this.ruleData.config.showGridText = '隐藏网格';
                    this.ruleData.config.showGridIcon = 'eye';
                }
            },
            downLoadRulePicture () {
                const that = this;
                let alink = document.createElement('a');
                let alinkId = 'alink-' + RDUtils.getId();
                alink.id = alinkId;
                alink.href = that.rulePicture.url;
                alink.download = '规则设计图_' + that.ruleData.attr.id + '.png';
                alink.click();
            },
            cancelDownLoadRulePicture () {
                this.rulePicture.url = '';
                this.rulePicture.modalVisible = false;
            }
        }
    }
</script>

<style lang="scss">
	@import '../style/rule-tools.scss'
</style>