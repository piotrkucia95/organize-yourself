const keys = require('../config/keys');
const promise = require('bluebird');
const pgp = require('pg-promise')({
    promiseLib: promise
});

// const connectionString = process.env.DATABASE_URL;
const connectionString = keys.postgresDatabase;

// pgp.pg.defaults.ssl = true;
var db = pgp(connectionString);

module.exports = db;