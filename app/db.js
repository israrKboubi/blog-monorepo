const mysql = require('mysql');

const connection = mysql.createPool({
  host: 'tux.h.filess.io',
  port: 3306,
  user: 'israrblog_machinery',
  password: process.env.PASSBASE,
  database: 'israrblog_machinery',
  connectionLimit : 3
});


module.exports={
  db:connection
}