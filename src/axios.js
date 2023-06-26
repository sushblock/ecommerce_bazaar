import axios from "axios";

const instance = axios.create({
  baseURL: "https://asia-east2-sales-script-editor.cloudfunctions.net/", //CLoud function URL
});

export default instance;
