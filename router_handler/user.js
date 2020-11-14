// 在这里定义用户路由处的路由处理函数，供router/user.js调用
//导入需要的模块
const db = require("../db/index"); //用来操作数据库中的表
const bcrypt = require("bcryptjs"); //用来对用户的密码进行加密
const jwt = require("jsonwebtoken"); //用来将用户的信息转为token
const config = require("../config");



//1注册用户的处理函数
//1.1检测用户输入的数据是否合法
//1.2判断用户名是否重复
//1.3为了安全，将用户的密码进行加密操作
//1.4将注册的新用户的信息添加到数据库中
exports.regUser = (req, res) => {
    let userinfo = req.body;
    if (!userinfo.username || !userinfo.password) {
        // return res.send({
        //     status: 1,
        //     msg: "用户名或者密码不能为空"
        // })
        //调用自定义的中间件添加的函数
        return res.crs("用户名或者密码不能为空")
    }
    //判断用户名是否由重复的
    const sqlStr = "select * from ev_users where username=?";
    //根据占位符有多个，就使用数组来传递参数，如果占位符就一个可以就可以不使用数组的形式来传递参数
    db.query(sqlStr, [userinfo.username], (err, results) => {
        if (err) {
            return res.send(err.message)
        }
        //如果数据库的查询成功,如果执行的是一个查询语句，返回的是一个数组，表示是查询到的对象
        if (results.length > 0) {
            return res.send({
                status: 1,
                msg: "用户名重复，请重新输入用户名"
            })
        }

        //如果用户输入的内容正确，且用户名也不重复，添加数据
        //给用户的密码加密
        userinfo.password = bcrypt.hashSync(userinfo.password, 10);
        // console.log(userinfo);



        //插入数据的快捷方式，使用一个占位符 的时候传递一个对象就可以了
        //插入数据的语句一定要放在这里，因为它是异步的，不然会和查询的语句一起执行
        const sql = `insert into ev_users set ?`;
        db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            if (err) {
                return res.send(err.message)
            }

            if (results.affectedRows !== 1) {
                return res.send({
                    status: 1,
                    msg: "用户注册失败！"
                })
            }

            return res.send({
                status: 0,
                msg: "用户注册成功！"
            })
        })
    })
};



//2.登录
// 1. 验证表单数据是否合法
// 2. 根据用户名查询用户的数据，是否有该用户
// 3. 判断用户输入的密码是否正确
// 4. 生成JWT的Token字符串
exports.login = (req, res) => {
    //1.接受输入表单是数据
    let userinfo = req.body;
    //2.定义slq语句，用于查询用户的数据
    const sql = "select * from ev_users where username=?";
    //3.执行sql语句
    db.query(sql, userinfo.username, (err, results) => {
        //如果查询错误
        if (err)
            return res.crs(err);
        //如果没有查询到与用户名对应的数据
        if (results.length !== 1)
            return res.crs("用户名错误");

        //判断用户输入的密码是否和数据库中的一致思路：
        //调用bcrypt.compareSync(用户提交的密码，数据库中的密码)方法来比较，该方法返回的是一个布尔值，（true一致，flase不一致）

        //如果查询到了数据
        //如果sql是查询的话，就会返回一个查询的结果的集合，如果是增加，删除，修改就不是
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password);
        //判断登录的结果
        if (!compareResult) {
            return res.crs("登录失败，密码错误！")
        }
        //如果登录成功的话就生成Token的字符串
        // 注意：生成了token的时候一定要剔除密码和头像的值,剔除密码是为了防止其他人解析token获取到了密码的值
        //如果用户自定义的属性，放在扩展运算符后面，则扩展运算符内部的同名属性会被覆盖掉。
        const user = {...results[0], password: "", user_pic: "" };
        //将用户信息生成token字符串,有效期为10小时
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: "10h" });
        // console.log(tokenStr);
        //将登录成功后用户的信息返回给用户
        res.send({
            status: 0,
            message: "登录成功",
            //为了方便客户端使用token，在服务器直接拼上Bearer，注意后面的空格
            token: "Bearer " + tokenStr
        })
    })
};