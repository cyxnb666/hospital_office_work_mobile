import moment from "moment";

Page({
    data: {
        dateList: [],
        timeList: [
            {
                time:'上午 10:00-10:30',
                remaining: '20'
            },
            {
                time:'上午 10:30-11:00',
                remaining: '20'
            },
            {
                time:'上午 11:00-11:30',
                remaining: '20'
            },
            {
                time:'上午 11:30-12:00',
                remaining: '20'
            },
            {
                time:'下午 14:30-15:00',
                remaining: '20'
            },
            {
                time:'下午 15:00-15:30',
                remaining: '20'
            },
            {
                time:'下午 15:30-16:00',
                remaining: '20'
            },
            {
                time:'下午 16:00-16:30',
                remaining: '20'
            }
        ],
        active:''
    },
    onLoad: function (options) {
        const monday = moment().startOf('week').add(1, 'days');
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const currentDate = monday.clone().add(i, 'days');
            const isDisabled = currentDate.isBefore(moment(), 'day');
            dates.push({
                date: monday.clone().add(i, 'days').format('YYYY-MM-DD'),
                week: this.weekTransformation(monday.clone().add(i, 'days').format('dddd')),
                // 今天之前禁用
                disabled: isDisabled
            });
        }
        this.setData({
            dateList: dates,
            active: moment(new Date()).format('YYYY-MM-DD')
        })
    },
    weekTransformation(week) {
        const weekData = {
            Monday: '星期一',
            Tuesday: '星期二',
            Wednesday: '星期三',
            Thursday: '星期四',
            Friday: '星期五',
            Saturday: '星期六',
            Sunday: '星期日'
        }
        return weekData[week];
    },
    onChange(){
        this.setData({
            timeList: [],
        })
        wx.showLoading({
            title: '加载中...',
            mask: true
        })
        setTimeout(() => {
            this.setData({
                timeList: [
                    {
                        time:'上午 10:00-10:30',
                        remaining: '20'
                    },
                    {
                        time:'上午 10:30-11:00',
                        remaining: '20'
                    },
                    {
                        time:'上午 11:00-11:30',
                        remaining: '20'
                    },
                    {
                        time:'上午 11:30-12:00',
                        remaining: '20'
                    },
                    {
                        time:'下午 14:30-15:00',
                        remaining: '20'
                    },
                    {
                        time:'下午 15:00-15:30',
                        remaining: '20'
                    },
                    {
                        time:'下午 15:30-16:00',
                        remaining: '20'
                    },
                    {
                        time:'下午 16:00-16:30',
                        remaining: '20'
                    }
                ]
            })
            wx.hideLoading()
        }, 1000)
    },
    onMakeAppointment(){
        wx.showLoading({
            title: '预约中...',
            mask: true
        })
        setTimeout(() => {
            wx.hideLoading()
            wx.showToast({
                title: '预约成功',
                icon: 'success',
                duration: 1000,
                success: function () {
                    wx.switchTab({
                        url: '/pages/EventBooking/index'
                    })
                }
            })
        }, 1000)
    }
});
