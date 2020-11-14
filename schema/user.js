//用户输入的信息的验证
//导入模块
const joi = require("@hapi/joi"); //该模块的作用是为表单中携带的每个数据项定义验证规则
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
//用户id的检测
const id = joi.number().integer().min(1).required();
//用户昵称的验证,字符串，必填
const nickname = joi.string().required();
//用户邮箱的验证a
const email = joi.string().email().required();
//用户头像的验证规程对象
//dataUri()：指的是如下的字符串
//data:image/png;base64
const avatar = joi.string().dataUri().required();

//注册和登录表单的验证规则对象a
exports.reg_login_schema = {
    //表示对req.body中 的数据进行验证
    body: {
        // 验证req.body里面 的username,password数据进行验证
        username,
        password
    }
};
//更新用户信息的验证对象
exports.updata_userinfo_schema = {
    body: {
        id,
        nickname,
        email
    }
};
//修改用户密码的验证对象
exports.updata_password_schema = {
    body: {
        //使用password这个规则，验证req.body.oldPwd的值
        oldPwd: password,
        // joi.ref("oldPwd")表示newPwd的值必须和oldPwd的值保持一致
        //joi.not(joi.ref("oldPwd"))表示newPwd的值不能和oldPwd的值一致
        //concat(password)表示将password的规则合并起来
        newPwd: joi.not(joi.ref("oldPwd")).concat(password)
    }
};
//导出头像验证规则对象
exports.update_avatar_schema = {
    body: {
        avatar,
    }
}