//导入数据库
const db = require("../db/index");


//1.文章分类管理的路由处理函数
exports.getArticleCates = (req, res) => {
    //创建sql语句，用来查询没有被删除的书籍，并且根据id来升序
    const sql = `select * from ev_article_cate where is_delete=0 order by id asc`;

    //执行sql语句
    db.query(sql, (err, results) => {
        if (err) {
            res.crs(err);
        }
        res.send({
            status: 0,
            message: "数据获取成功",
            data: results
        })
    })
}

//2.新增分类的路由处理函数
//思路：校验用户输入的数据,判断数据库中是否有和数据库中的分类名称或者分类别名相同，如果相同就提示用户名称重复，如果灭有就加入
exports.addArticleCates = (req, res) => {
    // res.send("ok")
    //获取用户输入的数据
    const data = req.body;
    //创建sql语句，用于判断数据库中是否有相同name或者相同alias的分类
    const sqlStr = `select * from ev_article_cate where name=? or alias=?`;
    //执行sql语句
    db.query(sqlStr, [data.name, data.alias], (err, results) => {
        if (err)
            return res.crs(err);
        if (results.length === 2)
            return res.crs("分类名称和分类别名都被占用");
        if (results.length == 1 && results[0].name === data.name && results[0].alias === data.alias)
            return res.crs("分类名称和分类别名都别占用");
        if (results.length === 1 && results[0].name === data.name)
            return res.crs("分类名称已经被占用");
        if (results.length === 1 && results[0].alias === data.alias)
            return res.crs("分类别名被占用");

        //如果分类名称和分类别名都不重复，就执行添加操作
        const sql = `insert into ev_article_cate set ?`;
        //执行添加分类的语句
        db.query(sql, data, (err, results) => {
            if (err)
                return res.crs(err);
            //如果没有添加进去
            if (results.affectedRows !== 1) {
                return res.crs("数据添加失败");
            }
            return res.send({
                status: 0,
                message: "分类添加成功"
            })
        })
    })
}