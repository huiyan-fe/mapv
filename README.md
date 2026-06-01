# Mapv - 地理信息可视化开源库

[![npm version](https://img.shields.io/npm/v/mapv.svg)](https://www.npmjs.com/package/mapv)

<a href=”http://mapv.baidu.com/”>
    <img style=”vertical-align: top;” src=”./asset/logo.png?raw=true” alt=”logo”>
</a>

主页: [mapv.baidu.com](http://mapv.baidu.com/) | 备用: [huiyan-fe.github.io/mapv](http://huiyan-fe.github.io/mapv/) | [English](https://github.com/huiyan-fe/mapv/blob/master/README_EN.md)

## 简介

Mapv 是一款地理信息可视化开源库，可以用来展示大量地理信息数据，点、线、面的数据，每种数据也有不同的展示类型，如直接打点、热力图、网格、聚合等方式展示数据。

## 示例

<a href=”http://mapv.baidu.com/gallery.html”>
    <img style=”vertical-align: top;” src=”./asset/overview.jpg?raw=true” alt=”overview”>
</a>

## 文档

- [API 参考](https://github.com/huiyan-fe/mapv/blob/master/API.md)

## 支持环境

基于 Canvas 开发，支持所有现代浏览器（不支持 IE8 及以下版本）。

## 安装使用

### NPM

```bash
npm install mapv
```

Mapv 能很好地和 Webpack、Browserify 等 CommonJS 模块打包器配合使用。

### CDN

```html
<script src=”http://mapv.baidu.com/build/mapv.min.js”></script>
```

你也可以下载[最新发布的版本](https://github.com/huiyan-fe/mapv/releases)。

## 本地开发

```bash
npm install   # 初始化环境
npm test      # 开发
npm run publish  # 发布
```

## 谁在使用

[![百度慧眼](./asset/user/huiyan.png)](http://huiyan.baidu.com)
[![百度交通云](./asset/user/jiaotong.png)](http://jiaotong.baidu.com/)
[![百度地图开放平台](./asset/user/lbsyun.png)](http://lbsyun.baidu.com/)

## 联系我们

- 邮箱: mapv@baidu.com
- QQ群: 321519841

## 许可证
Copyright (c) 2016, Baidu, Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the Baidu, Inc. nor the names of it
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
