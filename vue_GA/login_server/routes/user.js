const Router = require('koa-router');
const userContriller = require('../controller/user.js');

const router = new Router({
  prefix: '/user'
});

// 注册
router.post('/register', userContriller.create);

// 登录
router.post('/login', userContriller.login);

// 获取用户信息
router.post('/getUserInfo', userContriller.getUserInfo);

module.exports = router;
