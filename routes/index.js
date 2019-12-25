var express = require('express');
var router = express.Router();
var fs = require('fs')
var path = require('path')

var formidable = require('formidable'); //专门处理图片上传的
var uuid = require('uuid'); //生成绝对不重复的字符串

var connect = require('../model/index').connect // 原始查询
var User = require('../model/User').User
var Imgs = require('../model/imgs').Imgs

router.post('/common/upload/img', async function (req, res, next) {

    new formidable.IncomingForm().parse(req,function (err, fields, files) {
        //console.log(files.file.name); //上传后图片的名字
        //console.log(files.file.path); //上传后图片的默认地址
        var filename = uuid.v4() + path.extname(files.file.name);//不重复字符串+图片后缀名
        fs.createReadStream(files.file.path).pipe(
            fs.createWriteStream(
                path.normalize(
                    path.join(__dirname, '../public/upload/',filename)
                )
            )
        );
        /*
         访问静态资源路由地址 public目录下 去掉public
         http://localhost:3001/upload/1.html
         1数据库中保存的图片是不带域名的
         2图片的关联用户是谁
         {
         name:'zhangchaojie',
         img:'/upload/90c0d5e1-279c-4476-922f-9021bdfeaf62.png'
         }
         */

        connect.query(`insert into imgs (src) values ('${req.headers.origin}/upload/${filename}')`).then(ret=>{
            //console.log(ret);
        })

        //把文件名发送给客户端 ajax data数据 ret
        res.json({
            code:1,
            msg:'',
            data:req.headers.origin+'/upload/'+filename  // req.headers.origin+
        });
    })
})

module.exports = router;
