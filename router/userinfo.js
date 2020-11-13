//获取用户的基本信息路由模块
//1.导入express第三方模块
const express = require("express");
//2.创建一个路由对象
const router = express.Router();
//3.导入获取用户信息的路由处理模块
const userinfo_handler = require("../router_handler/userinfo");



//4.获取用户的基本信息
router.get("/userinfo", userinfo_handler.getUserInfo);




//5.向外导出路由对象
module.exports = router;