import Config from "../Config/config.json";
import Http from "../httpServices/services";

const endPoint = Config.suppliersEndPoint;
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

async function post(supplier) {
  const { data } = await Http.post(endPoint, supplier, { headers: auth });

  return data;
}

async function put(id, supplier) {
  const { data } = await Http.put(endPoint + "/" + id, supplier, {
    headers: auth,
  });

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
