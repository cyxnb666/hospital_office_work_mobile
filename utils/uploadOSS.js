import {getAccessInfo} from "./api";

let config = null
export const uploadOSS = (filePath) => {
    return new Promise(async (resolve, reject) => {
        if (!config) {
            config = await getAccessInfo()
        }

        const {endpoint, catalogue, accessKeyId, accessKeySecret, bucketName} = config;
        const MpUploadOssHelper = require("./uploadOssHelper.js");
        const mpHelper = new MpUploadOssHelper({
            accessKeyId: accessKeyId,
            accessKeySecret: accessKeySecret,
            // 限制参数的生效时间，单位为小时，默认值为1。
            timeout: 1,
            // 限制上传文件大小，单位为MB，默认值为10。
            maxSize: 200,
        });
        const params = mpHelper.createUploadParams();
        console.log(params)
        const fileName = filePath.split('/').pop()
        console.log(fileName)
        const url = `https://${bucketName}.${endpoint}`
        wx.uploadFile({
            url: url,
            filePath: filePath,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            name: 'file',
            formData: {
                name: fileName,
                key: catalogue + fileName,
                policy: params.policy,
                OSSAccessKeyId: accessKeyId,
                success_action_status: '200',
                signature: params.signature,
            },
            success() {
                const data = {
                    url: url + catalogue + fileName,
                    id: fileName
                }
                resolve(data)
            },
            fail(err) {
                reject(err);
            },
        })
    })
}
