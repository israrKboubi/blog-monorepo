
const cheerio = require('cheerio');
var db = require('../app/db').db;
const articles = require("express").Router();

articles.get('/articles', (req, res) => {
  db.getConnection(function (err, connection) {
    connection.query(`SELECT * FROM articles ORDER BY date DESC;`, (err, rows) => {
      if (err) {
        connection.release();
        console.error(err.message);
        res.status(500).send("Internal Server Error");
      } else {
        const articlesWithFilePaths = rows.map(row => {
          const $ = cheerio.load(row.content);
          const p = $('p').slice(0, 2);
          const h1 = $('h1').slice(0, 2);
          const h2 = $('h2').slice(0, 2);
          const h3 = $('h3').slice(0, 2);
          var text = "";
          if (h1.length)
            h1.each((index, element) => { text += $(element).text() + "<br>d"; });
          if (h3.length)
            h3.each((index, element) => { text += $(element).text() + "<br>d"; });
          if (h2.length)
            h2.each((index, element) => { text += $(element).text() + "<br>d"; });
          if (p.length)
            p.each((index, element) => { text += $(element).text() + "<br>d"; });
          if (text == "") {
            text = row.content;
          }
          return { ...row, content: text };
        });
        res.send(articlesWithFilePaths);
      }
    });
    connection.release();
  });
});

articles.get('/articles/:id', (req, res) => {
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

var utils = require('../app/utils');
const imgbox = require('imgbox-js');
const crypto = require('crypto');

articles.post('/articles', utils.upload.single('banner'), (req, res) => {
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

module.exports = articles;