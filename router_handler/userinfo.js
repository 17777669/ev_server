//获取用户信息路由处理函数
//导入数据库操作模块
const db = require("../db/index");

//1.获取用户信息
exports.getUserInfo = (req, res) => {
    // console.log(req.user);
    //定义sql语句，根据用户的id来查询用户的信息,为了安全，排除用户的密码
    const sql = `select id,username,nickname,email,user_pic from ev_users where id=?`;
    //执行sql语句
    db.query(sql, req.user.id, (err, results) => {
        //执行sql语句出错的话
        if (err)
            return res.crs("数据查询失败");
        //如果没有查询到数据
        if (results.length !== 1)
            return res.crs("获取用户信息失败！");
        //如果查询到了数据，就将数据返回给客户端
        res.send({
            status: 0,
            message: "获取用户基本信息成功！",
            data: results[0]
        })
    })
}