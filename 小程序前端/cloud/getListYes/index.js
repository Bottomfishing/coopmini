// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: "cloud1-6gzxjy5k59c1f367" }) 

// 云函数入口函数
exports.main = async (event, context) => {
    //history是我要取出的表名字
    return cloud.database().collection('goods').get({
      success(res){
        return res
      },
      fail(err){
        return err
      }
    })
}