<template>
    <div style="height: 97%;">
		<a-layout class="container">
			<a-layout-sider
				width="150px"
				theme="light"
				class="select-area">
				<a-row>
					<a-checkable-tag v-model="tag.checkedComm" @change="toggleCommNodeShow" class="tag">基础组件</a-checkable-tag>
					<div align="center">
						<a-list
							:grid="{ gutter: 8, column: 1 }"
							v-if="tag.commonNodeShow">
							<a-list-item v-for="(commonNode, index) in field.commonNodes" :key="index">
								<div class="node-item" :type="commonNode.type" belongto="commonNodes">
									<a-icon :component="commonNode.icon" /> {{ commonNode.nodeName }}
								</div>
							</a-list-item>
						</a-list>
					</div>
				</a-row>
				<a-row>
					<a-checkable-tag v-model="tag.checkedLane" @change="toggleLaneNodeShow" class="tag">泳道组件</a-checkable-tag>
					<div align="center">
						<a-list
							:grid="{ gutter: 8, column: 1 }"
							v-if="tag.laneNodeShow">
							<a-list-item v-for="(laneNode, index) in field.laneNodes" :key="index">
								<div class="node-item" :type="laneNode.type" belongto="laneNodes">
									<a-icon :component="laneNode.icon" /> {{ laneNode.nodeName }}
								</div>
							</a-list-item>
						</a-list>
					</div>
				</a-row>
			</a-layout-sider>
			<a-layout>
                <!-- 工具栏 -->
				<a-layout-header class="header-option">
					<rule-tools 
                        ref="ruleTools" 
                        :ruleDesigner="this"
                        :ruleData="ruleData" 
                        :plumb="plumb" 
						:select.sync="currentSelect" 
						:selectGroup.sync="currentSelectGroup"
                        @loadRule="loadRule"   >
                    </rule-tools>
				</a-layout-header>
				<a-layout-content class="content">
                    <!-- 画布区 -->
					<rule-area 
						ref="ruleArea" 
						:browserType="browserType"
						:ruleData="ruleData" 
						:select.sync="currentSelect" 
						:selectGroup.sync="currentSelectGroup" 
						:plumb="plumb" 
						:currentTool="currentTool" 
						@findNodeConfig="findNodeConfig"
						@changeToDrag="changeToDrag"
						@getShortcut="getShortcut"
						@saveRule="saveRule"
                        @deleteNode="deleteNode">
                    </rule-area>
                    <!-- 删除连线右键弹出框 -->
					<vue-context-menu 
						:contextMenuData="linkContextMenuData" 
						@deleteLink="deleteLink">
					</vue-context-menu>
				</a-layout-content>
            </a-layout>
            <!-- 参数配置区域 -->
			<a-layout-sider
				width="350"
				theme="light"
				class="attr-area"
				@mousedown.stop="loseShortcut">
				<rule-attr :plumb="plumb" :ruleData="ruleData" :select.sync="currentSelect"></rule-attr>
			</a-layout-sider>
		</a-layout>
        <!-- <a-layout-footer class="foot"> -->
            <div class="foot">
                <span>RuleDesigner {{ info.version }}, Powered by {{ info.author }}</span>
            </div>
        <!-- </a-layout-footer> -->
		<test-modal ref="testModal" @loadRule="loadRule"></test-modal>
    </div>
