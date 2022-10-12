const env = process.env.APP_ENV;
class Config {
  constructor() {
    this.env = env;
    this.url = null;
    this.httpUrl = null;
    this.openLocalMenu = true; // 是否开启本地菜单并且取消路由校验,默认关闭, local环境可以开启
    this.loginUrl = null; // 单点登录url
    // 文件上传域名，包括图片、文件，除富文本外；
    this.uploadFileHostName = 'https://upload.test.com';
    // 图片上传cdn；
    this.uploadFileUrl = `${this.uploadFileHostName}/api/v1/public/upload/object/batch`;
    this.systemName = 'tryq';
  }
}

module.exports = new Config();
