import {uploadOSS} from "../../utils/uploadOSS";

Page({
    data: {},
    onLoad: function (options) {

    },
    saveToImageEvent(e) {
        uploadOSS(e.detail).then((res) => {
            wx.setStorageSync('sign', JSON.stringify(res))
            wx.navigateBack()
        }).catch((err) => {
            console.log(err)
        })
    },
});
