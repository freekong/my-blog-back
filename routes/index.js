const express = require('express')
const userRouter = require('./users')
const taskRouter = require('./tasks')

const { jwtAuth, decode } = require('../utils/user-jwt')
const router = express.Router() // 注册路由

router.use(jwtAuth) // 注入认证模块

router.use('/api', userRouter);
router.use('/api', taskRouter);

router.use((err, req, res, next) => {
  if (err && err.name === 'UnauthorizedError') {
    const { status = 401, message } = err;
    // 抛出401异常
    res.status(status).json({
      code: status,
      msg: 'token失效，请重新登录',
      data: null
    })
  } else {
    const { output } = err || {};
    const errCode = (output && output.statusCode) || 500;
    const errMsg = (output && output.payload && output.payload.error) || err.message;
    res.status(error).json({
      code: errCode,
      msg: errMsg
    })
  }
})

module.exports = router