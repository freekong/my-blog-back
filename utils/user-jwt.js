const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const { PRIVATE_KEY } = require('./constant')

const jwtAuth = expressJwt({
  secret: PRIVATE_KEY,
  algorithms: ["HS256"],
  credentialsRequired: true,
  getToken: (req) => {
    if (req.headers['x-token']) {
      return req.headers['x-token']
    } else if (req.query && req.query.token) {
      return req.query.token
    }
  }
}).unless({
  path: [
    '/',
    '/api/login',
    '/api/register',
    '/api/resetPwd'
  ]
})

// jwt-token解析
function decode(req) {
  const token = req.get('X-Token')
  return jwt.verify(token, PRIVATE_KEY)
}

module.exports = {
  jwtAuth,
  decode
}