const config = require('../config.json');

const pgp = require('pg-promise')();
const db = pgp(config.db);

module.exports = db;
