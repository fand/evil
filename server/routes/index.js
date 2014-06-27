var express = require('express');
var router = express.Router();

var index = function (req, res) {

};


router.get('/test', function(req, res) {
  res.render('index', { debug: true, test: true });
});

router.get('/pc', function(req, res) {
  res.render('index', { debug: true, test: true });
});

router.get('/mobile', function(req, res) {
  res.render('mobile');
});


// Show default evil.
router.get('/', function(req, res) {

  var is_dev = !!(process.env.NODE_ENV.match(/dev/));
  return res.render('index', { debug: is_dev });
});

router.post('/', function(req, res) {
  var json = req.param.json;
  if (typeof json === 'undefined') { return; }

  var song = db.insert();

  res.render('index', { title: 'Express' });
});

router.get('/:id', function(req, res) {

  var is_dev = !!(process.env.NODE_ENV.match(/dev/));


  // Get the song data.
  var song_id = req.param.id;




  return res.render('index', { song: song, debug: is_dev });
});

module.exports = router;
