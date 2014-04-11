var express = require('express');
var cors = require('cors');
var request = require("request");
var jsdom = require("jsdom");
var bodyParser = require("body-parser");

request = request.defaults({jar: true});

var protection = function($a, $b, $c) {
    var $r = 0;
    $a = $c * 2;
    for (var $i = 0; $i < $c; $i++) {
        $r = $r + $i * $b;
    }
    return $r;
}

var app = express();
app.use(cors());
app.use(bodyParser());

app.get('/ideone-post/proxy', function(req, res) {
  request({
    uri: 'http://ideone.com',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:15.0) Gecko/20120427 Firefox/15.0a1'
    },
    method: 'GET'
  }, function(error, response, body) {
      res.send(body);
  });
});

app.post('/ideone-post/submit', function(req, res) {
  request({
    uri: 'http://ideone.com',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:15.0) Gecko/20120427 Firefox/15.0a1'
    },
    method: 'GET'
  }, function(error, response, body){
    //console.log(body);
    jsdom.env(
      body,
      ["jquery-1.11.0.min.js"],
      function(errors, window) {
        p1 = window.$("#p1").attr("value");
        p2 = window.$("#p2").attr("value");
        p3 = window.$("#p3").attr("value");
        p4 = protection(p1, p2, p3);
        //p4 is loaded via js, so after unpacking the ideone code, we can get p4 via some function that they packed.
        //console.log(p1);
        //console.log(p2);
        //console.log(p3);
        //console.log(p4);
        //post that request
        request({
          uri: 'http://ideone.com/ideone/Index/submit',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:15.0) Gecko/20120427 Firefox/15.0a1'
          },
          method: 'POST',
          form: {'p1': p1,
                 'p2': p2,
                 'p3': p3,
                 'p4': p4,
                 'clone_link': '/',
                 'file': req.param("src"),
                 '_lang': req.param("lang"),
                 'input': req.param("input"),
                 'run': '1',
                 'public': '1'},
        }, function(error, response, body) {
          //console.log(error);
          res.send({url : "http://ideone.com" + response['headers']['location']});
          //console.log(body);
        });
      }
    );
  });
});

var server = app.listen(4040, function() {
  console.log('Listening on port %d', server.address().port);
});
