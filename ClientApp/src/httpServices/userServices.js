import Config from "../Config/config.json";
import http from "./services";

const endPoint = Config.usersEndPoint;
const token = localStorage.getItem("token");
const auth = { Authorization: `bearer ${token}` };

async function getAll() {
  const { data } = await http.get(endPoint, { headers: auth });

  return data;
}

async function getById(id) {
  const { data } = await http.get(endPoint + "/" + id, { headers: auth });

  return data;
}

async function post(owner) {
  const { data } = await http.post(endPoint, owner, { headers: auth });

  return data;
}

async function put(id, owner) {
  const { data } = await http.put(endPoint + "/" + id, owner, {
    headers: auth,
  });

  return data;
}

async function remove(id) {
  const { data } = await http.delete(endPoint + "/" + id, { headers: auth });

  return data;
}

export default {
  getAll,
  getById,
  post,
  put,
  delete: remove,
};
