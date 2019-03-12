const Koa = require('koa');
const mongoose = require('mongoose');
const app = new Koa();
// 常用中间件
const json = require('koa-json'); //返回json格式的数据
const views = require('koa-views'); //视图模板渲染 
const logger = require('koa-logger'); //请求日志功能
const static = require('koa-static'); //加载静态资源
const session = require('koa-session'); //会话存储
const onerror = require('koa-onerror'); //错误处理信息
const bodyparser = require('koa-bodyparser'); //获取表单提交的数据
// 安全清单
const Redis = require('ioredis'); //对话缓存
const helmet = require("koa-helmet"); //安全性相关的HTTP头
const ratelimit = require('koa-ratelimit'); //身份认证——对于暴力破解的保护
// 分离路由
const index = require('./routes/index');
const users = require('./routes/users');

// 错误处理器
onerror(app);

// 注册中间件
app.use(json());
app.use(logger());
app.use(helmet());
app.use(session(app));
app.use(views(__dirname + '/views', {
  extension: 'pug'
}));
app.use(static(__dirname + '/public'));
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}));

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

// mongoose
mongoose.set('debug', true);
const uri = "mongodb://localhost:27017/api";
mongoose.connect(uri, { useNewUrlParser: true });
mongoose.connection.on('disconnected', () => {
  // 中断从新连接
  mongoose.connect();
});
mongoose.connection.on('error', (err) => {
  // 输出一下错误信息
  console.error(err);
});
mongoose.connection.on('open', async () => {
  // 处理一些一步操作
  console.log('\x1B[36m> MongoDB Server OK... \x1B[39m');
  console.log('\x1B[46m> Listening at '+ uri +'\x1B[49m');
});

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app