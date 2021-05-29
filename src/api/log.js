import global_msg from "@/global";
import request from "@/utils/request";
import qs from "qs";

const server = global_msg.host + "/cansee/organization"

const getLogReq = query => {
    return request({
        url: server + '/' + query.orgId + '/proj/' + query.projId + '/log/' + query.type,
        method: 'get',
        params: query,
        headers: {
            'authorization': localStorage.getItem('authorization')
        },
    });
}

const delLogReq = param => {
    return request({
        url: server + '/' + param.orgId + '/proj/' + param.projId + '/log/' + param.logId,
        method: 'delete',
        headers: {
            'authorization': localStorage.getItem('authorization')
        },
    })
}

const solveLogReq = param => {
    return request({
        url: server + '/' + param.orgId + '/proj/' + param.projId + '/log/' + param.logId,
        method: 'put',
        headers: {
            'authorization': localStorage.getItem('authorization')
        },
        data: qs.stringify(param)
    })
}

export {
    getLogReq,
    delLogReq,
    solveLogReq,
}
