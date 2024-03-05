
var config = require('./app/config');
var app = config.app;
var port = config.port;
var crypto = config.crypto;
const cheerio = require('cheerio');
var db = require('./app/db').db;
var utils = require('./app/utils');
const imgbox = require('imgbox-js');

app.post('/articles/add', utils.upload.single('banner'), (req, res) => {
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
    });
    connection.release();
  });
});


app.put('/articles/:id', utils.upload.single('banner'), (req, res) => {
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

app.get('/articles', (req, res) => {
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


app.get('/articles/:id', (req, res) => {
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

app.delete('/articles/:id', (req, res) => {
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


const nodemailer = require('nodemailer');

let adminToken = null;
let tokenTimestamp = null;
const tokenValidityDuration = 1 * 60 * 60 * 1000;

app.get('/auth/generate', (req, res) => {
  const randomString = utils.generateRandomString();
  adminToken = randomString;
  tokenTimestamp = Date.now();
  sendEmail('kouiisrar@gmail.com', 'Admin Token', adminToken);
  res.json({ message: 'Random string generated and sent to admin email.' });
});

function sendEmail(toEmail, subject, message) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'kouiisrar@gmail.com',
      pass: process.env.EMAILPASS || 'wnzh wmnp ulif vguj'
    }
  });

  const mailOptions = {
    from: 'kouiisrar@gmail.com',
    to: toEmail,
    subject: subject,
    text: message
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}


app.post('/auth/verify', (req, res) => {
  const { token } = req.body.password;
  if (adminToken && isTokenValid() && req.body.password === adminToken) {
    res.json({ verified: true });
  } else {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
});


function isTokenValid() {
  if (tokenTimestamp) {
    const currentTime = Date.now();
    return currentTime - tokenTimestamp <= tokenValidityDuration;
  }
  return false;
}

app.get('/auth/signout', (req, res) => {
  killtoken();
  res.json({ signout: true });
});

function killtoken() {
  let adminToken = null;
  let tokenTimestamp = null;
}


app.listen(port, () => {
  console.log(`ISrar blog listening on port ${port}`)
})