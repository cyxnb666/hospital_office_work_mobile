Component({
    properties: {
        customer: {
            type: Object,
            value: {
                customerName: '',
                age: '',
                gender: '',
                phone: '',
                editStatus: '',
            }
        },
    },
    data: {
        showError: false,
    },
    methods: {
        onGenderRadioChange(e) {
            if (this.data.customer.editStatus === '1'){
                return
            }
            this.triggerEvent('onInput', {
                key: "customer.gender",
                value: e.detail
            });
        },
        
        onInput(e) {
            if (this.data.customer.editStatus === '1' && e.currentTarget.dataset.key === 'phone') {
                return;
            }

            const key = `customer.${e.currentTarget.dataset.key}`
            this.triggerEvent('onInput', {
                key,
                value: e.detail
            });
        },

        checkValue() {
            const requiredFields = ['customerName', 'age', 'gender', 'phone'];
            const formValues = this.data.customer || {};
            const isError = requiredFields.some(field => {
                return !formValues[field];
            });
        
            this.setData({
                showError: isError
            });
            return isError;
        }
    }
});