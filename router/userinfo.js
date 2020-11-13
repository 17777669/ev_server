//获取用户的基本信息路由模块
//1.导入express第三方模块
const express = require("express");
//2.创建一个路由对象
const router = express.Router();
//3.导入获取用户信息的路由处理模块
const userinfo_handler = require("../router_handler/userinfo");
//6.导入自动验证数据合法性的中间件
const expressJoi = require("@escook/express-joi");
//7.导入需要验证规则对象，来自@hapi/joi
const { updata_userinfo_schema } = require("../schema/user");


//4.获取用户的基本信息
router.get("/userinfo", userinfo_handler.getUserInfo);

//8.更新用户的基本信息，使用第三方模块来验证输入数据的合法性,如果数据验证成功，就调用路由处理函数
router.post("/userinfo", expressJoi(updata_userinfo_schema), userinfo_handler.updataUserInfo);


//5.向外导出路由对象
module.exports = router;