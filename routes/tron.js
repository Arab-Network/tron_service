import express from "express";

import { nativeCoin, trc20 } from "../services/tron.js";

const router = express.Router();

router.get("/validate/:walletAddress", nativeCoin);
router.get("/validate20/:walletAddress", trc20);

export default router;
