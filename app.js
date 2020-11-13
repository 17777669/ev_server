//项目 的入口文件
//导入express模块
const express = require("express");
//导入用户相关的路由
const userRouter = require("./router/user");
//创建app的服务器实例
const app = express();






//----------------------------------中间件-----------------------


//1.解决跨域中间件
const cors = require("cors");
app.use(cors());

//2.解析表单数据的中间件,注意该处只能解析xxx格式的数据
app.use(express.urlencoded({ extended: false }))

//3.自定义一个输出错误的中间件，
//每次执行的时候返回错误的信息都会使用res.send()
//中间件必须有三个参数：req,res,next
app.use(function(req, res, next) {
    //给res添加一个函数，中间件的参数都是共享的，后面 的路由也可以使用这里res添加的函数crs，直接使status的状态为1
    res.crs = function(err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }

    //使用next
    next();
})

//4.解析token的中间件
const config = require("./config");
//该中间件的作用是验证指明http请求的JsonWebTokens的有效性，如果有效就将token的值设置到req.user里面，然后路由到相应的router
const expressJWT = require("express-jwt");
//使用unless指明哪些中间件是不需要进行token的身份认证，
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }));
//-----------------------------------中间件end----------------------






//-----------------------------------路由start---------------------------

//1.用户注册登录的路由
app.use("/api", userRouter);



//----------------------------------路由end----------------------------



//-----------------------------------错误中间件start----------------------
//1. 在此处注册一个全局的错误中间件，用来捕获验证失败的错误，并将验证失败的结果响应给客户端
const joi = require("@hapi/joi");
app.use(function(err, req, res, next) {
    //输入数据验证失败的话
    if (err instanceof joi.ValidationError)
        return res.crs(err);
    //捕获并处理Token认证失败后的错误
    if (err.name === "UnauthorizedError")
        return res.crs("身份认证失败！")
});
//-----------------------------------错误中间件end------------------------




//启动服务
app.listen(8080, function() {
    console.log("express server running at http://127.0.0.1:8080");
})