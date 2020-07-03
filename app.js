var express = require('express');
var app = express();
var path = require('path')
var browserify = require('browserify-middleware')

app.use('/js', browserify('./js'))
app.use(express.static(path.join(__dirname, 'public')))
app.listen(3000)