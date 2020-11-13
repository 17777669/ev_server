//创建一个操作数据库的对象
//导入数据库的第三方模块
const mysql = require("mysql");
//创建一个链接数据库的对象
const db = mysql.createPool({
    host: "127.0.0.1", //要访问的数据库的ip地址
    user: "root", //数据库的用户
    password: "root", //数据库的密码
    database: "ev_server" //要访问的数据库的名称
})

//导出数据库的对象
module.exports = db;