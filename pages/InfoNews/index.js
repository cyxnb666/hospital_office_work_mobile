import { getAccessInfo, getInfoList } from "../../utils/api";

Page({
  data: {
    infoList: [],
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    queryForm: {
      condition: {},
      pageIndex: 1,
      pageSize: 10,
    },
    totalPage: 0
  },
  onPullDownRefresh() {
    this.setData({
      'queryForm.pageIndex': 1,
      infoList: []
    });
    this.getInfoListFn();
  },
  nextPage() {
    if (this.data.queryForm.pageIndex < this.data.totalPage) {
      this.data.queryForm.pageIndex++;
      this.setData({
        'queryForm.pageIndex': this.data.queryForm.pageIndex++,
      })
      this.getInfoListFn();
    }
  },
  onShow: function (options) {
    this.setData({
      'queryForm.pageIndex': 1,
      infoList: []
    })
    this.getInfoListFn();
  },
  getInfoListFn() {
    getInfoList(this.data.queryForm).then(async (res) => {
      const config = await getAccessInfo()
      res.items.forEach((item) => {
        item.coverImg = `https://${config.bucketName}.${config.endpoint}${config.catalogue}${item.coverImg}`
      })

      // 如果是第一页，直接替换数据
      // 如果不是第一页，则拼接数据
      const newList = this.data.queryForm.pageIndex === 1
        ? res.items
        : this.data.infoList.concat(res.items);

      this.setData({
        infoList: newList,
        totalPage: res.totalPage
      })
    }).finally(() => {
      wx.stopPullDownRefresh()
    })
  },
  goToInfoDetail(e) {
    const infoId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/InfoDetails/index?infoId=${infoId}`
    })
  },
})
