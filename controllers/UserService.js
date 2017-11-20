'use strict';
var _ = require('lodash');
var db = require('./db');
const passwordHasher = require('./util').passwordHasher;
const uuid = require('node-uuid');

const SESSION_HEADER_KEY = 'X-Session-Token';

// var basicAuthenticator = basic(function(user, pass, callback) {
//   console.log('basicAuthenticator');
//   console.log(user);
//   console.log(pass);

//
//   if (user === 'test' && pass === 'pass') return callback(null);
//   callback(new Error('Access Denied'));
// });
function generateSession(user) {
  const sessionToken = uuid.v4();
  return db
    .none(
      'INSERT INTO user_sessions(user_id, session_id) VALUES (${userId}, ${sessionId})',
      { userId: user.id, sessionId: sessionToken }
    )
    .then(() => sessionToken);
}

exports.loginPOST = function(args, req, res, next) {
  /**
   * Logs in and returns the authentication  cookie
   *
   * loginRequest LoginRequest A JSON object containing the login and password.
   * no response value expected for this operation
   **/
  // console.log(args);
  const username = req.body.username;
  const password = req.body.password;
  console.log(username, passwordHasher(password));
  db
    .one(
      'SELECT * FROM users WHERE username = ${username} and password = ${hashedPassword}',
      { username, hashedPassword: passwordHasher(password) }
    )
    .then(user => {
      const session = generateSession(user);
      var returnUser = _.omit(user, 'password');
      return { user: returnUser, session };
    })
    .then(userSession => {
      const sessionTokenPromise = userSession.session;
      const user = userSession.user;
      return sessionTokenPromise.then(session => {
        res.writeHead(200, {
          'Set-Cookie': SESSION_HEADER_KEY + '=' + session,
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify(user));
      });
    })
    .catch(err => {
      res.writeHead(401);
      // res.end(err.toString());
      res.end('Authentication failed');
    });
};

/**
 * 
 * @param {Request} req 
 * @returns {Promise[SessionObject]}
 */
exports.checkSession = function(req, res) {
  function sendUnauthenticatedResp() {
    res.statusCode = 401;
    res.end();
  }
  try {
    if (_.isUndefined(req.headers.cookie)) throw 'No cookie';
    const sessionKey = req.headers.cookie
      .split(';')[0]
      .split(SESSION_HEADER_KEY + '=')[1];
    console.log(sessionKey);
    // TODO: Add a timestamp column to the db, so that session expiry can be calculated here
    return db
      .one('SELECT * FROM user_sessions WHERE session_id = ${sessionKey}', {
        sessionKey,
      })
      .catch(e => {
        sendUnauthenticatedResp();
        throw e;
      });
  } catch (e) {
    sendUnauthenticatedResp();
    throw e;
  }
};
