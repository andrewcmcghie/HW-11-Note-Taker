var path = require('path');
var fs = require('fs');

var express = require('express');
var { uuid } = require('uuidv4');

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/notes', function (req, res) {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

//////////////******************* */
app.get('/api/notes', function (req, res) {
  fs.readFile(__dirname + '/db/db.json', (err, data) => {
    if (err) throw err;
    var db = JSON.parse(data);
    res.send(db);
  });
});

app.post('/api/notes', function (req, res) {
  let note = { ...req.body, id: uuid() };

  fs.readFile(__dirname + '/db/db.json', (err, data) => {
    if (err) throw err;
    var db = JSON.parse(data);
    db.push(note);

    fs.writeFile(__dirname + '/db/db.json', JSON.stringify(db), (err, data) => {
      if (err) throw err;
      res.send(data);
    });
  });
});

app.delete('/api/notes/:id', function (req, res) {
  fs.readFile('db/db.json', (err, data) => {
    var db = JSON.parse(data);
    var savedNote = db.filter((item) => item.id !== req.params.id);
    fs.writeFile('db/db.json', JSON.stringify(savedNote, null, 2), (err) => {
      if (err) throw err;
      res.send(req.body);
    });
  });
});

app.listen(PORT, function () {
  console.log('App listening on PORT ' + PORT);
});
