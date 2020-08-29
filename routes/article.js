const express = require('express');
const router = express.Router();
const service = require('../services/articleService');

router.post('/addArticle', service.addArticle)
router.get('/getArticleList', service.getArticalList)

module.exports = router;