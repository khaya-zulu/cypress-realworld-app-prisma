///<reference path="types.ts" />

import express from "express";
import { createComments, prisma } from "./database";
import { ensureAuthenticated, validateMiddleware } from "./helpers";
import { shortIdValidation, isCommentValidator } from "./validators";
const router = express.Router();

// Routes

//GET /comments/:transactionId
router.get(
  "/:transactionId",
  ensureAuthenticated,
  validateMiddleware([shortIdValidation("transactionId")]),
  async (req, res) => {
    const { transactionId } = req.params;
    // const comments = getCommentsByTransactionId(transactionId);

    const comments = await prisma.comment.findMany({ where: { transactionId } });

    res.status(200);
    res.json({ comments });
  }
);

//POST /comments/:transactionId
router.post(
  "/:transactionId",
  ensureAuthenticated,
  validateMiddleware([shortIdValidation("transactionId"), isCommentValidator]),
  (req, res) => {
    const { transactionId } = req.params;
    const { content } = req.body;

    /* istanbul ignore next */
    createComments(req.user?.id!, transactionId, content);

    res.sendStatus(200);
  }
);

export default router;
