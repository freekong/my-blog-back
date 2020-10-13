const express = require('express');
const router = express.Router();
const service = require('../services/articleService');

router.post('/addArticle', service.addArticle)
router.get('/getArticleList', service.getArticalList)
router.get('/getArticleDetail', service.getArticleDetail)
router.put('/modifyArticle', service.modifyArticle)
router.delete('/delArticle', service.delArticle)

module.exports = router;