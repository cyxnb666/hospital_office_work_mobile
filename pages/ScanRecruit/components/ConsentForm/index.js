Component({
    properties: {
        signImage: {
            type: String,
            value: ''
        }
    },
    data: {},
    methods: {
        onSign() {
            wx.navigateTo({
                url: '/pages/CustomerSignature/index'
            })
        },
        checkValue() {
            if (!this.data.signImage) {
                wx.showToast({
                    title: '请签名',
                    icon: 'error',
                    duration: 2000
                })
                return true
            }
            return false
        },
    }
});
