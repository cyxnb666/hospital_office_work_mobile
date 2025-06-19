import moment from "moment";
import { appoint, getAppointInfo, getSchedulingList, terminateService } from "../../../../utils/api";
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
        selectIndex: 0,
        // 滑动相关数据
        startX: 0,
        startY: 0,
        moveX: 0,
        moveY: 0,
        // 退出课题弹窗相关数据
        showQuitReasonPopup: false,
        quitReason: '',
        currentQuitTopicCustomerId: null
    },
    methods: {
        initialization() {
            const topicId = wx.getStorageSync('topicId') || 0;
            getAppointInfo(topicId).then((res) => {
                // 为每个item添加showDelete状态（只有状态为6的才需要）
                res.forEach(item => {
                    item.showDelete = false;
                });
                this.setData({
                    makeAppointmentList: res
                })
            }).catch(() => {
                this.setData({
                    makeAppointmentList: []
                })
            }).finally(() => {
                wx.stopPullDownRefresh()
            })
        },

        // 滑动相关方法
        onTouchStart(e) {
            this.setData({
                startX: e.touches[0].clientX,
                startY: e.touches[0].clientY
            });
        },

        onTouchMove(e) {
            this.setData({
                moveX: e.touches[0].clientX,
                moveY: e.touches[0].clientY
            });
        },

        onTouchEnd(e) {
            const { startX, startY, moveX, moveY } = this.data;
            const deltaX = moveX - startX;
            const deltaY = moveY - startY;
            const index = e.currentTarget.dataset.index;
            const item = this.data.makeAppointmentList[index];

            // 只有状态为6的item才处理滑动
            if (item.reviewStatus !== '6') {
                return;
            }

            // 判断是否为有效的水平滑动（水平距离大于垂直距离且超过阈值）
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                const makeAppointmentList = [...this.data.makeAppointmentList];

                if (deltaX < -50) {
                    // 向左滑动，显示删除按钮
                    // 先隐藏其他项的删除按钮
                    makeAppointmentList.forEach((item, i) => {
                        item.showDelete = i === index;
                    });
                } else if (deltaX > 50) {
                    // 向右滑动，隐藏删除按钮
                    makeAppointmentList[index].showDelete = false;
                }

                this.setData({
                    makeAppointmentList
                });
            }

            // 重置滑动数据
            this.setData({
                startX: 0,
                startY: 0,
                moveX: 0,
                moveY: 0
            });
        },

        // 隐藏所有删除按钮（只对状态为6的item操作）
        hideAllDeleteButtons() {
            const makeAppointmentList = this.data.makeAppointmentList.map(item => ({
                ...item,
                showDelete: item.reviewStatus === '6' ? false : item.showDelete
            }));
            this.setData({
                makeAppointmentList
            });
        },

        onQuitGroup(e) {
            const id = e.currentTarget.dataset.id;
            this.setData({
                currentQuitTopicCustomerId: id,
                showQuitReasonPopup: true,
                quitReason: ''
            });
        },

        // 退出原因输入
        onQuitReasonInput(e) {
            this.setData({
                quitReason: e.detail
            });
        },

        // 关闭退出原因弹窗
        onCloseQuitReasonPopup() {
            this.setData({
                showQuitReasonPopup: false,
                quitReason: '',
                currentQuitTopicCustomerId: null
            });
        },

        // 取消退出
        onCancelQuitReason() {
            this.onCloseQuitReasonPopup();
        },

        // 确认退出课题
        onConfirmQuitReason() {
            const { currentQuitTopicCustomerId, quitReason } = this.data;

            Dialog.confirm({
                title: '提示',
                message: '确认要退出该课题吗？',
                confirmButtonColor: '#357BEC'
            }).then(() => {
                const params = {
                    topicCustomerId: currentQuitTopicCustomerId,
                    rejectedReason: quitReason || ''
                };

                terminateService(params).then(() => {
                    wx.showToast({
                        title: '退出课题成功',
                        icon: 'success'
                    });
                    this.onCloseQuitReasonPopup();
                    this.initialization();
                }).catch(() => {
                    // 请求失败处理
                });
            }).catch(() => {
                // 用户取消确认
            });
        },

        // 拨打电话
        onCallPhone(e) {
            const phone = e.currentTarget.dataset.phone;
            if (!phone || phone === '-') {
                wx.showToast({
                    title: '暂无联系电话',
                    icon: 'none',
                    duration: 2000
                });
                return;
            }

            wx.makePhoneCall({
                phoneNumber: phone,
                success: () => {
                    console.log('拨打电话成功');
                },
                fail: (err) => {
                    console.error('拨打电话失败:', err);
                }
            });
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


        onCancel() {
            this.setData({
                show: false,
                reservationTime: { appointDay: null, timePeriod: null }
            })
        },

        onMakeAppointment(e) {
            // 先隐藏删除按钮
            this.hideAllDeleteButtons();

            const index = e.currentTarget.dataset.index;

            // 直接生成日期列表，不调用接口
            const startDate = moment().add(1, 'day'); // 从明天开始
            const endDate = startDate.clone().add(2, 'month').endOf('month');
            const dates = [];
            let currentDate = startDate.clone();

            while (currentDate.isSameOrBefore(endDate)) {
                dates.push(currentDate.format('YYYY-MM-DD'));
                currentDate.add(1, 'day');
            }

            // 生成日期列表，所有日期都可选
            const dateList = dates.map(item => {
                return {
                    date: item,
                    dateMD: moment(item).format('M/D'),
                    week: this.setWeek(item),
                    timePeriods: ['AM', 'PM'], // 所有日期都有上午下午时段
                    scheduling: true // 所有日期都可预约
                }
            });

            // 所有时间段都可选
            const timeSlotList = this.data.timeSlotList.map(item => {
                return {
                    ...item,
                    scheduling: true // 所有时间段都可选
                }
            });

            this.setData({
                selectIndex: index,
                show: true,
                dateList: dateList,
                timeSlotList: timeSlotList,
                reservationTime: {
                    appointDay: dates[0], // 默认选择第一个可用日期（明天）
                    timePeriod: 'AM'      // 默认选择上午时段
                }
            });
        },

        // 修改 setDate 方法，移除排班检查
        setDate(e) {
            const selectedDate = e.currentTarget.dataset.date;

            this.setData({
                reservationTime: {
                    appointDay: selectedDate,
                    timePeriod: 'AM' // 重新选择日期时，默认选择上午
                }
            });
        },

        // 修改 setTimeSlot 方法，移除排班检查
        setTimeSlot(e) {
            const selectedTimePeriod = e.currentTarget.dataset.key;

            this.setData({
                'reservationTime.timePeriod': selectedTimePeriod
            });
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
                    reservationTime: { appointDay: null, timePeriod: null }
                })
                this.initialization();
            }).catch(() => {
            })
        }

    }
});