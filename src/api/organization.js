import request from '@/utils/request';
import global_msg from "@/global";
import qs from "qs";
const server = global_msg.host + "/cansee/organization"

const getOrgReq = query => {
    return request({
        url: server + "/org",
        method: 'get',
        params: query
    });
}

const createOrgReq = param => {
    return request({
        url: server + '/org',
        method: 'post',
        data: qs.stringify(param)
    })
}

const delOrgReq = param => {
    return request({
        url: server + '/org',
        method: 'delete',
        data: qs.stringify(param)
    })
}

export {
    getOrgReq,
    createOrgReq,
    delOrgReq,
}


