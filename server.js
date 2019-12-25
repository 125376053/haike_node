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

// 1-访问根路由 去哪? a登录 b未登录
app.get('/',function(req,res,next) {
    console.log(req.url);
    if(req.session.user){
        res.redirect('/manage/user.html')
    }else{
        res.redirect('/manage/login.html')
    }
});

// 2-路由拦截api请求 不拦截静态页 拦截api要放在路由前面
var notLogin = ['/users/login','/users/logout','/users/getUser']
app.use(function (req, res, next) {
    let urlObj = url.parse(req.url)
    if(notLogin.indexOf(urlObj.pathname)>-1){
        next()
    }else{
        if(req.session.user){
            console.log(req.url);
            next()
        }else{
            console.log('拦截未登录')
            res.redirect('/manage/login.html')
        }
    }
})

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/product');
var infoRouter = require('./routes/info');
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/product', productRouter);
app.use('/info', infoRouter);
app.listen(3301)

// 3-找不到页面的路由拦截 要拦截页面必须放在路由下面 页面不在静态文件中 页面存在就不走这里了
app.use(function(req,res,next){
    console.log('找不到页面')
    console.log(req.url);
    if(req.session.user){
        res.redirect('/manage/user.html')
    }else{
        res.redirect('/manage/login.html')
    }
})