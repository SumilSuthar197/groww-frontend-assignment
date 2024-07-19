import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const api = axios.create({
  baseURL: `https://api.coingecko.com/api/v3`,
  params: { x_cg_demo_api_key: API_KEY },
});

export default api;
