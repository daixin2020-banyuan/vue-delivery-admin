import request from "../common/request";
import { host } from "../common/config";

export async function loginPost(data) {
  console.log(data);
  const result = await request({
    url: `${host}/admin/login`,
    method: "post",
    data
  });

  return result;
}
