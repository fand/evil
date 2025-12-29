'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  passport = require('passport');

/**
 * Create user
 */
module.exports.create = async function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  try {
    await newUser.save();
    req.logIn(newUser, function (err) {
      if (err) return next(err);
      return res.json(req.user.userInfo);
    });
  } catch (err) {
    return res.status(400).json(err);
  }
};

/**
 *  Get profile of specified user
 */
module.exports.show = async function (req, res, next) {
  var userId = req.params.id;

  try {
    var user = await User.findById(userId);
    if (!user) return res.status(404).send();
    res.json({ profile: user.profile });
  } catch (err) {
    return next(err);
  }
};

/**
 * Change password
 */
module.exports.changePassword = async function (req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  try {
    var user = await User.findById(userId);
    if (!user) return res.status(404).send();

    if (user.authenticate(oldPass)) {
      user.password = newPass;
      await user.save();
      res.status(200).send();
    } else {
      res.status(403).send();
    }
  } catch (err) {
    return next(err);
  }
};

/**
 * Get current user
 */
module.exports.me = function (req, res) {
  res.json(req.user || null);
};