</template>
<script>
    import jsplumb from 'jsplumb'
	import { commonNodes, laneNodes } from './config/basic-node-config.js'
	import { nodesExtends } from './config/node-config-ext.js'
	import { ruleConfig } from './config/args-config.js'
	import { startSvg, endSvg, commonSvg, freedomSvg, gatewaySvg, eventSvg, childRuleSvg, xLaneSvg, yLaneSvg, lanePoolSvg } from './config/basic-icon-config.js'
	import $ from 'jquery'
    import axios from 'axios'
	import 'jquery-ui/ui/widgets/draggable'
	import 'jquery-ui/ui/widgets/droppable'
	import 'jquery-ui/ui/widgets/resizable'
	import { RDUtils } from './util/RDUtils.js'
	import RuleArea from './modules/RuleArea'
	import RuleAttr from './modules/RuleAttr'
	import RuleTools from './modules/RuleTools'
	import TestModal from './modules/TestModal'
	//https://github.com/bpmn-io/diagram-js/blob/master/lib/command/CommandStack.js   撤销重做案例
    export default {
        name: 'RuleDesigner',
        components: {
            jsplumb,
            ruleConfig,
            RuleArea,
            RuleTools,
            RuleAttr,
            TestModal,
            StartIcon: { template: startSvg },
            EndIcon: { template: endSvg },
            CommonIcon: { template: commonSvg },
            FreedomIcon: { template: freedomSvg },
            GatewayIcon: { template: gatewaySvg },
            EventIcon: { template: eventSvg },
            ChildRuleIcon: { template: childRuleSvg },
            XLaneIcon: { template: xLaneSvg },
            YLaneIcon: { template: yLaneSvg },
            LanePoolIcon: { template: lanePoolSvg }
        },
        mounted () {
            const that = this;
            that.setParams();
            that.dealCompatibility();
            that.initNodeSelectArea();
            that.initJsPlumb();
            that.listenShortcut();
            that.initRule();
            that.listenPage();
                
            setTimeout(function() {
                RDUtils.consoleLog([
                    '欢迎使用Rule设计器!', 
                    '当前版本：' + that.info.version,
                    'Powered by ' + that.info.author,
                    '码云：' + that.info.gitee
                ]);
                // that.$notification.open({
                //     placement: 'bottomRight',
                //     message: '欢迎使用Rule设计器!',
                //     description: '<p>'+
                //                     '当前版本：1.0.0<br />'+
                //                     'Powered by yinbo<br />'+
                //                     '码云：<a target="blank" href="https://gitee.com/yjblogs/VFD">Rule设计器</a>'+
                //                 '</p>',
                //     icon: '<a-icon type="smile" style="color: #108ee9" />'
                // });
            }, 1000);
        },
        data () {
            return {
                paramId: '',
                info: {
                    version: '1.0.0',
                    author: 'yinbo',
                    gitee: 'https://gitee.com/yjblogs/VFD'
                },
                tag: {
                    checkedComm: true,
                    checkedLane: true,
                    toolShow: true,
                    commonNodeShow: true,
                    highNodeShow: true,
                    laneNodeShow: true
                },
                browserType: 3,
                plumb: {},
                field: {
                    commonNodes: commonNodes,
                    nodesExtends: nodesExtends,
                    laneNodes: laneNodes
                },
                ruleData: {
                    nodeList: [],
                    linkList: [],
                    attr: {
                        id: '',
                        name: '',
                        code: '',
                        ruletype: '',
                        descript: ''
                    },
                    config: {
                        showGrid: true,
                        showGridText: '隐藏网格',
                        showGridIcon: 'eye'
                    },
                    status: ruleConfig.ruleStatus.CREATE,
                    remarks: []
                },
                currentTool: {
                    type: 'drag',
                    icon: 'drag',
                    name: '拖拽'
                },
                currentSelect: {},
                currentSelectGroup: [],
                activeShortcut: true,
                linkContextMenuData: ruleConfig.contextMenu.link
            }
        },
        methods: {
            getAnchor(){
                if(this.ruleData.attr.ruletype == 'RCard'){
                   return ruleConfig.jsPlumbConfigCard.anchor.default;
                }else{
                    return ruleConfig.jsPlumbConfig.anchor.default
                }
            },
            setParams(){
                //获取参数
                this.paramId = RDUtils.getUrlParam('id');
                this.ruleData.attr.id = this.paramId;
                // RDUtils.consoleLog(this.paramId)
                // RDUtils.consoleLog(location.href)
            },
            toggleCommNodeShow (flag) {
                if (!flag) {
                    this.tag.commonNodeShow = false;
                } else {
                    this.tag.commonNodeShow = true;
                }
            },
            toggleLaneNodeShow (flag) {
                if (!flag) {
                    this.tag.laneNodeShow = false;
                } else {
                    this.tag.laneNodeShow = true;
                }
            },
            getBrowserType () {
                let userAgent = navigator.userAgent;
                let isOpera = userAgent.indexOf("Opera") > -1;
                if (isOpera) {
                    return 1;
                }; 
                if (userAgent.indexOf("Firefox") > -1) {
                    return 2;
                } 
                if (userAgent.indexOf("Chrome") > -1) {
                    return 3;
                }
                if (userAgent.indexOf("Safari") > -1) {
                    return 4;
                } 
                if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
                    alert('IE浏览器支持性较差，推荐使用Firefox或Chrome');
                    return 5;
                }
                if (userAgent.indexOf("Trident") > -1) {
                    alert('Edge浏览器支持性较差，推荐使用Firefox或Chrome');
                    return 6;
                };
            },
            dealCompatibility () {//缩放功能
                const that = this;
                    
                that.browserType = that.getBrowserType();
                if (that.browserType == 2) {
                    ruleConfig.shortcut.scaleContainer = {
                        code: 16,
                        codeName: 'SHIFT(chrome下为ALT)',
                        shortcutName: '画布缩放',
                    };
                }
            },
            initJsPlumb () {
                const that = this;
                
                that.plumb = jsPlumb.getInstance(ruleConfig.jsPlumbInsConfig);
                    
                that.plumb.bind('beforeDrop', function(info) {
                    let sourceId = info.sourceId;
                    let targetId = info.targetId;
                        
                    if (sourceId == targetId) return false;
                    let filter = that.ruleData.linkList.filter(link => (link.sourceId == sourceId && link.targetId == targetId));
                    if (filter.length > 0) {
                        // that.$message.error('同方向的两节点连线只能有一条！');  //重复线条不提示，最终结果不会出错
                        return false;
                    }
                    return true;
                });
                    
                that.plumb.bind('connection', function(conn, e) {//绑定连线事件,画线完成后的回调 e:返回执行的动作
                    // debugger
                    let connObj = conn.connection.canvas; //重置canvas的id
                    if(e){//新增线条
                        // console.log(e)
                        let o = {}, id, label, relations, priority, execs;//这里定义line 属性
                        id = 'link-' + RDUtils.getId();
                        connObj.id = id;
                        label = '';
                        o.type = 'link';
                        o.id = id;
                        o.sourceId = conn.sourceId;
                        o.targetId = conn.targetId;
                        o.label = label;
                        o.relations = 'AND'; //取值只有 and / or
                        o.priority = '0'; //优先级，定义值越小优先级大
                        o.execs = 'false'; //将来显示运行结果时使用
                        o.cls = {
                            linkType: ruleConfig.jsPlumbInsConfig.Connector[0],
                            linkColor: ruleConfig.jsPlumbInsConfig.PaintStyle.stroke,
                            linkThickness: ruleConfig.jsPlumbInsConfig.PaintStyle.strokeWidth
                        };
                        $('#' + id).bind('contextmenu', function(e) {
                            that.showLinkContextMenu(e);
                            that.currentSelect = that.ruleData.linkList.filter(l => l.id == id)[0];
                        });
                        $('#' + id).bind('click', function(e) {
                            let event = window.event || e;
                            event.stopPropagation();
                            that.currentSelect = that.ruleData.linkList.filter(l => l.id == id)[0];
                        });
                        that.ruleData.linkList.push(o);

                    }else if (that.ruleData.status == ruleConfig.ruleStatus.LOADING){//初始化
                        let l = that.ruleData.linkList[that.ruleData.linkList.length - 1];
                        connObj.id = l.id;
                        $('#' + l.id).bind('contextmenu', function(e) {
                            that.showLinkContextMenu(e);
                            that.currentSelect = that.ruleData.linkList.filter(link => link.id == l.id)[0];
                        });
                        $('#' + l.id).bind('click', function(e) {
                            let event = window.event || e;
                            event.stopPropagation();
                            that.currentSelect = that.ruleData.linkList.filter(link => link.id == l.id)[0];
                        });
                    }else{
                        // 刷新重画 不做任何处理
                    }
                    
                });
                    
                that.plumb.importDefaults({
                    ConnectionsDetachable: ruleConfig.jsPlumbConfig.conn.isDetachable
                });
                    
                RDUtils.consoleLog(['实例化JsPlumb成功...']);
            },
            initNodeSelectArea () {
                $(document).ready(function() {
                    $(".node-item").draggable({
                        opacity: ruleConfig.defaultStyle.dragOpacity,
                        helper: 'clone',
                        cursorAt: {
                            top: 16,
                            left: 60
                        },
                        containment: "window",
                        revert: "invalid"
                    });
                    RDUtils.consoleLog(['初始化节点选择列表成功...']);
                });
            },
            listenShortcut () {//监听快捷方式
                const that = this;
                document.onkeydown = function(e) {
                    let event = window.event || e;
                        
                    if (!that.activeShortcut) return;
                    let key = event.keyCode;
                        
                    switch (key) {
                        case ruleConfig.shortcut.multiple.code:
                            that.$refs.ruleArea.rectangleMultiple.flag = true;
                            break;
                        case ruleConfig.shortcut.dragContainer.code:
                            that.$refs.ruleArea.container.dragFlag = true;
                            break;
                        case ruleConfig.shortcut.scaleContainer.code:
                            that.$refs.ruleArea.container.scaleFlag = true;
                            break;
                        case ruleConfig.shortcut.dragTool.code: 
                            that.selectTool('drag');
                            break;
                        case ruleConfig.shortcut.connTool.code:
                            that.selectTool('connection');
                            break;
                        case ruleConfig.shortcut.zoomInTool.code:
                            that.selectTool('zoom-in');
                            break;
                        case ruleConfig.shortcut.zoomOutTool.code:
                            that.selectTool('zoom-out');
                            break;
                        case 37:
                            that.moveNode('left');
                            break;
                        case 38:
                            that.moveNode('up');
                            break;
                        case 39:
                            that.moveNode('right');
                            break;
                        case 40:
                            that.moveNode('down');
                            break;
                    }
                        
                    if (event.ctrlKey) {
                        if (event.altKey) {
                            switch (key) {
                                case ruleConfig.shortcut.settingModal.code:
                                    that.setting();
                                    break;
                                case ruleConfig.shortcut.testModal.code:
                                    that.openTest();
                                    break;
                            }
                        }
                    }
                }
                document.onkeyup = function(e) {
                    let event = window.event || e;
                        
                    let key = event.keyCode;
                    if (key == ruleConfig.shortcut.dragContainer.code) {
                        that.$refs.ruleArea.container.dragFlag = false;
                    } else if (key == ruleConfig.shortcut.scaleContainer.code) {
                        event.preventDefault();
                        that.$refs.ruleArea.container.scaleFlag = false;
                    } else if (key == ruleConfig.shortcut.multiple.code) {
                        that.$refs.ruleArea.rectangleMultiple.flag = false;
                    }
                }
                    
                RDUtils.consoleLog(['初始化快捷键成功...']);
            },
            listenPage () {
                window.onbeforeunload = function (e) {
                    e = e || window.event;
                    if (e) {
                        e.returnValue = '关闭提示';
                    }
                    return '关闭提示';
                };
            },
            initRule () {
                const that = this;
                if (that.paramId == null && that.ruleData.status == ruleConfig.ruleStatus.CREATE) {
                    that.ruleData.attr.id = 'rule-' + RDUtils.getId();
                } else {
                    that.getRule();
                }
                RDUtils.consoleLog(['初始化规则图成功...']);
            },
            getRule(){
                axios.get('/api/rule/load/'+this.paramId,{headers:{'Authorization':RDUtils.getToken()}})
                .then(Response => {
                    console.log(Response.data.data.ruleJson)
                    this.loadRule(Response.data.data.ruleJson)
                })
                .catch(Error => {
                    alert(Error)
                })
            },
            loadRule (json) {
                const that = this;
                that.clear();
                let loadData = JSON.parse(json);
                that.ruleData.attr = loadData.attr;
                that.ruleData.config = loadData.config;
                that.ruleData.status = ruleConfig.ruleStatus.LOADING;
                that.plumb.batch(function() {
                    let nodeList = loadData.nodeList;
                    nodeList.forEach(function(node, index) {
                        that.ruleData.nodeList.push(node);
                    });
                    let linkList = loadData.linkList;
                    
                    that.$nextTick(() => {
                        linkList.forEach(function(link, index) {
                            that.ruleData.linkList.push(link);
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
                        that.currentSelect = {};
                        that.currentSelectGroup = [];
                        that.ruleData.status = ruleConfig.ruleStatus.MODIFY;
                    });
                }, true);
                let canvasSize = that.computeCanvasSize();
                // that.$refs.ruleArea.container.pos = {
                //     top: -canvasSize.minY + 100,
                //     left: -canvasSize.minX + 100
                // }
            },
            deleteNode(){
                this.$refs.ruleTools.deleteNode();
            },
            findNodeConfig (belongto, type, callback) {//查找新节点配置信息
                let node = null;
                let nodeExt = null;
                switch (belongto) {
                    case 'commonNodes':
                        node = commonNodes.filter(n => n.type == type);
                        nodeExt = nodesExtends.filter(n => n.type == type);
                        break;
                    case 'highNodes':
                        node = highNodes.filter(n => n.type == type);
                        break;
                    case 'laneNodes':
                        node = laneNodes.filter(n => n.type == type);
                        break;
                }
                if (node && node.length >= 0) node = node[0];
                if (nodeExt && nodeExt.length >= 0) nodeExt = nodeExt[0];//增加扩展属性
                callback(Object.assign(node, nodeExt));
            },
            changeToDrag(){//调用tools的拖拽，添加组件后自动切换到拖拽状态
                this.$refs.ruleTools.useToDrag();
            },
            changeToConnection() {
                this.$refs.ruleTools.useToConnection();
            },     
            saveRule () {
                this.$refs.ruleTools.saveRule();
            },
            computeCanvasSize () {
                const that = this;
                let nodeList = Object.assign([], that.ruleData.nodeList), 
                    minX = nodeList[0].x, 
                    minY = nodeList[0].y, 
                    maxX = nodeList[0].x + nodeList[0].width, 
                    maxY = nodeList[0].y + nodeList[0].height;
                nodeList.forEach(function(node, index) {
                    minX = Math.min(minX, node.x);
                    minY = Math.min(minY, node.y);
                    maxX = Math.max(maxX, node.x + node.width);
                    maxY = Math.max(maxY, node.y + node.height);
                });
                let canvasWidth = maxX - minX;
                let canvasHeight = maxY - minY;
                return {
                    width: canvasWidth,
                    height: canvasHeight,
                    minX: minX,
                    minY: minY,
                    maxX: maxX,
                    maxY: maxY
                };
            },
            clear () {
                const that = this;
                that.ruleData.nodeList.forEach(function(node, index) {
                    that.plumb.remove(node.id);
                });
                that.currentSelect = {};
                that.currentSelectGroup = [];
                that.ruleData.nodeList = [];
                that.ruleData.linkList = [];
                that.ruleData.remarks = [];
            },            
            showLinkContextMenu (e) {//这个好像是画线
                let event = window.event || e;
                    
                event.preventDefault();
                event.stopPropagation();
                $('.vue-contextmenuName-rule-menu').css('display', 'none');
                $('.vue-contextmenuName-node-menu').css('display', 'none');
                let x = event.clientX;
                let y = event.clientY;
                this.linkContextMenuData.axis = { x, y };
            },
            deleteLink () {
                const that = this;
                // console.log("xxxxxx")
                // console.log(that.currentSelect)
                let sourceId = that.currentSelect.sourceId;
                let targetId = that.currentSelect.targetId;
                that.plumb.deleteConnection(that.plumb.getConnections({
                    source: sourceId,
                    target: targetId
                })[0]);
                let linkList = that.ruleData.linkList;
                linkList.splice(linkList.findIndex(link => (link.sourceId == sourceId && link.targetId == targetId)), 1);
                that.currentSelect = {};
            },
            loseShortcut () {
                this.activeShortcut = false;
            },
            getShortcut () {
                this.activeShortcut = true;
            },
            openTest () {
                const that = this;
                    
                let ruleObj = Object.assign({}, that.ruleData);
                that.$refs.testModal.ruleData = ruleObj;
                that.$refs.testModal.testVisible = true;
            },
            moveNode (type) {
                const that = this;
                    
                let m = ruleConfig.defaultStyle.movePx, isX = true;
                switch (type) {
                    case 'left':
                        m = -m;
                        break;
                    case 'up':
                        m = -m;
                        isX = false;
                        break;
                    case 'right':
                        break;
                    case 'down':
                        isX = false;
                }
                    
                if (that.currentSelectGroup.length > 0) {
                    that.currentSelectGroup.forEach(function(node, index) {
                        if (isX) {
                            node.x += m;
                        } else {
                            node.y += m;
                        }
                    });
                    that.plumb.repaintEverything();
                } else if (that.currentSelect.id) {
                    if (isX) {
                        that.currentSelect.x += m;
                    } else {
                        that.currentSelect.y += m;
                    }
                    that.plumb.repaintEverything();
                }
            }
        }
    }
</script>
<style lang="scss">
	@import './style/rule-designer.scss'
</style>