var express = require('express');
var router = express.Router();
var _S = require("../src/search");
var search = new _S;
console.dir(search.getSearch());


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', searchData: search.getSearch() });
});

module.exports = router;
