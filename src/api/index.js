import axios from "axios";

const baseURL = process.env.REACT_APP_GS_URL;

const axi = axios.create({ baseURL });

const api = {
  media(path) {
    return axi.get(path, { responseType: "blob" });
  },
};

export default api;
