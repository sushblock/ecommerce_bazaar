import axios from "axios";

const instance = axios.create({
  baseURL: "https://asia-east2-divine-ecommerce.cloudfunctions.net/", //CLoud function URL
});

export default instance;
