var express = require('express');
var app = express();
var mongoose = require('mongoose');
var mongoosePagination = require('mongoose-pagination');

app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
});

mongoose.connect('mongodb://localhost/acronyms');

var acronym = mongoose.model('Acronym', {
  acronym: String,
  created: Date,
  comments: [{
    user: String,
    comment: String,
    date: Date
  }],
  definition: String
});

function quote(str) {
  return str.replace(/(?=[\/\\^$*+?.()|{}[\]])/g, "\\");
}

app.post('/acronym', function (req, res) {
  if (req.body._id) {
    acronym.update({_id: req.body._id}, req.body, function (err, acronym) {
      res.send(acronym);
    });
  } else {
    acronym.create(req.body, function (err, acronym) {
      res.send(acronym);
    });
  }
});

app.get('/acronyms', function (req, res) {
  var find = {};
  var page = 1;
  if (req.query.query != undefined && req.query.query.length < 12) {
    find.acronym = new RegExp(quote(req.query.query), 'i');
  }
  if (req.query.page != undefined) {
    page = parseInt(req.query.page);
  }
  acronym.find(find)
  .sort({acronym: 1})
  .paginate(page, 10, function (err, acronyms, total) {
    if (err) {
      res.send(500);
    }
    var results = {
      items: acronyms,
      total: total,
      page: page,
      pages: Math.ceil(total / 10)
    };
    res.send(results);
  })
});

app.listen('8000');