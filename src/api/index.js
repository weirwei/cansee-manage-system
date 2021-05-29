import global_msg from "@/global";
import request from "@/utils/request";

const server = global_msg.host + "/cansee"

const getUserInfoReq = query => {
    return request({
        url: server + '/user/info',
        method: 'get',
        data: query,
        headers: {
            'authorization': localStorage.getItem('authorization')
        },
    });
}

const getLogNumReq = query => {
    return request({
        url: server + '/user/logNum',
        method: 'get',
        data: query,
        headers: {
            'authorization': localStorage.getItem('authorization')
        },
    });
}

const getLogChatReq = query => {
    return request({
        url: server + '/user/logChat',
        method: 'get',
        data: query,
        headers: {
            'authorization': localStorage.getItem('authorization')
        },
    });
}

export {
    getUserInfoReq,
    getLogNumReq,
    getLogChatReq,
}
