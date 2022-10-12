// 此文件用于webpack 开发阶段，选用哪个环境启动；
// 已知会影响的有 webpack 编译时，proxy使用； 富文本上传时 接口域名使用；

// const httpUrl = 'https://test-y99-tryq.ddj.com'; // 测试项目环境
const httpUrl = 'http://localhost:3098'; // 测试项目环境

const port = 2022; // webpack 启动端口 统一这里设置

module.exports = { httpUrl, port };
