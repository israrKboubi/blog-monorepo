var db = require('../app/db').db;
var utils = require('../app/utils');
const imgbox = require('imgbox-js');

const articleUpdate = require("express").Router();


articleUpdate.put('/articles/:id', utils.upload.single('banner'), (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    var banner = req.file ? req.file.filename : null;
    db.getConnection(function (err, connection) {
      connection.query(`SELECT * FROM articles  WHERE id = ?`, [id], (err, row) => {
        if (err) {
          connection.release();
          console.error(err.message);
          res.status(500).send("Internal Server Error");
        } else {
          if (banner == null) {
            banner = row[0].banner;
            connection.query(`UPDATE articles SET title = ?, banner = ?, content = ? WHERE id = ?`, [title, banner, content, id], function (err, result) {
              if (err) {
                console.error(err.message);
                res.status(500).send("Internal Server Error");
              } else if (result.affectedRows > 0) {
                res.send({ title, banner, content });
              } else {
                res.status(404).send("Article not found");
              }
            });
  
  
          } else {
            const image2 = { source: 'app/uploads/' + banner, filename: banner };
            imgbox.imgbox(image2).then(result => {
              let image = "";
              if (result.ok) {
                image = result.data[0].original_url;
              }
              connection.query(`UPDATE articles SET title = ?, banner = ?, content = ? WHERE id = ?`, [title, image, content, id], function (err, result) {
                if (err) {
                  connection.release();
                  console.error(err.message);
                  res.status(500).send("Internal Server Error");
                } else if (result.affectedRows > 0) {
                  res.send({ title, image, content });
                } else {
                  res.status(404).send("Article not found");
                }
              });
            });
          }
        }
        connection.release();
      });
    });
  });
  
  module.exports = articleUpdate;