import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { DatabaseConnect } from "./db/index.js";
import cron from "node-cron";
import { checkPoolAndValidate } from "./services/tron/tronServices.js";

import tronRoutes from "./routes/tron.js";

const app = express();
const { NODE_LOCAL_PORT: port } = process.env;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/tron", tronRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  DatabaseConnect();
  console.log("Starting cronjob (15 sec)...");
  cron.schedule("*/15 * * * * *", () => {
    console.log(new Date());
    checkPoolAndValidate();
  });
});

export default app;
