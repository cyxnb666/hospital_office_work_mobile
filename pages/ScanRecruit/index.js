import {addCustomer, addTempCustomer, clientSurveyQuestion, getAccessInfo, getCustomerByOpenId} from "../../utils/api";

Page({
    data: {
        active: 0,
        steps: [
            {
                text: '完善信息',
            }
        ],
        submitForm: {
            customer: {
                customerName: '',
                age: '',
                gender: '',
                phone: '',
                editStatus: '',
                openId: wx.getStorageSync('openId'),
                customerId: wx.getStorageSync('customerId'),
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
        if (this.data.active === 0) {
            const childComponent = this.selectComponent('#ImproveInfo');
            if (childComponent && childComponent.checkValue()) {
                return
            }
            // 直接跳到知情同意书
            this.setData({
                active: 1
            })
            return
        }
        
        // 知情同意书页面 - 提交表单
        if (this.data.active === 1) {
            const childComponent = this.selectComponent('#ConsentForm');
            if (childComponent && childComponent.checkValue()) {
                return
            }
            this.submitFormFn(true);
        }
    },
    submitFormFn(type) {
        const URL = type ? addCustomer : addTempCustomer
        let params = this.data.submitForm;
        
        if (type) {
            const topicId = wx.getStorageSync('topicId') || this.data.submitForm.signUp?.topicId || 0;
            params = {
                age: parseInt(this.data.submitForm.customer.age) || 0,
                agreement: {
                    customerAgreementId: 0,
                    signFileOssId: this.data.submitForm.agreement.signFileOssId || ""
                },
                customerId: parseInt(this.data.submitForm.customer.customerId) || 0,
                customerName: this.data.submitForm.customer.customerName || "",
                editStatus: this.data.submitForm.customer.editStatus || "",
                gender: this.data.submitForm.customer.gender || "",
                openId: this.data.submitForm.customer.openId || "",
                phone: this.data.submitForm.customer.phone || "",
                topicId: parseInt(topicId) || 0
            };
        }
        
        URL(params).then(() => {
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
            const reviewStatus = res.reviewStatus || this.data.submitForm.customer.reviewStatus;
            this.setData({
                showNext: reviewStatus === '1' || reviewStatus == null || !topicId,
                submitForm: {
                    ...this.data.submitForm,
                    customer: {
                        customerName: res.customerName || this.data.submitForm.customer.customerName,
                        age: res.age || this.data.submitForm.customer.age,
                        gender: res.gender || this.data.submitForm.customer.gender,
                        phone: res.phone || this.data.submitForm.customer.phone,
                        editStatus: res.editStatus || this.data.submitForm.customer.editStatus,
                        reviewStatus: res.reviewStatus || this.data.submitForm.customer.reviewStatus,
                        openId: this.data.submitForm.customer.openId,
                        customerId: res.customerId || this.data.submitForm.customer.customerId,
                    },
                    agreement: res.agreement || this.data.submitForm.agreement,
                    signUp: {
                        ...this.data.submitForm.signUp,
                        ...(res.signUp || {}),
                        topicId: topicId || res.signUp?.topicId || this.data.submitForm.signUp.topicId
                    },
                    surveyQuestion: res.surveyQuestion || this.data.submitForm.surveyQuestion
                }
            })
        }).catch(() => {
            if (topicId) {
                this.setData({
                    'submitForm.signUp.topicId': topicId
                })
            }
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
        const topicId = query?.topicId || wx.getStorageSync('topicId')
        if (topicId) {
            this.setData({
                'submitForm.signUp.topicId': topicId
            })
            wx.setStorageSync('topicId', topicId)
        }
        this.getCustomerByOpenIdFn(topicId);
    },
    goToHome() {
        wx.switchTab({
            url: '/pages/Home/index'
        })
    }
})