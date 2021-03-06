//用户输入的信息的验证
//导入模块
const joi = require("@hapi/joi"); //该模块的作用是为表单中携带的每个数据项定义验证规则
const { string, required } = require("@hapi/joi");
// string(): 必须是字符串
// alphanum():值只能使包含a-zA-Z0-9的字符串
// min(len): 最小的长度
// max(len):最大的长度
// required(): 必填
// pattern(正则表达式)


//用户名的检测：必须为字符串，取值为a-Z0-9,最小为一个值，最长为10,必填
const username = joi.string().alphanum().min(1).max(10).required();
//密码的验证规则:必须为字符串，非空格的6到12位，必填
const password = joi.string().pattern(/^[\S]{6,12}$/).required();

//注册和登录表单的验证规则对象
exports.reg_login_schema = {
    //表示对req.body中 的数据进行验证
    body: {
        username,
        password
    }
}