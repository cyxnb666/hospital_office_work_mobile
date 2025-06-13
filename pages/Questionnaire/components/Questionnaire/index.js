Component({
    properties: {
        surveyQuestion: {
            type: Array,
            value: []
        }
    },
    data: {},
    methods: {
        validateSurveyQuestions(surveyQuestions) {
            for (let i = 0; i < surveyQuestions.length; i++) {
                const surveyQuestion = surveyQuestions[i];
                const subQuestions = surveyQuestion.surveyQuestions ? surveyQuestion.surveyQuestions : surveyQuestions;
                if (subQuestions) {
                    for (let j = 0; j < subQuestions.length; j++) {
                        const subQuestion = subQuestions[j];
                        const {questionType, inputValue, options, children, required} = subQuestion;
                        if (required) {
                            if (questionType === 'RADIO' || questionType === 'CHECKBOX') {
                                let hasCheckedOption = false;
                                if (options) {
                                    for (let k = 0; k < options.length; k++) {
                                        if (options[k].checked) {
                                            hasCheckedOption = true;
                                            break;
                                        }
                                    }
                                }

                                if (!hasCheckedOption) {
                                    return false;
                                }
                            } else if (questionType === 'INPUT') {
                                if (!inputValue) {
                                    return false;
                                }
                            }
                            if (children) {
                                const childrenValid = this.validateSurveyQuestions(children);
                                if (!childrenValid) {
                                    return false;
                                }
                            }
                        }
                    }
                }
            }

            return true;
        },
        checkValue() {
            const isValid = this.validateSurveyQuestions(this.data.surveyQuestion);
            if (!isValid){
                wx.showToast({
                    title: '请完成问卷',
                    icon: 'error'
                })
            }
            return !isValid
        },
        onChange(e) {
            const {questiontype, index, valueindex, checkindex, childrenindex} = e.currentTarget.dataset;
            const data = [...this.data.surveyQuestion];

            const updateOptions = (options, checkindex) => {
                options.forEach((item, i) => {
                    item.checked = e.detail ? i === checkindex : false;
                });
            };

            if (questiontype === 'RADIO') {
                const targetOptions = childrenindex >= 0
                    ? data[index].surveyQuestions[valueindex].children[childrenindex].options
                    : data[index].surveyQuestions[valueindex].options;

                updateOptions(targetOptions, checkindex);
            } else {
                if (childrenindex >= 0) {
                    data[index].surveyQuestions[valueindex].children[childrenindex].options[checkindex].checked = e.detail;
                } else {
                    data[index].surveyQuestions[valueindex].options[checkindex].checked = e.detail;
                }
            }
            this.triggerEvent('onInput', {
                key: "surveyQuestion",
                value: data
            });
        },
        onInput(e) {
            const {index, valueindex, childrenindex} = e.currentTarget.dataset;
            const data = [...this.data.surveyQuestion];
            if (childrenindex >= 0) {
                data[index].surveyQuestions[valueindex].children[childrenindex].inputValue = e.detail.value;
            } else {
                data[index].surveyQuestions[valueindex].inputValue = e.detail.value;
            }
            this.triggerEvent('onInput', {
                key: "surveyQuestion",
                value: data
            });
        }
    }
});