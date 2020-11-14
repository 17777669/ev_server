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
//
exports.addArticleCates = (req, res) => {
    res.send("ok");
}