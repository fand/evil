'use strict';

module.exports = {

  /**
   *  Protect routes on your api from unauthenticated access
   */
  auth: function auth(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.send(401);
  },

  /**
   * Set a cookie for angular so it knows we have an http session
   */
  setUserCookie: function(req, res, next) {
    if(req.user) {
      res.cookie('user', JSON.stringify(req.user.userInfo));
    }
    return next();
  },

  redirector: function(req, res, next){
    var ua = req.headers['user-agent'];
    if (ua == null) {
      return next();
    }
    if (ua.match(/msie/ig)) {
      req.is_ie = true;
    }
    if (ua.match(/iPhone|iPod|Android/ig)) {
      req.is_mobile = true;
    }

    return next();
  },

  csrf: function (req, res, next) {
    if (!req.xhr) { return res.send(401); }
    return next();
  }
};
