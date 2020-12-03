import Config from "../Config/config.json";
import Http from "../httpServices/services";

const endPoint = Config.invoicesEndPoint;
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

export default {
  getAll,
  getById,
};
