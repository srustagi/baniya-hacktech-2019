// require('dotenv').config();
var express = require('express');
var router = express.Router();
var firebase = require('firebase');

var config = {
    // apiKey: "AIzaSyDo-YM_5VIqvaQp1jFGB0wFYDS1uAoJxjY",
    // authDomain: process.env.authDomain,
    // databaseURL: process.env.databaseURL,
    // projectId: process.env.projectId,
    // storageBucket: process.env.storageBucket,
    // messagingSenderId: process.env.messagingSenderId
    apiKey: "AIzaSyDo-YM_5VIqvaQp1jFGB0wFYDS1uAoJxjY",
    authDomain: "hacktech-1.firebaseapp.com",
    databaseURL: "https://hacktech-1.firebaseio.com",
    projectId: "hacktech-1",
    storageBucket: "hacktech-1.appspot.com",
    messagingSenderId: "380132273581"
  };
  firebase.initializeApp(config);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/account-signup', function(req, res, next) {
	email = req.body.email;
	pass = req.body.pass;
	firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		console.log(errorCode + " \n" + errorMessage);
	    if(errorCode === "auth/email-already-in-use") {
	      console.log('redirected back to home');
	      return res.redirect('/');
	    }
	});
	res.render('firsttimesignedin', {email: email});
});

router.post('/account-login', function(req, res, next) {
  email = req.body.email;
  password = req.body.pass;
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode + " \n" + errorMessage);
    if(errorCode === "auth/user-not-found") {
      console.log('redirected back to home');
      return res.redirect('/');
    } else if (errorCode === "auth/wrong-password") {
      return res.redirect('/');
    }
 });
  res.render('loggedinlanding', { email: email });
});

module.exports = router;
