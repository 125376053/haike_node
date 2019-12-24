var express = require('express');
var router = express.Router();

var connect = require('../model/index').connect // 原始查询
var User = require('../model/User').User
var encryUtils = require('../utils/encryUtils.js');

router.post('/login', async function (req, res, next) {
    let {user, pass} = req.body

    // 原始查询
    let ret = await connect.query(`select * from user where username='${user}'`, {
        replacements: ['active'],
        type: connect.QueryTypes.SELECT
    })
    //1 找到了 有此用户存在
    if (ret.length > 0) {
        // 2 验证密码 将密码加密后和数据库密码比较
        if (ret[0].password == encryUtils.encrypt(pass)) {
            req.session.user = ret[0]
            console.log(req.session.user);
            res.json({
                code: 1,
                msg: '登录成功',
                data: ret[0]
            })
        } else {
            res.json({
                code: -1,
                msg: '密码不对'
            })
        }
    } else {
        // 3 用户不存在 直接保存用户到数据库 保存密码加密
        let save = await connect.query(`insert into user (username,password) values ('${user}','${encryUtils.encrypt(pass)}')`, {
            replacements: ['active'],
            type: connect.QueryTypes.INSERT
        })
        let ret2 = await connect.query(`select * from user where username='${user}'`, {
            replacements: ['active'],
            type: connect.QueryTypes.SELECT
        })
        // 4 登录状态保存session
        req.session.user = ret2[0]
        console.log(req.session.user);
        res.json({
            code: 1,
            msg: '登录成功',
            data: ret2[0]
        })
    }
});

router.get('/getUser',async function(req,res){
    if(!req.session.user){
        res.json({
            code:-1,
            msg:'暂无登录'
        })
    }else{
        let ret2 = await connect.query(`select * from user where id=${req.session.user.id}`, {
            replacements: ['active'],
            type: connect.QueryTypes.SELECT
        })
        res.json({
            code:1,
            msg:'123',
            data:ret2[0]
        })
    }
})

router.get('/logout',async function(req,res){
    let ret2 = await connect.query(`delete from user where id=${req.session.user.id}`)
    console.log(ret2);
    delete req.session.user
    res.json({
        code:1,
        msg:'shanchu'
    })
})

router.get('/list', async function (req, res, next) {
    var page = parseInt(req.query.page||1)
    var limit = parseInt(req.query.pageCount||1)
    var skip = parseInt((page-1)*limit)

    let count = await connect.query(`select * from user`,{
        replacements: ['active'],
        type: connect.QueryTypes.SELECT
    })
    let ret = await connect.query(`select * from user limit ${skip},${limit}`, {
        replacements: ['active'],
        type: connect.QueryTypes.SELECT
    })
    console.log(count.length,ret);
    res.json({
        code: 1,
        msg: '',
        data: ret,
        count:count.length
    })
})

router.get('/resetPass', async function(req,res,next){
    var id = req.query.id
    var resetPass = encryUtils.encrypt('123456')
    let re = await connect.query(`update user set password='${resetPass}' where id = ${id}`,{
        replacements: ['active'],
        type: connect.QueryTypes.DELETE
    })
    console.log(re);
    res.json({
        code: 1,
        msg: ''
    })
})

router.get('/remove', async function (req, res, next) {
    var id = req.query.id
    let re = await connect.query(`delete from user where id = ${id}`,{
        replacements: ['active'],
        type: connect.QueryTypes.DELETE
    })
    console.log(re);
    res.json({
        code: 1,
        msg: ''
    })
})

module.exports = router;
