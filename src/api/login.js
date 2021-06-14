import request from "@/utils/request";
import global_msg from "@/global";
import qs from "qs";

export const login = param => {
    return request({
        url: global_msg.host + "/login/login",
        method: 'post',
        data: qs.stringify(param)
    })
}

