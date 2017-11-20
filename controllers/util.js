const crypto = require('crypto');
const secret = 'serversidesomesecret';

exports.passwordHasher = password =>
  crypto
    .createHmac('sha256', secret)
    .update(password)
    .digest('hex');

exports.defaultErrorResponder = (err, res, status = 500) => {
  res.statusCode = status;
  res.end(err.toString());
};
