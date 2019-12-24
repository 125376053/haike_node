var Sequelize = require('sequelize')
var connect = require('./index').connect
const Product = connect.define('product', {
    // 属性
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    price:{
        type: Sequelize.STRING
    },
    // 属于哪个用户下面的产品
    user_id:Sequelize.INTEGER,
    // 这个产品的图片
    imgPath:Sequelize.STRING
}, {
    // 参数
    timestamps: false, // 不应用默认生产行为
    tableName: 'Product', // 设置表名
    freezeTableName:true
});

Product.sync()

exports.Product = Product