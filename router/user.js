//router文件夹中只存放请求和处理之间的映射关系
//router_handler存放路由处理函数
//配置用户相关的路由




//1.导入express第三方模块
const express = require("express");
//2.创建一个路由对象
const router = express.Router();

//3.导入对应的路由处理函数
const userHandler = require("../router_handler/user");


//4.导入验证表单数据的中间件，实现对表单数据的自动验证
const expressJoi = require("@escook/express-joi");

//5.导入需要的自定义的验证规则对象
const { reg_login_schema } = require("../schema/user");

//6.注册用户相关的路由
// router.post("/reguser", userHandler.regUser);
//在注册用户的时候，申明一个局部中间件，对当前请求中携带的数据进行验证
//数据验证成功后会对将请求转给后面的路由处理函数，
//如果数据验证失败后，会终止后面代码的运行，将错误传给全局错误处理中间件
router.post("/reguser", expressJoi(reg_login_schema), userHandler.regUser);

//7.用户登录的路由
// router.post("/login", userHandler.login);
router.post("/login", expressJoi(reg_login_schema), userHandler.login);


//8.导出路由
module.exports = router;