const path = require('path');
const express = require('express');
const mock = require('express-mockjs');

const app = express();

console.warn = function () {};

app.use('/tryqapi', mock(path.join(process.cwd(), 'mock')));

app.listen(3098, function () {
  console.log(`页面打开此地址 访问api导航页面： http://localhost:${3098}/tryqapi`);
});
