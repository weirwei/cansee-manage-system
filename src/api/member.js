import global_msg from "@/global";
import request from "@/utils/request";

const server = global_msg.host + "/cansee/organization"

const getOrgMemberReq = query => {
    return request({
        url: server + '/' + query.orgId + '/member',
        method: 'get',
        params: query,
        headers: {
            'authorization': localStorage.getItem('authorization')
        },
    });
}

const addMemberReq = param => {
    return request({
        url: server + '/' + param.orgId + '/member/' + param.addUid,
        method: 'post',
        headers: {
            'authorization': localStorage.getItem('authorization')
        },
    })
}

const appointMemberReq = param => {
    return request({
        url: server + '/' + param.orgId + '/member/' + param.appointUid + "?appointment=" + param.appointment,
        method: 'put',
        headers: {
            'authorization': localStorage.getItem('authorization')
        },
    })
}

const delMemberReq = param => {
    return request({
        url: server + '/' + param.orgId + '/member/' + param.delUid,
        method: 'delete',
        headers: {
            'authorization': localStorage.getItem('authorization')
        },
    })
}

export {
    getOrgMemberReq,
    addMemberReq,
    appointMemberReq,
    delMemberReq,
}
