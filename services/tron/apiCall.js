import axios from "axios";

export default (destination, baseURL = "https://api.trongrid.io/v1/") => {
  const instance = axios.create({
    baseURL,
    timeout: 30000,
    headers: { TRON_PRO_API_KEY: "04d7d321-59eb-4882-a0aa-aa01c3339a8c" },
  });

  return new Promise((resolve, reject) => {
    instance
      .get(destination)
      .then((res) => {
        if (res.status === 200) return resolve(res);
        return reject(`error code: ${res.status}`);
      })
      .catch((e) => {
        return reject(`[apiCall] Error - ${e}`);
      });
  });
};
