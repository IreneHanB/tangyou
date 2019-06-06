var express= require('express');
var path = require('path');
var bodyParser = require('body-parser');

var session = require('express-session')
var router = require('./router')
var app = express();
app.use('/public/',express.static('./public/'));
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))
//app.set('views',path.join(__dirname,'./views/'));
//配置模版引擎
app.engine('html',require('express-art-template'));
//app.set('views', path.join(__dirname, './views/'))
//配置body-parser中间件（插件，专门用来解析表单POST）
app.use(bodyParser.urlencoded({extended:false}))

app.use(bodyParser.json());





app.use(session({
    secret: 'itcast',
    resave: false,
    saveUninitialized: false
}))

app.use(router);
app.listen(3000,function(){
    console.log('running')
})