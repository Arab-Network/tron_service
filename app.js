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
  console.log("Starting cronjob (30 sec)...");
  cron.schedule("*/29 * * * * *", () => {
    DatabaseConnect();
    checkPoolAndValidate();
  });
});

export default app;
