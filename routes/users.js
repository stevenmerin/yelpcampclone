const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');

router.route('/register')
  .get(users.renderRegister)
  .post(catchAsync(users.register));

router.route('/login')
  .get(users.renderLogin)
  .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), users.login);

router.get('/logout', users.logout); 

module.exports = router;

// this logout code only works on passport@0.5.3
// req.logout(function(err) {
//   if (err) { return next(err); }
//   req.flash('success', "Goodbye!");
//   res.redirect('/campgrounds');
// });

// req.logOut();
// req.flash('success', "Goodbye!");
// res.redirect('/campgrounds');