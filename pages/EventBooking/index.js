Page({
  data: {
    active: 0,
  },
  onPullDownRefresh() {
    const idList = ['#MakeAppointment', '#MyAppointments']
    const id = idList[this.data.active]
    const childComponent = this.selectComponent(id);
    childComponent.initialization()
},
  onShow() {
    const childComponent = this.selectComponent('#MakeAppointment');
    childComponent.initialization()
  },
  onChange(event) {
    this.setData({ active: Number(event.detail.name) });
    const idList = ['#MakeAppointment', '#MyAppointments']
    const id = idList[event.detail.name]
    const childComponent = this.selectComponent(id);
    childComponent.initialization()
  },
})
