import express from 'express'
import { createEvent, getAllEvents, getSingleEvent, updateEvent, deleteEvent } from '../controllers/event.controller.js';

const router = express.Router();

router.post("/", createEvent);
router.get("/", getAllEvents);
router.get("/:id", getSingleEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

export default router;
