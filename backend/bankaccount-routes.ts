///<reference path="types.ts" />

import express from "express";

import { prisma } from "./database";
import { ensureAuthenticated, validateMiddleware } from "./helpers";
import { shortIdValidation, isBankAccountValidator } from "./validators";
const router = express.Router();

// Routes

//GET /bankAccounts (scoped-user)
router.get("/", ensureAuthenticated, async (req, res) => {
  const userId = req.user?.id;

  /* istanbul ignore next */
  const accounts = await prisma.bankAccount.findMany({ where: { userId } });

  res.status(200);
  res.json({ results: accounts });
});

//GET /bankAccounts/:bankAccountId (scoped-user)
router.get(
  "/:bankAccountId",
  ensureAuthenticated,
  validateMiddleware([shortIdValidation("bankAccountId")]),
  async (req, res) => {
    const { bankAccountId } = req.params;

    const account = await prisma.bankAccount.findUnique({ where: { id: bankAccountId } });

    res.status(200);
    res.json({ account });
  }
);

//POST /bankAccounts (scoped-user)
router.post(
  "/",
  ensureAuthenticated,
  validateMiddleware(isBankAccountValidator),
  async (req, res) => {
    /* istanbul ignore next */
    const accountDetails = req.body;

    const account = await prisma.bankAccount.create({
      data: {
        bankName: accountDetails.bankName!,
        accountNumber: accountDetails.accountNumber!,
        routingNumber: accountDetails.routingNumber!,
        userId: req.user?.id!,
      },
    });

    res.status(200);
    res.json({ account });
  }
);

//DELETE (soft) /bankAccounts (scoped-user)
router.delete(
  "/:bankAccountId",
  ensureAuthenticated,
  validateMiddleware([shortIdValidation("bankAccountId")]),
  async (req, res) => {
    const { bankAccountId } = req.params;

    const account = await prisma.bankAccount.delete({ where: { id: bankAccountId } });

    res.status(200);
    res.json({ account });
  }
);

export default router;
