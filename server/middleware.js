'use strict';

module.exports = {

  /**
   *  Protect routes on your api from unauthenticated access
   */
  auth: function auth(req, res, next) {
    if (req.isAuthenticated()) return next();
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
    var is_ie = !!ua.match(/msid/);

    if (ua.match(/msie/)) {
      return res.redirect('/pc');
    }

    if (ua.match(/iPhone|iPod|Android/)) {
      return res.redirect('/mobile');
    }

    return next();
  },

  csrf: function (req, res, next) {
    if (!req.xhr) { return res.send(401); }
    return next();
  }
};
