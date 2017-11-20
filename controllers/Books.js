('use strict');
var _ = require('lodash');
var url = require('url');
var userService = require('./UserService');
var Books = require('./BooksService');
const defaultErrorResponder = require('./util').defaultErrorResponder;

module.exports.booksBookIdCheckinPOST = function booksBookIdCheckinPOST(
  req,
  res,
  next
) {
  userService
    .checkSession(req, res)
    .then(session =>
      Books.booksBookIdCheckinPOST(session, req.swagger.params, res, next)
    )
    .catch(err => {
      console.error(err);
      defaultErrorResponder(err, res);
    });
};

module.exports.booksBookIdPickUpReservedBookPOST = function booksBookIdPickUpReservedBookPOST(
  req,
  res,
  next
) {
  userService
    .checkSession(req, res)
    .then(session =>
      Books.booksBookIdPickUpReservedBookPOST(session, req.swagger.params, res, next)
    )
    .catch(err => {
      console.error(err);
      defaultErrorResponder(err, res);
    });
};


module.exports.booksBookIdCheckoutPOST = function booksBookIdCheckoutPOST(
  req,
  res,
  next
) {
  userService
    .checkSession(req, res)
    .then(session =>
      Books.booksBookIdCheckoutPOST(session, req.swagger.params, res, next)
    )
    .catch(err => {
      console.error(err);
      defaultErrorResponder(err, res);
    });
};

module.exports.booksBookIdReservePOST = function booksBookIdReservePOST(
  req,
  res,
  next
) {
  userService
    .checkSession(req, res)
    .then(session =>
      Books.booksBookIdReservePOST(session, req.swagger.params, res, next)
    )
    .catch(err => {
      console.error(err);
      defaultErrorResponder(err, res);
    });
};

module.exports.booksBookIdGET = function booksBookIdGET(req, res, next) {
  Books.booksBookIdGET(req.swagger.params, res, next);
};


module.exports.booksGET = function booksGET(req, res, next) {
  Books.booksGET(req.swagger.params, res, next);
};
