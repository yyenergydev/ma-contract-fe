# ma-contract-fe
# 微服务应用-合同管理前端工程

## 依赖
- [nodejs v5+，本地控制台能使用npm即可](http://nodejs.org/)
- [neo-ui](http://tinper.org/dist/neoui/index.html)
- [kero](http://tinper.org/dist/kero/docs/overview.html)
- [ko-epui 基于kero封装的ui组件](https://github.com/songhlc/ko-epui)
- [es6](http://es6.ruanyifeng.com/)
- jquery
- [lodash-4.17.2](https://lodash.com/docs/4.17.2)
- [less](http://www.lesscss.net/)

## 前端IDE推荐

- webstorm(收费)
- sublime
- atom

## 开始开发
```
yarn或者npm报错的情况下，建议使用cyarn
npm install -g cyarn --registry=https://registry.npm.taobao.org
cyarn install
yarn dev

npm install
npm run dev
```
默认会启动localhost:8084 页面  访问localhost:8084/ 点击重新登录(public01/a111111) 点击登录,然后url切换到localhost:8084/list/index.zh_CN.html即可

## 开发约束
- 1.多页面入口地址: src/pages/**/index.js(请保证所有入口页面都叫index.js)
- 2.首页入口地址: src/pages/index/index.js
- 3.静态资源地址: static/.有需要访问静态资源时,请使用static/*的链接
- 4.开发服务代理:见config/index.js. 中dev下的proxyTable
- 5.本地端口号修改:见config/index.js. dev下的port

## 国际化多语

- 所有语种文件放到locale目录下,目录结构: locale/**/translate.json
- translate.json 结构{ 'key':'value','key2','value2'}
- 语种为: zh_CH,en_US...
- ejs模板中使用多语 ${__("key")},js中使用多语__("key")

## 开发常用

### 页面示例

#### 覆盖场景

- 列表查询
- 表格分页
- 状态切换
- 编辑页面
- input控件使用
- 容器组件
- checkbox组件
- radio组件
- select组件
- switch组件
- date组件
- textarea组件

#### 缺少场景

- 批量编辑表格
- 参照
- 编辑表格 + 参照 + 下拉 等
- 页面生命周期的抽象
- mock-server 例子

1. 列表页面示例:参考src/pages/list/
2. 编辑页面示例:参考src/pages/edit/

### 结构描述

视图  | 数据模型 | 后端服务
---|---|---
.ejs | model/collection | model/collection get/post/put/delete
ko,neoui,kero,ko-epui | datatable | ajax

