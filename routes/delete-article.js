const articleDelete = require("express").Router();
var db = require('../app/db').db;

articleDelete.delete('/articles/:id', (req, res) => {
    const { id } = req.params;
    db.getConnection(function (err, connection) {
      connection.query(`DELETE FROM articles WHERE id = ?`, [id], function (err, result) {
      if (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
        connection.release();
      } else if (result.affectedRows > 0) {
        res.send({});
      } else {
        res.status(404).send("Article not found");
      }
    });
    connection.release();
  });
  });

  module.exports = articleDelete;