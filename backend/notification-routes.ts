///<reference path="types.ts" />

import express from "express";
import {
  createNotifications,
  updateNotificationById,
  getUnreadNotificationsByUserId,
  prisma,
} from "./database";
import { ensureAuthenticated, validateMiddleware } from "./helpers";
import {
  isNotificationsBodyValidator,
  shortIdValidation,
  isNotificationPatchValidator,
} from "./validators";
const router = express.Router();

// Routes

//GET /notifications/
router.get("/", ensureAuthenticated, async (req, res) => {
  /* istanbul ignore next */
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user?.id, isRead: false },
  });

  res.status(200);
  res.json({ results: notifications });
});

//POST /notifications/bulk
router.post(
  "/bulk",
  ensureAuthenticated,
  validateMiddleware([...isNotificationsBodyValidator]),
  (req, res) => {
    const { items } = req.body;
    /* istanbul ignore next */
    const notifications = createNotifications(req.user?.id!, items);

    res.status(200);
    // @ts-ignore
    res.json({ results: notifications });
  }
);

//PATCH /notifications/:notificationId - scoped-user
router.patch(
  "/:notificationId",
  ensureAuthenticated,
  validateMiddleware([shortIdValidation("notificationId"), ...isNotificationPatchValidator]),
  (req, res) => {
    const { notificationId } = req.params;
    /* istanbul ignore next */
    updateNotificationById(req.user?.id!, notificationId, req.body);

    res.sendStatus(204);
  }
);

export default router;
