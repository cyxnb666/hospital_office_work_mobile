import {cancelAppoint, getMyAppointRecord} from "../../../../utils/api";
import Dialog from '@vant/weapp/dialog/dialog';
import moment from "moment";

Component({
    properties: {},
    data: {
        search: '',
        myAppointmentsList: []
    },
    methods: {
        initialization() {
            const topicId = wx.getStorageSync('topicId') || 0
            getMyAppointRecord(topicId).then((res) => {
                res.forEach((item) => {
                    item.makeAnAppointmentState = item.serviceStatus === '0' ? '服务中' : '已结束'
                })
                this.setData({
                    myAppointmentsList: res
                })
            }).catch(() => {
            }).finally(()=>{
              wx.stopPullDownRefresh()
           })
        },
        onCancelReservation(e) {
            Dialog.confirm({
                title: '提示',
                message: '是否取消预约?',
                confirmButtonColor: '#357BEC'
            })
                .then(() => {
                    const appointId = e.currentTarget.dataset.appointid
                    cancelAppoint(appointId).then(() => {
                        wx.showToast({
                            title: '取消成功',
                            icon: 'success'
                        })
                        this.initialization()
                    }).catch(() => {
                    })
                }).catch(() => {
                // on cancel
            });
        },
    }
});
