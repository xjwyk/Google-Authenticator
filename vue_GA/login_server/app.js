const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const koajwt = require('koa-jwt');
const cors = require('koa-cors');

const user = require('./routes/user');


// error handler
onerror(app);

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}));
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));
app.use(cors())

app.use(views(__dirname + '/views', {
  extension: 'pug'
}));

// logger
app.use(async (ctx, next) => {
  return next().catch((err) => {
    if(err.status === 401) {
      ctx.status = 401;
      ctx.body = {
        code: '-2000',
        desc: '登录过期，请重新登录'
      };
    } else {
      throw err;
    }
  });
});

app.use(koajwt({
  secret: '123456'
}).unless({
  path: [/^\/user\/register/,/^\/user\/login/]
}));

// routes
app.use(user.routes(), user.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

app.listen(3333,() => {
  console.log('LOGIN_SERVER API IS LISTEN IN 3333');
});

module.exports = app;
