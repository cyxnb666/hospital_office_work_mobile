import instance from '../utils/request'

/**
 * @description 获取上传阿里云数据
 * @returns Promise
 */
export const getAccessInfo = () => instance.get('/getAccessInfo')
/**
 * @description 小程序退出接口
 * @returns Promise
 */
export const mobileLogout = () => instance.get('/user/mobileLogout')
/**
 * @description 小程序登录接口
 * @param {Object} date
 * @returns Promise
 */
export const mobileLogin = (date) => instance.post('/user/mobileLogin', date)
/**
 * @description 扫码招募暂存接口
 * @param {Object} date
 * @returns Promise
 */
export const addTempCustomer = (date) => instance.post('/customer/addTempCustomer', date)

/**
 * @description 扫码招募提交接口
 * @param {Object} date
 * @returns Promise
 */
export const addCustomer = (date) => instance.post('/customer/addCustomer', date)
/**
 * @description 信息资讯列表
 * @param {Object} date
 * @returns Promise
 */
export const getInfoList = (date) => instance.post('/info/getInfoList', date)
/**
 * @description 预约
 * @param {Object} date
 * @returns Promise
 */
export const appoint = (date) => instance.post('/appoint/appoint', date)
/**
 * @description 修改头像和姓名
 * @param {Object} date
 * @returns Promise
 */
export const updateHeadAndName = (date) => instance.post('/customer/updateHeadAndName', date)
/**
 * @description 查询该客户的预约信息
 * @returns Promise
 */
export const getAppointInfo = (topicId) => instance.get(`/appoint/getAppointInfo/${topicId}`)
/**
 * @description -获取所有课题详情
 * @returns Promise
 */
export const getTopicDetail = () => instance.get('/topic/getTopicDetail')
/**
 * @description -查询排班信息
 @param {Object} date
 * @returns Promise
 */
export const getSchedulingList = (date) => instance.post('/appoint/getSchedulingList', date)
/**
 * @description -我的预约记录
 * @returns Promise
 */
export const getMyAppointRecord = (topicId) => instance.get(`/appoint/getAppointInfo/${topicId}`)
/**
 * @description -查询调查问卷
 * @returns Promise
 */
export const clientSurveyQuestion = () => instance.get('/survey/clientSurveyQuestion')
/**
 * @description -查询课题状态
 * @returns Promise
 */
export const getTopicStatus = (topicId) => instance.get(`/topic/getTopicStatus/${topicId}`)
/**
 * @description -根据openId查询客户信息
 * @param {String} data
 * @returns Promise
 */
export const getCustomerByOpenId = (data) => instance.post(`/customer/getCustomerByOpenId`, data)
/**
 * @description -取消预约
 * @param {String} appointId
 * @returns Promise
 */
export const cancelAppoint = (appointId) => instance.post(`/appoint/cancelAppoint/${appointId}`)
/**
 * @description -终止服务-退出课题
 * @param {String} topicCustomerId
 * @returns Promise
 */
export const terminateService = (topicCustomerId) => instance.post(`/customer/terminateService/${topicCustomerId}`)
/**
 * @description -资讯详情
 * @param {String} infoId
 * @returns Promise
 */
export const getInfoDetail = (infoId) => instance.post(`/info/getInfoDetail/${infoId}`)
/**
 * @description -提交调查问卷
 * @param {Object} date
 * @returns Promise
 */
export const fillQuestionnaire = (date) => instance.post('/customer/fillQuestionnaire', date)