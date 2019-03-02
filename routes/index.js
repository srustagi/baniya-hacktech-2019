require('dotenv').config();
var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var url = require('url');    

var config = {
	apiKey: process.env.apiKey,
	authDomain: process.env.authDomain,
	databaseURL: process.env.databaseURL,
	projectId: process.env.projectId,
	storageBucket: process.env.storageBucket,
	messagingSenderId: process.env.messagingSenderId
};
firebase.initializeApp(config);

/* GET home page. */
router.get('/', function(req, res, next) {
	if (firebase.auth().currentUser != null) {
		res.redirect('/users/' + firebase.auth().currentUser.uid);
	} else {
		res.render('index');
	}
});

router.get('/login', function(req, res, next) {
	status = false;
	if(req.query.createSuccess) status = req.query.createSuccess;
	res.render('login', {success: status});
});

router.get('/signup', function(req, res, next) {
	res.render('signup');
});

router.post('/signup', function(req, res, next) {
	email = req.body.email;
	pass = req.body.password;
	firstname = req.body.firstname;
	lastname = req.body.lastname;
	firebase.auth().createUserWithEmailAndPassword(email, pass).then(function(user) {
		user.user.updateProfile({displayName: firstname + " " + lastname});
	}).catch(function(error) {
	  console.log(error);
	});
	res.redirect(url.format({
		pathname:"/login",
		query: {
			"createSuccess": true
		}
	}));
});

router.post('/login', function(req, res, next) {
	if (firebase.auth().currentUser != null) {
		res.redirect("/users/" + firebase.auth().currentUser.uid);
	} else {
		email = req.body.email;
		pass = req.body.password;
		firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error) {
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  res.send(errorCode + " \n" + errorMessage);
		});
		var user = firebase.auth().currentUser;
		if(user) {
			res.redirect("/users/" + user.uid);
		} else {
			res.redirect("/login");
		}
	}
});

router.get('/signout', function(req, res, next) {
	firebase.auth().signOut().then(function() {
	  console.log('Signed Out');
	}, function(error) {
	  console.error('Sign Out Error', error);
	});
	res.redirect('/');
});

module.exports = router;
