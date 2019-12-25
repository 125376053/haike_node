var express = require('express');
var router = express.Router();

var connect = require('../model/index').connect // 原始查询
var User = require('../model/User').User
var info = require('../model/info').info

// 查询 分页 排序 列表
router.get('/list', async function (req, res, next) {
    var user = req.session.user
    var title = req.query.title||''
    var content = req.query.content
    var {page,pageCount} = req.query
    var skip = (page-1)*pageCount
    let count = await connect.query(`select * from info where user_id=${user.id} and title like '%${title}%'`)
    let ret = await connect.query(`select * from info where user_id=${user.id} and title like '%${title}%' order by id desc limit ${skip},${pageCount}`)
    res.json({
        code:1,
        msg:'',
        data:ret[0],
        count:count[0].length
    })
});

router.post('/add', async function (req, res, next) {
    var {content, title} = req.body
    let ret = await connect.query(`insert into info (title,content,user_id) values ('${title}','${content}',${req.session.user.id})`)
    res.send({
        code:1,
        msg:''
    })
});

router.post('/update', async function (req, res, next) {
    var {content,title,id} = req.body
    //console.log(name.price, imgPath);
    let ret = await connect.query(`update info set title='${title}', content='${content}' where id =${id}`)
    //console.log(ret);
    res.send({
        code:1,
        msg:''
    })
});

router.get('/remove', async function (req, res, next) {
    var {id} = req.query
    let ret = await connect.query(`delete from info where id =${id}`)
    //console.log(ret);
    res.send({
        code:1,
        msg:''
    })
});

router.get('/look', async (req,res)=>{
    var id = req.query.id

    // 链表查询
    // let ret = await connect.query(`select * from info where id = ${id}`)
    let ret = await connect.query(`select * from info join user on info.user_id = user.id where info.id=${id}`,{
        replacements: ['active'],
        type: connect.QueryTypes.SELECT
    })
    //console.log(ret);
    res.json({
        code:1,
        msg:'',
        data:ret[0]
    })
})

module.exports = router;
