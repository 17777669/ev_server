//文章分类管理的路由
const express = require("express");
//创建一个路由实例
const router = express.Router();
//导入文章分类管理的处理函数
const artcate_handler = require("../router_handler/artcate");


//1.文章分类管理的路由
router.get("/cates", artcate_handler.getArticleCates);
//2.新增文章分类的路由

//导出路由
module.exports = router;