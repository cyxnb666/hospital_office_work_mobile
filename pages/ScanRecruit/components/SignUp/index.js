import {getTopicDetail} from "../../../../utils/api";

Component({
    properties: {
        signUp: {
            type: Object,
            value: {
                topicId: '',
                topicName: '',
                introduction: '',
                serviceTimeStart: '',
                serviceTimeEnd: '',
            },
        },
    },
    data: {
        topicList: [],
        timePeriodList: [],
        showError: false,
        disabled: false
    },
    created() {
        const topicId = wx.getStorageSync('topicId')
        if (topicId) {
            this.setData({
                disabled: true
            })
        }
        this.getTopicDetailList();
    },

    methods: {
        JudgeScanStatus() {
            const topicId = this.data.signUp?.topicId || wx.getStorageSync('topicId')
            const data = {...this.data.signUp}
            data.topicId = topicId
            const item = this.data.topicList.find(item => item.topicId === Number(topicId))
            data.topicName = item.topicName
            data.introduction = item.introduction
            data.serviceTimeStart = item.groups[0].serviceTimeStart
            data.serviceTimeEnd = item.groups[0].serviceTimeEnd
            const list = item.groups.map((item) => {
                return {
                    label: item.serviceTimeStart + '至' + item.serviceTimeEnd,
                    value: item.serviceTimeStart + '至' + item.serviceTimeEnd
                }
            });
            this.setData({
                timePeriodList: list,
            })
            this.triggerEvent('onInput', {
                key: "signUp",
                value: data
            });
        },
        bindTopicChange(e) {
            const selectedTopic = this.data.topicList[Number(e.detail.value)];

            // 设置基本信息
            this.triggerEvent('onInput', {
                key: "signUp.topicId",
                value: selectedTopic.value
            });
            this.triggerEvent('onInput', {
                key: "signUp.topicName",
                value: selectedTopic.label
            });
            this.triggerEvent('onInput', {
                key: "signUp.introduction",
                value: selectedTopic.introduction
            });

            // 处理时间段列表
            const list = selectedTopic.groups.map((item) => {
                return {
                    label: item.serviceTimeStart + '至' + item.serviceTimeEnd,
                    value: item.serviceTimeStart + '至' + item.serviceTimeEnd
                }
            });

            // 设置时间段列表
            this.setData({
                timePeriodList: list
            });

            // 如果有时间段，自动设置第一个时间段
            if (list.length > 0) {
                const firstTimePeriod = selectedTopic.groups[0];
                this.triggerEvent('onInput', {
                    key: "signUp.serviceTimeStart",
                    value: firstTimePeriod.serviceTimeStart
                });
                this.triggerEvent('onInput', {
                    key: "signUp.serviceTimeEnd",
                    value: firstTimePeriod.serviceTimeEnd
                });
            } else {
                // 如果没有时间段，清空时间值
                this.triggerEvent('onInput', {
                    key: "signUp.serviceTimeStart",
                    value: ''
                });
                this.triggerEvent('onInput', {
                    key: "signUp.serviceTimeEnd",
                    value: ''
                });
            }
        },
        bindTimePeriodChange(e) {
            const timePeriod = this.data.timePeriodList[Number(e.detail.value)].value.split('至');
            this.triggerEvent('onInput', {
                key: "signUp.serviceTimeStart",
                value: timePeriod[0]
            });
            this.triggerEvent('onInput', {
                key: "signUp.serviceTimeEnd",
                value: timePeriod[1]
            });
        },
        checkValue() {
            const requiredFields = ['topicId', 'introduction', 'serviceTimeStart', 'serviceTimeEnd'];
            const formValues = this.data.signUp;
            if (!formValues) {
                this.setData({
                    showError: true
                });
                return true
            }
            const isError = requiredFields.some(field => !formValues[field]);
            this.setData({
                showError: isError
            });
            return isError;
        },
        getTopicDetailList() {
            getTopicDetail().then((res) => {
                const topicList = res.map(item => {
                    return {
                        ...item,
                        label: item.topicName,
                        value: item.topicId,
                    }
                })
                this.setData({
                    topicList: topicList
                })
                this.JudgeScanStatus()
            }).catch(() => {
            })
        }
    },

});
