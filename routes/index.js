var express = require('express');
var router = express.Router();
// 不同的网址对应到不同的文件
/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.json( { message: 'hello modr' });
});

module.exports = router;
