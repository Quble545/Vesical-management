import Config from "../Config/config.json";
import Http from "../httpServices/services";

const endPoint = Config.citiesEndPoint;
const token = localStorage.getItem("token");
const auth = { Authorization: `bearer ${token}` };

async function getAll() {
  const { data } = await Http.get(endPoint, { headers: auth });

  return data;
}

async function getById(id) {
  const { data } = await Http.get(endPoint + "/" + id, { headers: auth });

  return data;
}

async function post(city) {
  const { data } = await Http.post(endPoint, city, { headers: auth });

  return data;
}

async function put(id, city) {
  const { data } = await Http.put(endPoint + "/" + id, city, { headers: auth });

  return data;
}

async function remove(id) {
  await Http.delete(endPoint + "/" + id, { headers: auth });
}

export default {
  getAll,
  getById,
  post,
  put,
  delete: remove,
};
