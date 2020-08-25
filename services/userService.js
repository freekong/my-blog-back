const { querySql, queryOne } = require('../utils/index')
const md5 = require('../utils/md5')
const jwt = require('jsonwebtoken');
const boom = require('boom');
const { body, validationResult } = require('express-validator')
const { 
  CODE_ERROR,
  CODE_SUCCESS, 
  PRIVATE_KEY, 
  JWT_EXPIRED 
} = require('../utils/constant');
const { decode } = require('../utils/user-jwt');

/**
 * @description: 登录
 * @param {type} 
 * @return {type} 
 */
function login(req, res, next) {
  console.log(req.headers['x-token'], '----------qqqqqq')
  const err = validationResult(req)
  if (!err.isEmpty) {
    const [{ msg }] = err.errors
    next(boom.badRequest(msg))
  } else {
    let { username, password } = req.body
    password = md5(password)
    const query = `select * from user where username='${username}' and password='${password}'`;
    querySql(query).then(user => {
      if (!user || user.length === 0) {
        res.json({
          code: CODE_ERROR,
          msg: '用户名或密码错误',
          data: null
        })
      } else {
        const token = jwt.sign(
          { username },
          PRIVATE_KEY,
          { expiresIn: JWT_EXPIRED }
        )

        let userData = {
          id: user[0].id,
          username: user[0].username,
          nickname: user[0].nickname,
          avator: user[0].avator,
          sex: user[0].sex,
          gmt_create: user[0].gmt_create,
          gmt_modify: user[0].gmt_modify
        }
        res.json({
          code: CODE_SUCCESS,
          msg: '登录成功',
          data: {
            token,
            userData
          }
        })
      }
    })
  }
}

/**
 * @description: 注册
 * @param {type} 
 * @return {type} 
 */
function register(req, res, next) {
  const err = validationResult(req)
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors
    next(boom.badRequest(msg))
  } else {
    let { username, password } = req.body
    findUser(username).then(data => {
      if (data) {
        res.json({
          code: CODE_ERROR,
          msg: '用户已存在',
          data: null
        })
      } else {
        password = md5(password)
        const query = `insert into user(username, password) values('${username}', '${password}')`;
        querySql(query).then(result => {
          if (!result || result.length === 0) {
            res.json({
              code: CODE_ERROR,
              msg: '注册失败',
              data: null
            })
          } else {
            const queryUser = `select * from user where username='${username}' and password='${password}'`;
            querySql(queryUser).then(user => {
              const token = jwt.sign(
                { username },
                PRIVATE_KEY,
                { expiresIn: JWT_EXPIRED }
              )

              let userData = {
                id: user[0].id,
                username: user[0].username,
                nickname: user[0].nickname,
                avator: user[0].avator,
                sex: user[0].sex,
                gmt_create: user[0].gmt_create,
                gmt_modify: user[0].gmt_modify
              }

              res.json({
                code: CODE_SUCCESS,
                msg: '注册成功',
                data: {
                  token,
                  userData
                }
              })
            })
          }
        })
      }
    })
  }
}
/**
 * @description: 重置密码
 * @param {type} 
 * @return {type} 
 */
function resetPwd(req, res, next) {
  const err = validationResult(req);
   if (!err.isEmpty()) {
     const [{ msg }] = err.errors;
     next(boom.badRequest(msg));
   } else {
     let { username, oldPassword, newPassword } = req.body;
     oldPassword = md5(oldPassword);
     validateUser(username, oldPassword)
     .then(data => {
       console.log('校验用户名和密码===', data);
       if (data) {
         if (newPassword) {
           newPassword = md5(newPassword);
       const query = `update user set password='${newPassword}' where username='${username}'`;
       querySql(query)
           .then(user => {
             // console.log('密码重置===', user);
             if (!user || user.length === 0) {
               res.json({ 
                 code: CODE_ERROR, 
                 msg: '重置密码失败', 
                 data: null 
               })
             } else {
               res.json({ 
                 code: CODE_SUCCESS, 
                 msg: '重置密码成功', 
                 data: null
               })
             }
           })
         } else {
           res.json({ 
             code: CODE_ERROR, 
             msg: '新密码不能为空', 
             data: null 
           })
         }
       } else {
         res.json({ 
           code: CODE_ERROR, 
           msg: '用户名或旧密码错误', 
           data: null 
         })
       }
     })
    
   }
 }

/**
 * @description: 校验用户名和密码
 * @param {type} 
 * @return {type} 
 */
function validateUser(username, oldPassword) {
  const query = `select id, username from user where username='${username}' and password='${oldPassword}'`
  return queryOne(query)
}

/**
 * @description: 查询用户信息
 * @param {type} 
 * @return {type} 
 */
function findUser(username) {
  const query = `select id, username from user where username='${username}'`;
  return queryOne(query)
}

module.exports = {
  login,
  register,
  resetPwd
}