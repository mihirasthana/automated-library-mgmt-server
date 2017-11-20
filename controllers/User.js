'use strict';

var url = require('url');

var User = require('./UserService');

module.exports.loginPOST = function loginPOST(req, res, next) {
  User.loginPOST(req.swagger.params, req, res, next);
};
