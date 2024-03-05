
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
            h1.each((index, element) => { text += $(element).text() + "<br>"; });
          if (h3.length)
            h3.each((index, element) => { text += $(element).text() + "<br>"; });
          if (h2.length)
            h2.each((index, element) => { text += $(element).text() + "<br>"; });
          if (p.length)
            p.each((index, element) => { text += $(element).text() + "<br>"; });
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

  module.exports = articles;