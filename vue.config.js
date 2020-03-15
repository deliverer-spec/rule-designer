module.exports = {
    // baseUrl: process.env.NODE_ENV === 'production'  ? '' : './',
    publicPath: '/dr/',
    outputDir: 'dist',
    assetsDir: 'static',
    filenameHashing: true,

    // 修改 src 为 examples 将 examples 目录添加为新的页面
    pages: {
        index: {
            // page 的入口
            entry: 'examples/main.js',
            // 模板来源
            template: 'public/index.html',
            // 输出文件名
            filename: 'index.html'
        }
    },
    configureWebpack: {
    },
    devServer: {
        open: false, //是否自动弹出浏览器页面
        host: "localhost",
        port: '8087',
        https: false,
        hotOnly: false, 
        proxy: {
            '/api': {
                target: 'http://localhost:8799', //API服务器的地址
                ws: true, //代理websockets
                changeOrigin: true, // 虚拟的站点需要更管origin
                pathRewrite: {//重写路径
                    '^/api': ''
                }
            }
        }
    },
    // 强制内联CSS
    css: { extract: false },
    //性能有关，编译时构建优化
    runtimeCompiler: true,
    //关闭eslint规范
    lintOnSave: false

}