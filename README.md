# rule-designer

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).



问题还有很多：
1、定义属性  ok  
2、属性校验  前端未加任何校验
3、测试功能  不完整
4、暴露api   未清理
    保存
    加载
    测试

5、优化
    编辑窗口伸缩   只完成部分
    组件拉到窗口外之后，不能再选到   基本解决
    样式工具栏太宽      可忽略
    属性栏占位不合理，可以考虑悬浮到画板上 
    属性栏考虑拆分，选中哪个node 再显示相应属性   已经拆分，但代码不彻底
    图标不合理

6、当有缩放整体页面，或者打开f12后，页面变化，画图区不能使用

7、通过扩展方式，增加属性   基本完成

8、属性使用的是ant 组件，是否完全替换成element-ui?  

9、大于2个节点，或者有2条以上的线条时，连线后再移动节点，会出现错误  已经解决，是因为画线js错误引起
    Uncaught TypeError: Cannot read property 'enabled' of undefined
    at root.jsPlumbInstance.eval (webpack-internal:///./node_modules/jsplumb/dist/js/jsplumb.js:6282)

10、jsplumb 需要传入的参数出现问题，目前不清楚是版本问题还是其他？   
    检测到2个，  连接类型，  overlays

11、有些参数没有写入xml中，如页面大小， 连线类型 ，  当然， 如果都使用默认值则没有问题



12、网格范围不匹配

13、数据源：通过配置数据源直接从数据库查询
            增加通过rest 接口获取数据

样式参数：
top: auxiliaryLinePos.y 
left: auxiliaryLinePos.x
:class="{ grid: ruleData.config.showGrid, zoomIn: currentTool.type == 'zoom-in', zoomOut: currentTool.type == 'zoom-out', canScale: container.scaleFlag, canDrag: container.dragFlag, canMultiple: rectangleMultiple.flag }"
				:style="{ top: container.pos.top + 'px', left: container.pos.left + 'px', transform: 'scale(' + container.scale + ')',
				transformOrigin: container.scaleOrigin.x + 'px ' + container.scaleOrigin.y + 'px' }"


后端功能：
1、DataSource 使用
2、