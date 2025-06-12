import moment from "moment";
import {appoint, getAppointInfo, getSchedulingList, terminateService} from "../../../../utils/api";
import Dialog from '@vant/weapp/dialog/dialog';

moment.locale('zh-cn', {
    weekdays: '周日_周一_周二_周三_周四_周五_周六'.split('_')
})
Component({
    properties: {},
    data: {
        makeAppointmentList: [],
        quitGroupLoading: false,
        show: false,
        dateList: [],
        timeSlotList: [
            {
                title: '上午',
                key: 'AM',
                value: '09:00-12:00',
                scheduling: true
            },
            {
                title: '下午',
                key: 'PM',
                value: '14:00-17:30',
                scheduling: true
            }
        ],
        reservationTime: {
            appointDay: null,
            timePeriod: null
        },
        selectIndex: 0
    },
    methods: {
        initialization() {
            getAppointInfo().then((res) => {
                this.setData({
                    makeAppointmentList: res
                })
            }).catch(() => {
              this.setData({
                makeAppointmentList: []
              })
            }).finally(()=>{
               wx.stopPullDownRefresh()
            })
        },
        onQuitGroup(e) {
            Dialog.confirm({
                title: '提示',
                message: '是否退出该课题?',
                confirmButtonColor: '#357BEC'
            })
                .then(() => {
                    const id = e.currentTarget.dataset.id
                    terminateService(id).then(() => {
                        wx.showToast({
                            title: '退出课题成功',
                            icon: 'success'
                        })
                        this.initialization()
                    }).catch(() => {
                    })
                }).catch(() => {
                // on cancel
            });
        },
        onMakeAppointment(e) {
            const index= e.currentTarget.dataset.index
            const item = this.data.makeAppointmentList[index]
            const params = {
                serviceTimeStart: item.serviceTimeStart,
                serviceTimeEnd: item.serviceTimeEnd
            }
            getSchedulingList(params).then((res) => {
                const dateArr = res.map(item => item.schedulingDay);
                const startDate = moment();
                const endDate = startDate.clone().add(2, 'month').endOf('month');
                const dates = [];
                let currentDate = startDate.clone();
                while (currentDate.isSameOrBefore(endDate)) {
                    dates.push(currentDate.format('YYYY-MM-DD'));
                    currentDate.add(1, 'day');
                }
                const dateList = dates.map(item => {
                    return {
                        date: item,
                        dateMD: moment(item).format('M/D'),
                        week: this.setWeek(item),
                        timePeriods: res.find(data => data.schedulingDay === item)?.timePeriods,
                        scheduling: dateArr.includes(item)
                    }
                })
                const timeSlotList = this.data.timeSlotList.map(item => {
                    return {
                        ...item,
                        scheduling: res[0].timePeriods.includes(item.key)
                    }
                })
                this.setData({
                    selectIndex: e.currentTarget.dataset.index,
                    show: true,
                    dateList: dateList,
                    timeSlotList: timeSlotList,
                    reservationTime: {appointDay: res[0].schedulingDay, timePeriod: res[0].timePeriods[0]}
                })
            }).catch(() => {
            })
        },
        onScanRecruit(e) {
            const index = e.currentTarget.dataset.index
            const type = e.currentTarget.dataset.type
            console.log(type)
            if (type) {
                const item = this.data.makeAppointmentList[index]
                wx.navigateTo({
                    url: `/pages/ScanRecruit/index?topicId=${item.topicId}`
                })
            } else {
                wx.navigateTo({
                    url: '/pages/ScanRecruit/index'
                })
            }
        },
        setWeek(date) {
            const isToday = moment(date).isSame(moment(), 'day');
            if (isToday) return '今日'
            return moment(date).format('dddd')
        },
        setDate(e) {
            const item = this.data.dateList.find(item => item.date === e.currentTarget.dataset.date)
            if (!item.scheduling) {
                wx.showToast({
                    title: '该日期暂无排班信息',
                    icon: 'none'
                })
                return
            }
            const timeSlotList = this.data.timeSlotList.map((data) => {
                return {
                    ...data,
                    scheduling: item.timePeriods.includes(data.key)
                }
            })
            this.setData({
                reservationTime: {
                    appointDay: e.currentTarget.dataset.date,
                    timePeriod: item.timePeriods[0]
                },
                timeSlotList: timeSlotList
            })
        },
        setTimeSlot(e) {
            if (!e.currentTarget.dataset.scheduling) {
                wx.showToast({
                    title: '该时间段暂无排班信息',
                    icon: 'none'
                })
                return
            }
            this.setData({'reservationTime.timePeriod': e.currentTarget.dataset.key})
        },
        onCancel() {
            this.setData({
                show: false,
                reservationTime: {appointDay: null, timePeriod: null}
            })
        },
        onaAppointment() {
            const index = this.data.selectIndex
            const params = {
                ...this.data.reservationTime,
                serviceCount: this.data.makeAppointmentList[index].serviceCount,
                topicGroupId: this.data.makeAppointmentList[index].topicGroupId,
                topicId: this.data.makeAppointmentList[index].topicId,
            }
            appoint(params).then(() => {
                wx.showToast({
                    title: '预约成功',
                    icon: 'success'
                })
                this.setData({
                    show: false,
                    reservationTime: {appointDay: null, timePeriod: null}
                })
                this.initialization();
            }).catch(() => {
            })
        },
    }
});
