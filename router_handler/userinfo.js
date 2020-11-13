//获取用户信息路由处理函数
//导入数据库操作模块
const db = require("../db/index");
const bcrypt = require("bcryptjs"); //导入模块将用户输入的密码进行加密和数据库中的比较

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

//2.修改用户的基本信息
exports.updataUserInfo = (req, res) => {
    //创建执行的sql语句
    const sql = "update ev_users set ? where id=?"
    db.query(sql, [req.body, req.body.id], (err, results) => {
        console.log(results);
        //如果执行SQL语句失败
        if (err)
            return res.crs(err);

        //进行修改，添加，删除的时候，可以使用results.affectedRows（受影响的行数）来判断是否修改成功
        if (results.affectedRows !== 1)
            return res.crs("修改用户信息失败");
        //如果修改用户信息成功
        return res.crs("修改用户信息成功", 0);

    })
}

//3.重置密码的路由处理函数
//思路：根据id判断是否有该用户，如果有的话再判断输入的旧密码是否和数据库里面的一致，如果一致再修改数据库里面的密码
exports.updatePassword = (req, res) => {
    //3.1先查询id是否存在
    const sqlStr = `select * from ev_users where id=?`;
    //3.2执行查询语句
    db.query(sqlStr, req.user.id, (err, results) => {
        if (err)
            return res.crs(err);
        if (results.length !== 1)
            return res.crs("用户不存在");
        console.log(results);
        //判断提交的旧密码是否正确
        //返回一个布尔值，如果相同就返回true，如果不相同就返回false
        const compareResults = bcrypt.compareSync(req.body.oldPwd, results[0].password);
        if (!compareResults)
            return res.crs("原密码错误！");


        //如果oldPwd和数据库中的一致，就更新密码
        const sql = "update ev_users set password=? where id=?";
        //对新密码进行加密
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10);
        //执行sql语句，根据id来更新用户的密码
        db.query(sql, [newPwd, req.user.id], (err, results) => {
            //sql语句执行失败
            if (err) {
                return res.crs(err)
            };
            if (results.affectedRows !== 1) {
                return res.crs("用户密码修改失败")
            };
            res.crs("修改密码成功", 0);
        })



    })
}