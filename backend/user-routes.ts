///<reference path="types.ts" />

import express from "express";
import bcrypt from "bcryptjs";
import { isEqual, pick } from "lodash/fp";

import {
  getAllUsers,
  createUser,
  updateUserById,
  getUserById,
  getUserByUsername,
  searchUsers,
  removeUserFromResults,
  prisma,
} from "./database";
import { User } from "../src/models/user";
import { ensureAuthenticated, validateMiddleware } from "./helpers";
import {
  shortIdValidation,
  searchValidation,
  userFieldsValidator,
  isUserValidator,
} from "./validators";
const router = express.Router();

// Routes
router.get("/", ensureAuthenticated, (req, res) => {
  /* istanbul ignore next */
  const users = removeUserFromResults(req.user?.id!, getAllUsers());
  res.status(200).json({ results: users });
});

router.get("/search", ensureAuthenticated, validateMiddleware([searchValidation]), (req, res) => {
  const { q } = req.query;

  /* istanbul ignore next */
  const users = removeUserFromResults(req.user?.id!, searchUsers(q));

  res.status(200).json({ results: users });
});

router.post("/", userFieldsValidator, validateMiddleware(isUserValidator), async (req, res) => {
  const userDetails: User = req.body;

  const user = await prisma.user.create({
    data: {
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      username: userDetails.username,
      password: bcrypt.hashSync(userDetails.password!, 10),
    },
  });

  res.status(201);
  res.json({ user });
});

router.get(
  "/:userId",
  ensureAuthenticated,
  validateMiddleware([shortIdValidation("userId")]),
  async (req, res) => {
    const { userId } = req.params;

    // Permission: account owner
    /* istanbul ignore next */
    if (!isEqual(userId, req.user?.id)) {
      return res.status(401).send({
        error: "Unauthorized",
      });
    }

    // const user = getUserById(userId);

    const user = await prisma.user.findUnique({ where: { id: userId } });

    res.status(200);
    res.json({ user });
  }
);

router.get("/profile/:username", async (req, res) => {
  const { username } = req.params;

  // const user = pick(["firstName", "lastName", "avatar"], getUserByUsername(username));

  const user = await prisma.user.findUnique({
    where: { username },
    select: { firstName: true, lastName: true, avatar: true },
  });

  res.status(200);
  res.json({ user });
});

router.patch(
  "/:userId",
  ensureAuthenticated,
  userFieldsValidator,
  validateMiddleware([shortIdValidation("userId"), ...isUserValidator]),
  (req, res) => {
    const { userId } = req.params;

    const edits: User = req.body;

    updateUserById(userId, edits);

    res.sendStatus(204);
  }
);

export default router;
