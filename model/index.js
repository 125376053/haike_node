const Sequelize = require('sequelize');
const connect = new Sequelize('haike', 'root', 'Lbj19910115', {
    host: 'rm-uf6o1yx8qjr29zuc86o.mysql.rds.aliyuncs.com',
    dialect: 'mysql',
    port:3306,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    dialectOptions:{
        dateStrings:true,
        typeCast:true
    },
    define: {
        charset: 'utf8mb4'
    }
});

exports.connect = connect