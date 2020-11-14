//导入数据库
const { required } = require("@hapi/joi");
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


//3.根据id删除文章分类
exports.deleteCateById = (req, res) => {
    //创建sql语句,执行删除，其实是将is_delete标志的值更新为1,表示已经删除了
    const sql = `update ev_article_cate set is_delete=1 where id=?`;
    //执行删除语句
    db.query(sql, req.params.id, (err, results) => {
        if (err) {
            return res.crs(err)
        };
        if (results.affectedRows !== 1) {
            return res.crs("删除分类失败")
        };
        res.send({
            status: 0,
            message: "分类删除成功"
        })
    })

}

//4.根据id获取文章分类信息
exports.getArtCateById = (req, res) => {
    //创建sql语句
    const sql = `select * from ev_article_cate where id=?`;
    //执行sql语句
    db.query(sql, req.params.id, (err, results) => {
        if (err)
            return res.crs(err);
        if (results.length !== 1)
            return res.crs("查询失败");
        res.send({
            status: 0,
            message: "数据查询成功",
            data: results[0]
        })
    })
}


//5.根据id来更新文章分类信息
//思路:查询要修改后的数据（name,alias)是否和数据库中id不同的分类一样，如果一样就返回一个提示信息，如果没有就再执行查询语句将指定id的分类信息更改
exports.updateCateById = (req, res) => {
    const data = req.body;
    const sqlStr = `select * from ev_article_cate where id<>? and (name=? or alias=?)`;
    db.query(sqlStr, [data.Id, data.name, data.alias], (err, results) => {
        if (err)
            return res.crs(err);
        //判断输入的内容是否和数据库中的一致
        if (results.length === 2)
            return res.crs("分类名称和分类别名已经被占用");
        if (results.length === 1 && results[0].name === data.name && results[0].alias === data.alias)
            return res.crs("分类名称和分类别名已经被占用");
        if (results.length === 1 && results[0].name === data.name)
            return res.crs("分类名称已经被占用");
        if (results.length === 1 && results[0].alias === data.alias)
            return res.crs("分类别名已经被占用");
        //如果名称没有被占用，就执行更新操作
        const sql = `update ev_article_cate set ? where id=?`;
        db.query(sql, [data, data.Id], (err, results) => {

            if (err)
                return res.crs(err);
            if (results.affectedRows !== 1)
                return res.crs("数据更新失败");
            res.send({
                status: 0,
                message: "数据更新成功"
            })
        })
    })
}