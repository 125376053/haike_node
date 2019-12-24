var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')

var url = require('url')
const redis = require('redis')
var client = redis.createClient(6379, '39.106.94.75', {
    auth_pass: '123456'
});

var session = require('express-session');
var RedisStrore = require('connect-redis')(session);

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: '123123',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge:1000 * 60 * 60 * 24
    },
    store: new RedisStrore({
        client
    }),
}));

// 路由拦截中间件 拦截api请求 不拦截静态页
var notLogin = ['/users/login','/users/logout','/users/getUser']
app.use(function (req, res, next) {
    let urlObj = url.parse(req.url)
    if(notLogin.indexOf(urlObj.pathname)>-1){
        next()
    }else{
        console.log(req.session.user);
        if(req.session.user){
            next()
        }else{
            res.redirect('/manage/login.html')
        }
    }
})

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/product');
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/product', productRouter);
app.listen(3301)

