# Koagent

开发中

## 一个代理工具 base on koa

- koa 富有表现力的中间件编写插件，以及支持已有koa各式插件
- 一个支持 HTTP / HTTPS Websocket 等协议抓包工具
- 一个请求转发工具
- 一个mock编辑器
- 一个前端debug工具(计划支持html注入vConsole、eruda、vorlon以及其它任意内容)
- 一个流量统计工具

## packages

- [ ] koagent-server 代理工具服务
- [ ] koagent-cli cli工具
- [ ] koagent-client 代理工具ui客户端，预计使用antd

## Todo

- 请求代理
  - 支持各类协议转发
    - http
    - https
    - websocket/wss
  - 抓包
    - 抓包数据服务
    - 抓包数据表现
- 请求转发
  - 规则管理
  - 请求匹配和转发
- mock功能
- html注入
- 流量统计
- 统一ui的界面
- cli工具
