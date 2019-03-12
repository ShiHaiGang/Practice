const router = require('koa-router')();
const Users = require('../schema/users');

router.prefix('/users')

router.get('/', function (ctx, next) {
  // 添加
  const User = new Users({
    name: '拇指姑娘',
    avatar: '😂头像👮',
    email: '522090013@qq.com',
    password: '12345',
  })
  // 保存
  User.save((err, docs) => {
    if (err) throw err;
    console.log(docs)
  });
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
