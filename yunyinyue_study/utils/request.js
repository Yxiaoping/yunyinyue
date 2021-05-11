// 发送ajax请求  fetch axios
import config from './config'

/* 
    1.封装功能函数
        - 功能点要明确
        - 函数内部应该保留固定代码（静态的）
        - 将动态的数据抽取成形参，由使用者根据自身情况，动态地传入实参
        - 一个良好的功能函数，应该设置形参的默认值
    2.封装功能组件
        - 功能点要明确
        - 组件内部应该保留固定代码（静态的）
        - 将动态的数据抽取成props参数，由使用者根据自身情况，
            以标签属性的形式，动态地传入props数据
        - 一个良好的组件，应该设置组件的必要性即数据类型
*/
export default (url, data={}, method='GET') => {
    return new Promise((resolve, reject) => {
        // 1. new Promise 相当于初始化promise实例的状态为pending
        // 2. 成功后要修改promise的状态
        wx.request({
            url: config.host + url,
            data,
            method,  /* 动态的method，使这个函数能发送多种请求 */
            header: { // 携带cookie，需设置请求头
                // 先判断是否有cookie值，否则会报错
                cookie: wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U')!==-1):''
            },
            success: (res) => {
                // console.log('success'+res);
                // console.log(res);
                // 判断登录请求是否成功
                if(data.isLogin){
                    // 将用户的cookies存储至本地
                    wx.setStorage({
                        key:"cookies",
                        data: res.cookies
                    })
                }
                resolve(res.data) /* resolve可以修改promise的状态为成功状态 */
                /* 请求数据成功后得到res.data中的数据 ，将数据作为整个函数的返回值*/
            },
            fail: (err) => {
                // console.log('err'+err);
                reject(err)/* reject可修改promise的状态为失败的状态 */
            }
        })
    })
}