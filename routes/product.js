var express = require('express');
var router = express.Router();

var connect = require('../model/index').connect // 原始查询
var User = require('../model/User').User
var Product = require('../model/Product').Product

router.get('/list', async function (req, res, next) {
    var {page,pageCount} = req.query
    var skip = (page-1)*pageCount

    let count = await connect.query(`select * from product`)
    let ret = await connect.query(`select * from product order by id desc limit ${skip},${pageCount}`)
    console.log(ret[0]);
    res.json({
        code:1,
        msg:'',
        data:ret[0],
        count:count.length
    })
});

router.post('/add', async function (req, res, next) {
    var {name, price, imgPath} = req.body
    console.log(name, price, imgPath,req.session);
    let ret = await connect.query(`insert into product (name,price,imgPath,user_id) values ('${name}','${price}','${imgPath}',${req.session.user.id})`)
    console.log(ret);
    res.send({
        code:1,
        msg:''
    })
});

router.post('/update', async function (req, res, next) {
    var {name,price,imgPath,id} = req.body
    console.log(name.price, imgPath);
    let ret = await connect.query(`update product set name='${name}', price='${price}', imgPath='${imgPath}' where id =${id}`)
    console.log(ret);
    res.send({
        code:1,
        msg:''
    })
});

router.get('/remove', async function (req, res, next) {
    var {id} = req.query
    let ret = await connect.query(`delete from product where id =${id}`)
    console.log(ret);
    res.send({
        code:1,
        msg:''
    })
});

module.exports = router;
