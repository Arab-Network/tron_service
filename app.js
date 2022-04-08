import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { DatabaseConnect } from "./db/index.js";
import cron from "node-cron";

import tronRoutes from "./routes/tron.js";

const app = express();
const { NODE_LOCAL_PORT: port } = process.env;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/tron", tronRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  DatabaseConnect();
  // cron.schedule("* * * * * *", () => {
  //   console.log("running a task every sec");
  // });
});

export default app;
