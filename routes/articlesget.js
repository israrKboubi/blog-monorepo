

var db = require('../app/db').db;
const articlesGet = require("express").Router();

articlesGet.get('/articles/:id', (req, res) => {
    const { id } = req.params;
    db.getConnection(function (err, connection) {
      connection.query(`SELECT * FROM articles WHERE id = ?`, [id], (err, row) => {
        if (err) {
          connection.release();
          console.error(err.message);
          res.status(500).send("Internal Server Error");
        } else if (row) {
          res.send(row[0]);
        } else {
          res.status(404).send("Article not found");
        }
      });
      connection.release();
    });
  });

  module.exports = articlesGet;