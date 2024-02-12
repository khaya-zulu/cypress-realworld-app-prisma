///<reference path="types.ts" />

import express from "express";

import { getBankTransfersByUserId, prisma } from "./database";
import { ensureAuthenticated } from "./helpers";
const router = express.Router();

// Routes

//GET /bankTransfers (scoped-user)
router.get("/", ensureAuthenticated, async (req, res) => {
  // /* istanbul ignore next */
  // const transfers = getBankTransfersByUserId(req.user?.id!);

  const transfers = await prisma.bankTransfer.findMany({ where: { userId: req.user?.id! } });

  res.status(200);
  res.json({ transfers });
});

export default router;
