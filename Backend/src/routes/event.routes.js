import express from "express";
import {
  bookSeats,
  createEvent,
  getAllEvents,
  getEventById,
  getEventSeats,
  reserveSeats,
} from "../controllers/event.controller.js";

const router = express.Router();

router.post("/createEvent", createEvent);
router.get("/getEvent", getAllEvents);
router.get("/event/:id", getEventById);
router.get("/events/:id/seats", getEventSeats);
router.post("/reserve", reserveSeats)
router.post("/bookings", bookSeats)


export default router;