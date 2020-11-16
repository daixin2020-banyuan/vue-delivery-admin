import request from "../common/request";
import { host } from "../common/config";

export async function getMenu({ id, page, limit, keyword }) {
  const result = await request({
    url: `${host}/food?restaurantId=${id}&page=${page}&limit=${limit}&keyword=${keyword}`,
    method: "get"
  });

  return result;
}

export async function editfood(data) {
  const result = await request({
    url: `${host}/food`,
    method: "post",
    data
  });

  return result;
}
