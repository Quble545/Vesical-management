import Config from "../Config/config.json";
import Http from "../httpServices/services";

const endPoint = Config.tokenEndPoint;

async function post(city) {
  const { data } = await Http.post(endPoint, city);

  return data;
}

export default {
  authorize: post,
};
