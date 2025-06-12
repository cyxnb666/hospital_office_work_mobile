import {getAccessInfo, getInfoList, getTopicStatus} from "../../utils/api";

Page({
    data: {
        infoList: [],
    },
    onLoad: function (options) {
        const topicId = wx.getStorageSync('topicId')
        if (topicId) {
            getTopicStatus(topicId).then((res) => {
                wx.navigateTo({
                    url: `/pages/ScanRecruit/index?topicId=${topicId}`
                })
            }).catch(() => {
                wx.setStorageSync('topicId', '')
            })
        }
    },
    onShow: function (options) {
        this.getInfoListFn();
    },
    getInfoListFn() {
        const params = {
            condition: {},
            pageIndex: 1,
            pageSize: 3,
        }
        getInfoList(params).then(async (res) => {
            const config = await getAccessInfo()
            res.items.forEach((item) => {
                item.coverImg = `https://${config.bucketName}.${config.endpoint}${config.catalogue}${item.coverImg}`
            })
            this.setData({
                infoList: res.items
            })
        }).catch(() => {
        })
    },
    scanRecruit() {
        wx.navigateTo({
            url: '/pages/ScanRecruit/index'
        })
    },
    activityReservation() {
        wx.switchTab({
            url: '/pages/EventBooking/index'
        })
    },
    goToMoreInformation() {
        wx.switchTab({
            url: '/pages/InfoNews/index'
        })
    },
    goToInfoDetail(e) {
        const infoId = e.currentTarget.dataset.id
        wx.navigateTo({
            url: `/pages/InfoDetails/index?infoId=${infoId}`
        })
    },
});
