import {getAccessInfo, getInfoDetail} from "../../utils/api";

Page({
  data: {
      infoDetails: {}
  },
  onLoad(query) {
      const infoId = query.infoId
      this.getInfoDetailFn(infoId);
  },
  getInfoDetailFn(infoId) {
      getInfoDetail(infoId).then(async (res) => {
          const config = await getAccessInfo()
          res.topicQrcode = res.topicQrcode ? `https://${config.bucketName}.${config.endpoint}${config.catalogue}${res.topicQrcode}` : null
          this.setData({
              infoDetails: res
          })
      }).catch(() => {
          wx.navigateBack()
      })
  }
})
