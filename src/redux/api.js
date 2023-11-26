import axios from "axios";

const api = axios.create({
  baseURL: "http://218.232.175.4:49156"
})

export default api;