import express from "express";
import {
  registerEvent,
  cancelRegistration,
  myRegisteredEvents,
} from "../controllers/registration.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:eventId", authMiddleware, registerEvent);

router.put("/:eventId", authMiddleware, cancelRegistration);

router.get("/my-events", authMiddleware, myRegisteredEvents);

export default router;