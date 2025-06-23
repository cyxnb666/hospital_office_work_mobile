import {getCustomerByOpenId, fillQuestionnaire} from "../../utils/api";

Page({
    data: {
        surveyQuestion: []
    },
    
    onLoad(query) {
        const topicId = query?.topicId || wx.getStorageSync('topicId');
        this.getCustomerByOpenIdFn(topicId);
    },
    
    onInput(e) {
        this.setData({
            surveyQuestion: e.detail.value
        });
    },
    
    getCustomerByOpenIdFn(topicId) {
        const openId = wx.getStorageSync('openId');
        const data = {openId: openId, topicId: topicId};
        
        getCustomerByOpenId(data).then((res) => {
            if (res.surveyQuestion && res.surveyQuestion.length > 0) {
                this.setData({
                    surveyQuestion: res.surveyQuestion
                });
            } else {
                this.setData({
                    surveyQuestion: []
                });
            }
        }).catch(() => {
            this.setData({
                surveyQuestion: []
            });
            wx.showToast({
                title: '获取问卷失败',
                icon: 'error',
                duration: 2000
            });
        });
    },
    
    onSubmit() {
        const childComponent = this.selectComponent('#Questionnaire');
        if (childComponent && childComponent.checkValue()) {
            return;
        }
        const topicId = wx.getStorageSync('topicId');
        const submitData = {
            openId: wx.getStorageSync('openId'),
            customerId: wx.getStorageSync('customerId'),
            topicId: topicId,
            surveyQuestion: this.data.surveyQuestion,
            surveyStatus: "1"
        };
        
        wx.showLoading({
            title: '提交中...',
            mask: true
        });
        
        fillQuestionnaire(submitData).then(() => {
            wx.hideLoading();
            wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 2000,
                success: () => {
                    setTimeout(() => {
                        wx.navigateBack();
                    }, 1500);
                }
            });
        }).catch(() => {
            wx.hideLoading();
            wx.showToast({
                title: '提交失败，请重试',
                icon: 'error',
                duration: 2000
            });
        });
    }
});