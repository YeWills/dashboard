## 中台项目范例
项目设计说明参考：[设计一个中台项目架构](https://yewills.github.io/2022/01/13/Infrastructure/)

## 使用

```s
# 推荐使用yarn安装，容错比较好
yarn
npm run mock
npm run local
```

浏览器访问：
```
http://localhost:2022
```

## 生产环境 sourcemap 调试

线上使用 hidden-source-map ，这个类似 source-map，
只是去掉了 js 代码中的 source-map path 。

调试：
```s
npm run build 
Add source map
```

因为 source-map 的map文件已经部署到线上，
可以在浏览器上访问`http://127.0.0.1:8080/1638d101b76cb1477f1a.async.js.map`

只是没有做关联而已，
Add source map 的路径就是：
`1638d101b76cb1477f1a.async.js.map`

如果成功，你就会看到 source 上多了一个 `webpack://`

### 如何知道有哪些map文件
如果文件没有改动，你多次 npm run build 的文件名是一致的，
这样你不知道线上部署了哪些sourcemap时，可以本地自己build一次，
看看有哪些文件。

### 如何知道怎么关联
将 hidden-source-map 改成 source-map 重新打包，此时会看到每个js的 source path 是如何写的。


### 白名单策略
本节主要讲解了Webpack里source map是什么以及如何通过devtool配置其生成方式。在开发环境我们选择eval-cheap-module-source-map；生产环境我们一般不生成source map，如果一定需要的话，可以选择hidden-source-map或白名单策略。





