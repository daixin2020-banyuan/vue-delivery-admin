import request from "../common/request";
import { host } from "../common/config";

export async function editRest(data) {
  const result = await request({
    url: `${host}/restaurant`,
    method: "post",
    data
  });

  return result;
}
