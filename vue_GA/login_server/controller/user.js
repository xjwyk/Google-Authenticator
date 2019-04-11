
// 引入db的配置
const db = require('../config/db');

//引入sequelize对象
const Sequelize = db.sequelize;

// 引入数据表类型
const user = Sequelize.import('../module/user');

//引入jwt做token验证
const jwt = require('jsonwebtoken');

//解析token
const tools = require('../public/tool');

//统一设置token有效时间  为了方便观察，设为10s
const expireTime = '10s';

// 自动建表
// user.sync({ force: false });

const bcrypt = require('bcryptjs');

const jsotp = require('jsotp');

// 数据库操作类
class userModule {
  static async userRegist(data) {
    const { username, password, code } = data;
    return await user.create({
      username,
      password,
      code
    });
  }

  static async getUserInfo(username) {
    return await user.findOne({
      where: {
        username
      }
    });
  }
}

class userController {
  static async create(ctx) {
    const req = ctx.request.body;
    if (req.username && req.password) {
      try {
        const query = await userModule.getUserInfo(req.username);
        if (query) {
          ctx.response.status = 200;
          ctx.body = {
            code: -1,
            desc: '用户已存在'
          }
        } else {
          const param = {
            username: req.username,
            password: req.password,
            code: req.code
          };

          const data = await userModule.userRegist(param);
    
          ctx.response.status = 200;
          ctx.body = {
            code: 0,
            desc: '用户注册成功',
            data,
            userInfo: {
              username: req.username
            }
          }
        }
      } catch (error) {
        ctx.response.status = 416;
        ctx.body = {
          code: -1,
          desc: '参数不齐'
        }
      }
    } 
  }

  static async login(ctx) {
    const req = ctx.request.body;
    if(!req.username || !req.password) {
      return ctx.body = {
        code: '-1',
        msg: '用户名或密码不能为空'
      }
    } else {
      
      const data = await userModule.getUserInfo(req.username);

      if (data) {
        let totp = jsotp.TOTP(data.code);
        if ((totp.now() === req.code)) {
          if (bcrypt.compareSync(req.password, data.password)) {
            const token = jwt.sign({
              username: req.username,
              password: req.password,
              code: req.code
            }, '123456', {expiresIn: expireTime });
            const info = {
              createAt: data.createAt,
              updateAt: data.updateAt,
              username: data.username,
              password: data.password,
              code: data.code
            }
            return ctx.body = {
              code: '0',
              token: token,
              userInfo: JSON.stringify(info),
              desc: '登陆成功'
            }
          } else {
            return ctx.body = {
              code: '-1',
              desc: '用户密码错误'
            }
          }
        } else {
          return ctx.body = {
            code: '-1',
            desc: '验证码错误'
          }
        }
        
      } else {
        return ctx.body = {
          code: '-1',
          desc: '该用户尚未注册'
        }
      }
    }
  };

  static async getUserInfo(ctx) {
    const req = ctx.request.body;
    const token = ctx.headers.authorization;
    if (token) {
      try {
        const result = await tools.verToken(token);
        if (!req.username) {
          return ctx.body = {
            code: '-1',
            desc: '参数错误'
          };
        } else {
          let data = await userModule.getUserInfo(req.username);
          if (req.username === data.username) {
            const info = {
              createAt: data.createAt,
              updateAt: data.updateAt,
              username: data.username,
              code: data.code
            };
            return ctx.body = {
              code: '0',
              userInfo: JSON.stringify(info),
              desc: '获取用户信息'
            };
          }
        }
      } catch(err) {
        ctx.status = 401;
        return ctx.body = {
          code: '-1',
          desc: '登陆过期，请重新登陆'
        }
      }
    } else {
      ctx.status = 401;
      return ctx.body = {
        code: '-1',
        desc: '登录过期， 请重新登录'
      }
    }
  };
}

module.exports = userController;
