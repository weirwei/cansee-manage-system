import global_msg from "@/global";
import request from "@/utils/request";
import qs from "qs";

const server = global_msg.host + "/cansee/user"

const getUserInfoReq = query => {
    return request({
        url: server + '/info',
        method: 'get',
        data: query,
        headers: {
            'authorization': localStorage.getItem('authorization')
        },
    });
}

const getLogNumReq = query => {
    return request({
        url: server + '/logNum',
        method: 'get',
        data: query,
        headers: {
            'authorization': localStorage.getItem('authorization')
        },
    });
}

const getLogChatReq = query => {
    return request({
        url: server + '/logChat',
        method: 'get',
        data: query,
        headers: {
            'authorization': localStorage.getItem('authorization')
        },
    });
}


const register = param => {
    return request({
        url: server + "/register",
        method: 'post',
        data: qs.stringify(param),
        headers: {
            'authorization': localStorage.getItem('authorization')
        },
    })
}

export {
    getUserInfoReq,
    getLogNumReq,
    getLogChatReq,
    register,
}
