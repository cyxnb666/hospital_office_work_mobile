// 获取 小程序帐号信息
const {miniProgram} = wx.getAccountInfoSync();

// 获取小程序当前开发环境
// develop 开发版, trial 体验版, release 正式版
const {envVersion} = miniProgram;

let env = {
    baseURL: "",
};

switch (envVersion) {
    case "develop":
        // env.baseURL = "https://uat.zhixunchelian.com/hospital_office_work";
        env.baseURL = "http://192.168.8.52:1010/hospital_office_work";
        break;

    case "trial":
        env.baseURL = "https://uat.zhixunchelian.com/hospital_office_work";
        break;

    case "release":
        env.baseURL = "";
        break;

    default:
        console.log("当前环境异常");
        env.baseURL = "";
}

export {env};


