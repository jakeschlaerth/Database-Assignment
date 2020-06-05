var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_schlaerj',
  password        : '0307',
  database        : 'cs290_schlaerj'
});

module.exports.pool = pool;
