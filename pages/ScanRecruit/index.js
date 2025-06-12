import {addCustomer, addTempCustomer, clientSurveyQuestion, getAccessInfo, getCustomerByOpenId} from "../../utils/api";

Page({
    data: {
        active: 0,
        steps: [
            {
                text: '完善信息',
            },
            {
                text: '调查问卷',
            },
            {
                text: '报名',
            }
        ],
        submitForm: {
            customer: {
                customerName: '',
                birthday: '',
                age: '',
                gender: '',
                medicalRecordNo: '',
                region: '',
                address: '',
                phone: '',
                editStatus: '',
                openId: wx.getStorageSync('openId'),
                customerId: wx.getStorageSync('customerId'),
                reportImages: [],
            },
            signUp: {
                topicId: '',
                topicName: '',
                introduction: '',
                serviceTimeStart: '',
                serviceTimeEnd: '',
            },
            agreement: {
                signImage: '',
                signFileOssId: ''
            },
            surveyQuestion: []
        },
        showNext: false,
    },
    onInput(e) {
        const key = `submitForm.${e.detail.key}`
        this.setData({
            [key]: e.detail.value
        })
    },
    onTemporarySave() {
        this.submitFormFn(false);
    },
    onPreviousStep() {
        if (this.data.active > 0) {
            this.setData({
                active: this.data.active - 1
            })
        }
    },
    onNextStep() {
        const idList = ['#ImproveInfo', '#Questionnaire', '#SignUp', '#ConsentForm']
        const id = idList[this.data.active]
        const childComponent = this.selectComponent(id);
        if (childComponent && childComponent.checkValue()) {
            return
        }
        if (this.data.active < 3) {
            this.setData({
                active: this.data.active + 1
            })
            return
        }
        // 提交表单
        this.submitFormFn(true);
    },
    submitFormFn(type) {
        const URL = type ? addCustomer : addTempCustomer
        URL(this.data.submitForm).then(() => {
            wx.showToast({
                title: type ? '提交成功' : '暂存成功',
                icon: 'success',
                duration: 2000,
            })
            setTimeout(() => {
                wx.navigateBack()
            }, 500)
        }).catch(() => {
        })
    },
    getCustomerByOpenIdFn(topicId) {
        const openId = wx.getStorageSync('openId')
        const data = {openId: openId, topicId: topicId}
        getCustomerByOpenId(data).then(async (res) => {
            const config = await getAccessInfo()
            if (res.agreement) {
                res.agreement.signImage = `https://${config.bucketName}.${config.endpoint}${config.catalogue}${res.agreement.signFileOssId}`
            }
            if (!res.surveyQuestion) {
                this.clientSurveyQuestionFn()
            }
            this.setData({
                submitForm: {
                    ...this.data.submitForm,
                    customer: {
                        ...res.customer,
                        reportImages: res.reportImages || []
                    },
                    agreement: res.agreement,
                    signUp: res.signUp,
                    surveyQuestion: res.surveyQuestion
                }
            })
        }).catch(() => {
        })
    },
    clientSurveyQuestionFn() {
        clientSurveyQuestion().then(res => {
            this.setData({
                'submitForm.surveyQuestion': res
            })
        })
    },
    onShow() {
        const sign = wx.getStorageSync('sign')
        if (sign) {
            const data = JSON.parse(sign)
            this.setData({
                'submitForm.agreement.signImage': data.url,
                'submitForm.agreement.signFileOssId': data.id,
            })
            wx.removeStorageSync('sign')
        }
    },
    onLoad(query) {
        const topicId = wx.getStorageSync('topicId')
        if (topicId) {
            this.setData({
                showNext: true
            })
        }
        this.getCustomerByOpenIdFn(query?.topicId);
    }
})
