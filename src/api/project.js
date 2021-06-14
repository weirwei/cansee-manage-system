import global_msg from "@/global";
import request from "@/utils/request";
import qs from "qs";

const server = global_msg.host + "/cansee/organization"

const getOrgProjReq = query => {
    return request({
        url: server + '/' + query.orgId + '/proj',
        method: 'get',
        params: query,
        headers: {
            'authorization': localStorage.getItem('authorization')
        },
    });
}

const addProjReq = param => {
    return request({
        url: server + '/' + param.orgId + '/proj',
        method: 'post',
        data: qs.stringify(param),
        headers: {
            'authorization': localStorage.getItem('authorization')
        },
    })
}

const delProjReq = param => {
    return request({
        url: server + '/' + param.orgId + '/proj/' + param.delProjId,
        method: 'delete',
        headers: {
            'authorization': localStorage.getItem('authorization')
        },
    })
}
const getProjConfReq = param => {
    return request({
        url: server + '/' + param.orgId + '/proj/' + param.projId + "/conf",
        method: 'get',
        headers: {
            'authorization': localStorage.getItem('authorization')
        },
    })
}

export {
    getOrgProjReq,
    addProjReq,
    delProjReq,
    getProjConfReq,
}
