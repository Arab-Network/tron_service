import axios from "axios";

export default (destination, baseURL = "https://api.trongrid.io/v1/") => {
  const instance = axios.create({
    baseURL,
    timeout: 30000,
    headers: { TRON_PRO_API_KEY: "04d7d321-59eb-4882-a0aa-aa01c3339a8c" },
  });

  return new Promise((resolve, reject) => {
    console.log(destination);
    instance
      .get(destination)
      // .get("accounts/TUcLdbxzQ38j7JA8AUjGTmYGKdokBM5aDR/transactions")
      .then((res) => {
        if (res.status === 200) return resolve(res);
        console.log(res.status);
        return reject("error code");
      })
      .catch((e) => {
        console.error(`[apiCall] Error - ${e}`);
        return reject(`[apiCall] Error - ${e}`);
      });
  });
};
