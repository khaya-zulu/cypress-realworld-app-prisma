///<reference path="types.ts" />

import express from "express";
import { remove, isEmpty, slice, concat } from "lodash/fp";
import {
  getTransactionsForUserContacts,
  createTransaction,
  updateTransactionById,
  getPublicTransactionsDefaultSort,
  getTransactionByIdForApi,
  getTransactionsForUserForApi,
  getPublicTransactionsByQuery,
} from "./database";
import { TransactionRequestStatus } from "../src/models";
import { ensureAuthenticated, validateMiddleware } from "./helpers";
import {
  sanitizeTransactionStatus,
  sanitizeRequestStatus,
  isTransactionQSValidator,
  isTransactionPayloadValidator,
  shortIdValidation,
  isTransactionPatchValidator,
  isTransactionPublicQSValidator,
} from "./validators";
import { getPaginatedItems } from "../src/utils/transactionUtils";
import { prisma } from "./database";
import { Transaction } from "@prisma/client";

const router = express.Router();

// Routes

//GET /transactions - scoped user, auth-required
router.get(
  "/",
  ensureAuthenticated,
  validateMiddleware([
    sanitizeTransactionStatus,
    sanitizeRequestStatus,
    ...isTransactionQSValidator,
  ]),
  (req, res) => {
    /* istanbul ignore next */
    const transactions = getTransactionsForUserForApi(req.user?.id!, req.query);

    const { totalPages, data: paginatedItems } = getPaginatedItems(
      req.query.page,
      req.query.limit,
      transactions
    );

    res.status(200);
    res.json({
      pageData: {
        page: res.locals.paginate.page,
        limit: res.locals.paginate.limit,
        hasNextPages: res.locals.paginate.hasNextPages(totalPages),
        totalPages,
      },
      results: paginatedItems,
    });
  }
);

//GET /transactions/contacts - scoped user, auth-required
router.get(
  "/contacts",
  ensureAuthenticated,
  validateMiddleware([
    sanitizeTransactionStatus,
    sanitizeRequestStatus,
    ...isTransactionQSValidator,
  ]),
  (req, res) => {
    /* istanbul ignore next */
    const transactions = getTransactionsForUserContacts(req.user?.id!, req.query);

    const { totalPages, data: paginatedItems } = getPaginatedItems(
      req.query.page,
      req.query.limit,
      transactions
    );

    res.status(200);
    res.json({
      pageData: {
        page: res.locals.paginate.page,
        limit: res.locals.paginate.limit,
        hasNextPages: res.locals.paginate.hasNextPages(totalPages),
        totalPages,
      },
      results: paginatedItems,
    });
  }
);

//GET /transactions/public - auth-required
router.get(
  "/public",
  ensureAuthenticated,
  validateMiddleware(isTransactionPublicQSValidator),
  async (req, res) => {
    /* istanbul ignore next */
    const userId = req.user?.id;

    if (!userId) throw new Error("User not found");

    // all public transactions, together with the contact's trnsactions
    const publicTransactionsWithContacts = await prisma.transaction.findMany({
      where: { privacyLevel: "PUBLIC" },
      include: {
        receiver: { select: { firstName: true, lastName: true, avatar: true } },
        sender: { select: { firstName: true, lastName: true, avatar: true } },
        comments: {
          select: {
            id: true,
            uuid: true,
            content: true,
            userId: true,
            transactionId: true,
            createdAt: true,
            modifiedAt: true,
          },
        },
        likes: {
          select: {
            id: true,
            uuid: true,
            userId: true,
            transactionId: true,
            createdAt: true,
            modifiedAt: true,
          },
        },
      },
    });

    /* istanbul ignore next */
    const publicTransactions = publicTransactionsWithContacts.map((t) => ({
      id: t.id,
      uuid: t.uuid,
      source: t.source,
      amount: t.amount,
      description: t.description,
      privacyLevel: t.privacyLevel.toLowerCase(),
      receiverId: t.receiverId,
      receiverName: t.receiver.firstName,
      receiverAvatar: t.receiver.avatar,
      senderId: t.senderId,
      senderName: t.sender.firstName,
      senderAvatar: t.sender.avatar,
      comments: t.comments,
      likes: t.likes,
      balanceAtCompletion: t.balanceAtCompletion,
      status: t.status?.toLowerCase(),
      requestResolvedAt: t.requestResolvedAt,
      createdAt: t.createdAt,
      modifiedAt: t.modifiedAt,
    }));

    const { totalPages, data: paginatedItems } = getPaginatedItems(
      req.query.page,
      req.query.limit,
      publicTransactions
    );

    res.status(200);
    res.json({
      pageData: {
        page: res.locals.paginate.page,
        limit: res.locals.paginate.limit,
        hasNextPages: res.locals.paginate.hasNextPages(totalPages),
        totalPages,
      },
      results: paginatedItems,
    });
  }
);

//POST /transactions - scoped-user
router.post(
  "/",
  ensureAuthenticated,
  validateMiddleware(isTransactionPayloadValidator),
  async (req, res) => {
    const transactionPayload: {
      transactionType: "payment" | "request";
      amount: number;
      description: string;
      senderId: string;
      receiverId: string;
    } = req.body;

    const { transactionType, ...data } = transactionPayload;

    const user = await prisma.user.findUnique({
      where: { id: req.user?.id! },
      select: { balance: true },
    });

    const transaction = await prisma.transaction.create({
      data: {
        ...data,
        requestStatus: transactionType === "request" ? "PENDING" : null,
        balanceAtCompletion: user?.balance,
      },
    });

    // /* istanbul ignore next */
    // const transaction = createTransaction(req.user?.id!, transactionType, transactionPayload);

    res.status(200);
    res.json({ transaction });
  }
);

//GET /transactions/:transactionId - scoped-user
router.get(
  "/:transactionId",
  ensureAuthenticated,
  validateMiddleware([shortIdValidation("transactionId")]),
  async (req, res) => {
    const { transactionId } = req.params;

    // const transaction = getTransactionByIdForApi(transactionId);

    const transaction = await prisma.transaction.findUniqueOrThrow({
      where: { id: transactionId },
      include: { receiver: true, sender: true, comments: true, likes: true },
    });

    const formattedTransaction = {
      ...transaction,
      receiverName: transaction.receiver.firstName,
      senderName: transaction.sender.firstName,
      receiverAvatar: transaction.receiver.avatar,
      senderAvatar: transaction.sender.avatar,
    };

    res.status(200);
    res.json({ transaction: formattedTransaction });
  }
);

//PATCH /transactions/:transactionId - scoped-user
router.patch(
  "/:transactionId",
  ensureAuthenticated,
  validateMiddleware([shortIdValidation("transactionId"), ...isTransactionPatchValidator]),
  (req, res) => {
    const { transactionId } = req.params;

    /* istanbul ignore next */
    updateTransactionById(transactionId, req.body);

    res.sendStatus(204);
  }
);

export default router;
