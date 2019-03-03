require('dotenv').config();
var express = require('express');
var router = express.Router();
var firebase = require('firebase');
require("firebase/firestore");
var request = require('request'); 

var config = {
	apiKey: process.env.apiKey,
	authDomain: process.env.authDomain,
	databaseURL: process.env.databaseURL,
	projectId: process.env.projectId,
	storageBucket: process.env.storageBucket,
	messagingSenderId: process.env.messagingSenderId
};
firebase.initializeApp(config);
var db = firebase.firestore();

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
	  res.redirect('/signup', {error: true})
	});
	db.collection("users").add({
	    first: firstname,
	    last: lastname,
	    email: email,
	    uploads: {}
	})
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
			if(error) {
				var errorCode = error.code;
		  		var errorMessage = error.message;
		  		console.log(errorMessage);
			} else {
				var user = firebase.auth().currentUser;
				if(user) {
					res.redirect("/users/" + user.uid);
				} else {
					res.redirect("/login");
				}
			}
		  // res.send(errorCode + " \n" + errorMessage);
		});
	}
});

router.post('/upload', function(req, res, next) {
	var text = req.body.text;
	currentUser = firebase.auth().currentUser;
	if(currentUser != null) {
		var col = db.collection("users");
		var docs = col.get().then(snapshot => {
			snapshot.forEach(doc => {
				console.log(doc.id, '=>', doc.data());
				if(doc.data().email == currentUser.email) {
					const userRef = db.collection("users").doc(doc.id);
					entries = doc.data().uploads;
					video_title = "yes beta";
					vid_id = [video_title, text];
					name = {
						video_id: vid_id
					}
					entries.push(name);
					db.collection("users").doc(doc.id).update({uploads: entries});
				}
			})
		}).catch(err => {
			console.log("error", err);
		})
		console.log(currentUser.email);
		res.redirect('/users/' + currentUser.uid);
	} else {
		var safe = encodeURIComponent(text);
		console.log(safe);
		var result;
		request.post({
		  headers: {'content-type' : 'application/json'},
		  url:     'http://10.10.34.167:5000/video_summary',
		  body:    {"url": safe}
		}, function(error, response, body){
			result = body;
		});
		res.render('disp', {text: result});
	}
})

router.get('/signout', function(req, res, next) {
	firebase.auth().signOut().then(function() {
	  console.log('Signed Out');
	}, function(error) {
	  console.error('Sign Out Error', error);
	});
	res.redirect('/');
});

module.exports = router;
