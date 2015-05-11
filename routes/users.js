var express = require('express');
var router = express.Router();
var Users = require('../models/users');
var Votes = require('../models/votes');

router.get('/', function(req, res, next) {
  res.send('User profiles');
});

router.route('/create')
	.post(function(req,res) {
		var user = new Users();
        var userData = req.session.newUser;
        user._id = userData.id;
		user.fname = userData.first_name;
		user.lname = userData.last_name;
		user.email = req.body.email;
		user.bio = req.body.bio;
		user.major = req.body.major;
		user.gradyr = req.body.gradyr;
		user.save(function(err) {
			if(err) { 
                res.send(err); 
                return; 
            }
            req.session.user = userData;
            res.redirect('/');
		});	
	});

router.route('/:user_id')
    .get(function(req, res) {
        Users.findOne({ _id: req.params.user_id }, function(err, profile) {
            if(err) { 
                res.send(err);
                return;
            }
            Votes.find({ user: profile._id }).populate('project').exec(function(err, votes) {
                console.log(votes);
                res.render('profile', { votes: votes, profile: profile, user: req.session.user });
            });
        });
    })
	.delete(function(req,res) {
		Users.remove({
			_id : req.params.user_id
		}, function(err, user) {
			if(err) { 
                res.send(err);
                return;
            }
			res.json({message: 'User deleted'});
		});
	});


module.exports = router;
