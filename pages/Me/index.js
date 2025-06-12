import {uploadOSS} from "../../utils/uploadOSS";
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
import Dialog from '@vant/weapp/dialog/dialog';
import {mobileLogout, updateHeadAndName} from "../../utils/api";

Page({
    data: {
        userInfo: {
            avatar: defaultAvatarUrl,
            customerName: '',
            phone: '',
        },
        canIUseGetUserProfile: wx.canIUse('getUserProfile'),
        canIUseNicknameComp: wx.canIUse('input.type.nickname'),
        hasUserInfo: false,
    },
    onChooseAvatar(e) {
        const {avatarUrl} = e.detail
        const {customerName} = this.data.userInfo
        uploadOSS(avatarUrl).then((res) => {
            const params = {
                customerName,
                avatar: res.url,
                customerId: this.data.userInfo.customerId
            }
            updateHeadAndName(params).then(()=>{
                wx.showToast({
                    title: '修改成功',
                    icon: 'success',
                    duration: 2000
                })
                this.setData({
                    "userInfo.avatar": res.url,
                    hasUserInfo: customerName && res.url && res.url !== defaultAvatarUrl,
                })
                wx.setStorageSync('userInfo', JSON.stringify(this.data.userInfo))
            }).catch(()=>{})
        }).catch((err) => {
            console.log(err)
        })
    },
    onInputChange(e) {
        const customerName = e.detail.value
        const {avatar} = this.data.userInfo
        this.setData({
            "userInfo.customerName": customerName,
            hasUserInfo: customerName && avatar && avatar !== defaultAvatarUrl,
        })
        wx.setStorageSync('userInfo', JSON.stringify(this.data.userInfo))
    },
    onLogout() {
        Dialog.confirm({
            title: '提示',
            message: '是否退出登录?',
            confirmButtonColor: '#357BEC'
        })
            .then(() => {
                mobileLogout().then(() => {
                    wx.showToast({
                        title: '成功',
                        icon: 'success',
                        duration: 2000,
                        success: function () {
                            wx.reLaunch({
                                url: '/pages/Login/index',
                            })
                        }
                    })
                }).catch(() => {})
            }).catch(() => {
            // on cancel
        });
    },
    onMyAppointments() {
        wx.switchTab({
            url: '/pages/EventBooking/index'
        })
    },
    onLoad() {
        const userInfo = wx.getStorageSync('userInfo')
        if (userInfo) {
            this.setData({
                userInfo: JSON.parse(userInfo),
                hasUserInfo: JSON.parse(userInfo).customerName && JSON.parse(userInfo).avatar,
            })
            if (!this.data.userInfo.avatar){
                this.setData({
                    "userInfo.avatar": defaultAvatarUrl
                })
            }
        }
    }
})
