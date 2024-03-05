
var db = require('../app/db').db;
var utils = require('../app/utils');
const imgbox = require('imgbox-js');
const crypto = require('crypto');

const articleAdd = require("express").Router();


articleAdd.post('/articles/add', utils.upload.single('banner'), (req, res) => {
    const { title, content } = req.body;
    const banner = req.file ? req.file.filename : null;
    const sweetId = crypto.randomBytes(3).toString('hex') + "-" + title.replace(/ /g, '-');
    const image2 = { source: 'app/uploads/' + banner, filename: banner };
    imgbox.imgbox(image2).then(result => {
      let image = "";
      if (result.ok) {
        image = result.data[0].original_url;
      }
      db.getConnection(function (err, connection) {
        connection.query(`INSERT INTO articles (id,title, banner, content,date) VALUES (?,?, ?, ?, ?)`, [sweetId, title, image, content, new Date().toISOString()], function (err) {
          if (err) {
            console.error(err.message);
            res.status(500).send("Internal Server Error");
          } else {
            const articleData = {
              id: sweetId,
              title,
              image,
              content,
            };
            res.send({ id: articleData.id, title, image, content });
          }
        });
        connection.release();
      });
    });
  });

  module.exports=articleAdd;