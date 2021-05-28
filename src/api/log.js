import global_msg from "@/global";
import request from "@/utils/request";

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
        url: server + '/' + param.orgId + '/proj/' + param.delProjId,
        method: 'delete',
        headers: {
            'authorization': localStorage.getItem('authorization')
        },
    })
}

export {
    getLogReq,
    delLogReq,
}
