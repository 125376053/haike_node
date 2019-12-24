var Sequelize = require('sequelize')
var connect = require('./index').connect
const User = connect.define('user', {
    // 属性
    username:{
        type: Sequelize.STRING,
        allowNull: false
    },
    password:{
        type: Sequelize.STRING
    }
}, {
    // 参数
    timestamps: false, // 不应用默认生产行为
    tableName: 'user', // 设置表名
    freezeTableName:true
});

User.sync()

exports.User = User