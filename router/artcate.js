//文章分类管理的路由
const express = require("express");
//创建一个路由实例
const router = express.Router();
//导入文章分类管理的处理函数
const artcate_handler = require("../router_handler/artcate");
//导入自动验证数据的第三方模块
const express_joi = require("@escook/express-joi");
//导入验证规则对象
const { add_cate_schema } = require("../schema/artcate");

//1.文章分类管理的路由
router.get("/cates", artcate_handler.getArticleCates);
//2.新增文章分类的路由
router.post("/addcate", express_joi(add_cate_schema), artcate_handler.addArticleCates);

//导出路由
module.exports = router;