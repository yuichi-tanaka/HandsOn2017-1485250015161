var express = require('express');
var router = express.Router();
var _S = require("../src/search");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('viewer', { title: 'Express'});
});

module.exports = router;
