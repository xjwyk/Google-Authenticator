
const jwt = require('jsonwebtoken');

exports.verToken = function(token) {
  return new Promise((res, rej) => {
    const info = jwt.verify(token.split(' ')[1], "123456");
    resolve(info);
  });
}