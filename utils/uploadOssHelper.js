const crypto = require("crypto-js");

class MpUploadOssHelper {
    constructor(options) {
        this.accessKeyId = options.accessKeyId;
        this.accessKeySecret = options.accessKeySecret;
        // 限制参数的生效时间，单位为小时，默认值为1。
        this.timeout = options.timeout || 1;
        // 限制上传文件的大小，单位为MB，默认值为10。
        this.maxSize = options.maxSize || 10;
    }

    createUploadParams() {
        const policy = this.getPolicyBase64();
        const signature = this.signature(policy);
        return {
            OSSAccessKeyId: this.accessKeyId,
            policy: policy,
            signature: signature,
        };
    }

    getPolicyBase64() {
        let date = new Date();
        // 设置policy过期时间。
        date.setHours(date.getHours() + this.timeout);
        let srcT = date.toISOString();
        const policyText = {
            expiration: srcT,
            conditions: [
                // 限制上传文件大小。
                ["content-length-range", 0, this.maxSize * 1024 * 1024],
            ],
        };
        // 将字符串进行UTF-8编码
        // let encoder = new TextEncoder();
        // let utf8Encoded = encoder.encode(JSON.stringify(policyText));
        let utf8Encoded = unescape(encodeURIComponent(JSON.stringify(policyText))).split("").map(val => val.charCodeAt());
        let bufferLikeObj = new Uint8Array(utf8Encoded);
        return wx.arrayBufferToBase64(bufferLikeObj.buffer);
    }

    signature(policy) {
        return crypto.enc.Base64.stringify(
            crypto.HmacSHA1(policy, this.accessKeySecret)
        );
    }
}

module.exports = MpUploadOssHelper;
