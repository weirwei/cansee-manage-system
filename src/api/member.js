import global_msg from "@/global";
import request from "@/utils/request";

const server = global_msg.host + "/cansee/organization"

const getOrgMemberReq = query => {
    return request({
        url: server + '/' + query.orgId + '/member',
        method: 'get',
    });
}

export {
    getOrgMemberReq,
}
