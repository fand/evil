'use strict';

var index = require('./routes/index');
var users = require('./routes/users');
var songs = require('./routes/songs');
var session = require('./routes/session');
var middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  // app.route('/api/users')
  //   .post(users.create)
  //   .put(users.changePassword);
  // app.route('/api/users/me')
  //   .get(users.me);
  // app.route('/api/users/:id')
  //   .get(users.show);

  // app.route('/api/session')
  //   .post(session.login)
  //   .delete(session.logout);

  app.route('/api/songs')
    .get(songs.list)
    .post(songs.create);

  app.route('/api/songs/:song_id')
    .get(songs.get)
    .put(songs.update);

  // All undefined api routes should return a 404
  app.route('/api/*')
    .get(function(req, res) {
      res.send(404);
    });

  // // All other routes to use Angular routing in app/scripts/app.js
  // app.route('/partials/*')
  //   .get(index.partials);

  app.route('/pc')
    .get(index.pc);

  app.route('/mobile')
    .get(index.mobile);

  app.route('/*')
    .get( middleware.setUserCookie, index.index);
};
