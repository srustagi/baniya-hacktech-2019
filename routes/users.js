var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var url = require('url');
var request = require('request');

var config = {
	apiKey: process.env.apiKey,
	authDomain: process.env.authDomain,
	databaseURL: process.env.databaseURL,
	projectId: process.env.projectId,
	storageBucket: process.env.storageBucket,
	messagingSenderId: process.env.messagingSenderId
};
var db = firebase.firestore();

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
	var ret = [];
	var user = firebase.auth().currentUser;
	var col = db.collection("users");
	var docs = col.get().then(snapshot => {
		snapshot.forEach(doc => {
			// console.log(doc.id, '=>', doc.data());
			if(doc.data().email == user.email) {
				const userRef = db.collection("users").doc(doc.id);
				entries = doc.data().uploads;
				// console.log("entries", entries);
				// for(var i = 0; i<entries.length; i++) {
				// 	ret.push(entries[i]);
				// }
				// console.log("ret ", ret);
				ret = doc.data().uploads;
			}
		});
	}).then(function() {
			console.log("entries", entries);
			for(var i = 0; i<entries.length; i++) {
				ret.push(entries[i]);
			}
			res.render('dashboard', {user: user, entries: ret});
		});
	console.log("-----------");
	console.log(ret);
});

module.exports = router;
