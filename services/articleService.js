const { querySql, queryOne } = require('../utils/index');
const boom = require('boom');
const { validationResult } = require('express-validator');
const { 
  CODE_ERROR,
  CODE_SUCCESS
} = require('../utils/constant');

/**
 * @description: 添加文章
 * @param {type} 
 * @return {type} 
 */
function addArticle(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let { title, author, content, } = req.body
    const query = `insert into article(title, author, content, count) values('${title}', '${author}', '${content}', 0)`;
    querySql(query).then(data => {
      if (!data || data.length === 0) {
        res.json({
          code: CODE_ERROR,
          msg: '添加失败',
          data: null
        })
      } else {
        res.json({
          code: CODE_SUCCESS,
          msg: '添加成功',
          data: null
        })
      }
    })
  }
}

/**
 * @description: 获取文章列表
 * @param {type} 
 * @return {type} 
 */
function getArticalList(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let { title, author, pageSize, currentPage } = req.query
    pageSize = pageSize ? pageSize : 1;
    currentPage = currentPage ? currentPage : 1;
    title = (title && title !== '') ? title : null;
    author = (author && author !== '') ? author : null
    let query = `select d.id, d.title, d.author, d.content, d.count, d.create_time, d.update_time from article d`;
    querySql(query).then(data => {
      if (!data || data.length === 0) {
        res.json({
          code: CODE_SUCCESS,
          msg: '暂无数据',
          data: null
        })
      } else {
        let total = data.length // 总数
        // 分页偏移量
        let n = (currentPage - 1) * pageSize
        let query_1 = ''
        if (title && author) {
          query_1 = `select d.id, d.title, d.author, d.content, d.count, d.create_time, d.update_time from article d where title='${title}' and author='${author}' order by d.create_time desc`;
        } else if (title && author === null) {
          query_1 = `select d.id, d.title, d.author, d.content, d.count, d.create_time, d.update_time from article d where title='${title}' order by d.create_time desc`;
        } else if (title === null && author) {
          query_1 = `select d.id, d.title, d.author, d.content, d.count, d.create_time, d.update_time from article d where author='${author}' order by d.create_time desc`;
        } else {
          query_1 = query + ' order by d.create_time desc'
        }
        querySql(query_1).then(result_1 => {
          if (!result_1 || result_1.length === 0) {
            res.json({
              code: CODE_SUCCESS,
              msg: '暂无数据',
              data: null
            })
          } else {
            let query_2 = query_1 + ` limit ${n}, ${pageSize}`;
            querySql(query_2).then(result_2 => {
              if (!result_2 || result_2.length === 0) {
                res.json({
                  code: CODE_SUCCESS,
                  msg: '暂无数据',
                  data: null
                })
              } else {
                res.json({
                  code: CODE_SUCCESS,
                  msg: '查询成功',
                  data: {
                    data: result_2,
                    total: result_1.length,
                    pageSize: parseInt(pageSize),
                    currentPage: parseInt(currentPage)
                  }
                })
              }
            })
          }
        })
      }
    })
  }
}
/**
 * @description: 获取文章详情
 * @param {type} 
 * @return {type} 
 */
function getArticleDetail(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let { id } = req.query
    const query = `select * from article where id='${id}'`
    querySql(query).then(data => {
      if (!data || data.length === 0) {
        res.json({
          code: CODE_ERROR,
          msg: '查询失败',
          data: null
        })
      } else {
        res.json({
          code: CODE_SUCCESS,
          msg: '查询成功',
          data: data
        })
      }
    })
  }
}
/**
 * @description: 修改文章
 * @param {type} 
 * @return {type} 
 */
 function modifyArticle(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let { id, title, content, } = req.body
    const query = `update article set title='${title}', content='${content}' where id='${id}'`
    querySql(query).then(data => {
      if (!data || data.length === 0) {
        res.json({
          code: CODE_ERROR,
          msg: '修改失败',
          data: null
        })
      } else {
        res.json({
          code: CODE_SUCCESS,
          msg: '修改成功',
          data: null
        })
      }
    })
  }
}
/**
 * @description: 删除文章
 * @param {type} 
 * @return {type} 
 */
function delArticle(req, res, next) {
  const err = validationResult(req)
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let { id } = req.query
    const query = `delete from article where id='${id}'`
    querySql(query).then(data => {
      if (!data || data.length === 0) {
        res.json({
          code: CODE_ERROR,
          msg: '删除失败',
          data: null
        })
      } else {
        res.json({
          code: CODE_SUCCESS,
          msg: '删除成功',
          data: null
        })
      }
    })
  }
}

/**
 * @description: 查询文章是否存在
 * @param {type} 
 * @return {type} 
 */
function findArticle(param) {
  let query = null;
  query = `select id from article where id='${param}'`;
  return queryOne(query);
}

module.exports = {
  addArticle,
  getArticalList,
  getArticleDetail,
  modifyArticle,
  delArticle
}