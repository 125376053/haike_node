var Sequelize = require('sequelize')
var connect = require('./index').connect
const Imgs = connect.define('imgs', {
    src:Sequelize.STRING
}, {
    // 参数
    timestamps: false, // 不应用默认生产行为
    tableName: 'imgs', // 设置表名
    freezeTableName:true
});

Imgs.sync()

exports.Imgs = Imgs

/*
就是单纯存一张图片路径 不带前缀的
    1 如果产品要用就把图片地址直接存到产品库中
    2 这样就知道这个产品所对应的图片了
*/