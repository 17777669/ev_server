//文章分类的校验规则
const joi = require("@hapi/joi");

//定义新增文字分类中的分类名称和分类别名的校验规则
const name = joi.string().required(); //为字符串并且必填
const alias = joi.string().alphanum().required(); //为字符串，取值为0-9a-zA-Z,必填项
const id = joi.number().integer().min(1).required(); //为数值，整数，最小值为1，必填项

//导出新增文章分类的校验规则
exports.add_cate_schema = {
    body: {
        name,
        alias
    }
};
//导出根据id删除文章分类的校验规则
exports.delete_cate_schema = {
    //表示要检验req.params里面的数据
    params: {
        id
    }
};
//导出根据id获取文章分类信息的校验规程
exports.get_cate_schema = {
    params: {
        id
    }
}