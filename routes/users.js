var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var url = require('url');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('../');
});

router.get('/git', function(req, res, next) {
  	if (firebase.auth().currentUser != null) {
	    res.render('git', {user: firebase.auth().currentUser});
	} else {
		res.redirect('../');
	}
});

router.get('/unix', function(req, res, next) {
  	if (firebase.auth().currentUser != null) {
	    res.render('unix', {user: firebase.auth().currentUser});
	} else {
		res.redirect('../');
	}
});

router.get('/dev', function(req, res, next) {
  	if (firebase.auth().currentUser != null) {
	    res.render('dev', {user: firebase.auth().currentUser});
	} else {
		res.redirect('../');
	}
});

router.get('/:uid', function(req, res, next) {
	var user = firebase.auth().currentUser;
	res.render('dashboard', {user: user});
});

module.exports = router;
