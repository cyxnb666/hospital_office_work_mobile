import moment from "moment";
import { uploadOSS } from "../../../../utils/uploadOSS";

Component({
    properties: {
        customer: {
            type: Object,
            value: {
                customerName: '',
                birthday: '',
                age: '',
                gender: '',
                medicalRecordNo: '',
                region: '',
                address: '',
                phone: '',
                editStatus: '',
                reportImages: [],
            },
            observer(newVal) {
              // 确保 reportImages 始终存在不然要报错
              if (newVal && !newVal.reportImages) {
                  this.triggerEvent('onInput', {
                      key: "customer.reportImages",
                      value: []
                  });
              }
          }
        },
    },
    data: {
        showPopup: false,
        showError: false,
    },
    methods: {
        onClose() {
            this.setData({showPopup: false});
        },
        onGenderChange() {
            if (this.data.customer.editStatus === '1'){
                return
            }
            const _this = this
            const columns = ['男', '女']
            wx.showActionSheet({
                itemList: columns,
                itemColor: "#357BEC",
                success: function (res) {
                    if (!res.cancel) {
                        _this.triggerEvent('onInput', {
                            key: "customer.gender",
                            value: columns[res.tapIndex]
                        });
                    }
                }
            })
        },
        bindDateChange: function (e) {
            this.triggerEvent('onInput', {
                key: "customer.birthday",
                value: e.detail.value
            });
            const age = moment().diff(e.detail.value, 'years');
            this.triggerEvent('onInput', {
                key: "customer.age",
                value: age
            });
        },
        bindLocationChange: function (e) {
            this.triggerEvent('onInput', {
                key: "customer.region",
                value: e.detail.value.join('')
            });
        },
        onInput(e) {
            const key = `customer.${e.currentTarget.dataset.key}`
            this.triggerEvent('onInput', {
                key,
                value: e.detail
            });
        },
        uploadReport() {
          // 添加空值检查
          const reportImages = this.properties.customer?.reportImages || [];

          if (reportImages.length >= 5) {
              wx.showToast({
                  title: '最多上传5张图片',
                  icon: 'none'
              });
              return;
          }

          wx.chooseMedia({
              count: 5 - reportImages.length,
              mediaType: ['image'],
              sourceType: ['album', 'camera'],
              success: (res) => {
                  const uploadTasks = res.tempFiles.map(file => {
                      return new Promise((resolve, reject) => {
                          wx.showLoading({
                              title: '上传中...',
                          });
                          uploadOSS(file.tempFilePath)
                              .then(res => resolve(res))
                              .catch(err => reject(err));
                      });
                  });

                  Promise.all(uploadTasks)
                      .then(results => {
                          wx.hideLoading();
                          const newImages = [...reportImages];
                          results.forEach(res => {
                              newImages.push(res.url);
                          });

                          this.triggerEvent('onInput', {
                              key: "customer.reportImages",
                              value: newImages
                          });
                      })
                      .catch(err => {
                          wx.hideLoading();
                          console.error(err);
                          wx.showToast({
                              title: '上传失败',
                              icon: 'error'
                          });
                      });
              }
          });
      },

      deleteImage(e) {
          const reportImages = this.properties.customer?.reportImages || [];
          const index = e.currentTarget.dataset.index;
          const newImages = [...reportImages];
          newImages.splice(index, 1);

          this.triggerEvent('onInput', {
              key: "customer.reportImages",
              value: newImages
          });
      },

      previewImage(e) {
          const reportImages = this.properties.customer?.reportImages || [];
          const current = e.currentTarget.dataset.url;
          wx.previewImage({
              current,
              urls: reportImages
          });
      },

      checkValue() {
        const requiredFields = ['customerName', 'birthday', 'age', 'gender', 'medicalRecordNo', 'region', 'address', 'phone', 'reportImages'];
        const formValues = this.data.customer || {};
        const isError = requiredFields.some(field => {
            if (field === 'reportImages') {
                return !formValues[field] || formValues[field].length === 0;
            }
            return !formValues[field];
        });
    
        this.setData({
            showError: isError
        });
        return isError;
    }
    }
});
