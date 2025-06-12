import {mobileLogin} from "../../utils/api";

Page({
    data: {
        topicId: null
    },
    onLogin() {
        const _this = this
        wx.login({
            success: function (data) {
                if (data.code) {
                    mobileLogin({loginCode: data.code, topicId: _this.data.topicId}).then((res) => {
                        wx.setStorageSync('token', res.token)
                        wx.setStorageSync('openId', res.openId)
                        wx.setStorageSync('customerId', res.customerId)
                        wx.setStorageSync('userInfo', JSON.stringify(res))
                        wx.switchTab({
                            url: '/pages/Home/index'
                        })
                        wx.setStorageSync('isJump', '')
                    }).catch(() => {
                    })
                }
            }
        })
    },
    onLoad(e) {
        const scene = decodeURIComponent(e.scene)
        if (scene !== 'undefined') {
            const topicId = scene.split('=')[1]
            console.log('topicId', topicId)
            wx.setStorageSync('topicId', topicId)
            this.setData({
                topicId: topicId
            })
            return
        }
        wx.setStorageSync('topicId', '')
    }
})
