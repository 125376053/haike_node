var Sequelize = require('sequelize')
var connect = require('./index').connect
const info = connect.define('info', {
    // 属性
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    content:{
        type: Sequelize.STRING
    },
    // 属于哪个用户下面的信息
    user_id:Sequelize.INTEGER
}, {
    // 参数
    timestamps: false, // 不应用默认生产行为
    tableName: 'info', // 设置表名
    freezeTableName:true
});

info.sync()

exports.info = info