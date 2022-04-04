import axios from "axios";

export default (destination, baseURL = "https://api.trongrid.io/v1/") => {
  const instance = axios.create({
    baseURL,
    timeout: 30000,
    // headers: { TRON_PRO_API_KEY: "04d7d321-59eb-4882-a0aa-aa01c3339a8c" },
  });

  const call = () => {
    instance
      .get(destination)
      .then((res) => {
        if (res.status === 200) return res.data;
      })
      .catch((e) => {
        return console.error(`[apiCall] Error - ${e}`);
      });
  };

  return call;
};
